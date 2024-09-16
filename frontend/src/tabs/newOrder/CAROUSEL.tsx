import React, {useEffect, useState} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import ClientService from "@/services/ClientService";
import {AxiosResponse} from "axios";
import {
    Booking,
    BookingMaterial,
    categoryValues,
    Client,
    Material,
    MaterialAvailability, SetupServiceName,
    setupValues
} from "@/model/AllTypes";
import {z} from "zod";
import {clientSchema} from "@/model/schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {DateRangePicker} from "@/components/ui/date-range-picker";
import {DateRange} from "react-day-picker";
import MaterialService from "@/services/MaterialService";
import {formatSetupServiceName} from "@/model/helperFunctions";
import {Cross2Icon} from "@radix-ui/react-icons";
import MaterialTable from "@/components/ui/material-table";
import BookingService from "@/services/BookingService";
import {Checkbox} from "@mui/material";
import {useNavigate} from "react-router-dom";


export function CarouselDemo() {
    const [step, setStep] = useState(1); // State für den aktuellen Schritt
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [clientNameOptions, setClientNameOptions] = useState<string[]>([]);
    const [inputClientName, setInputClientName] = useState<string>("");

    const [availableMaterials, setAvailableMaterials] = useState<MaterialAvailability[]>([]);
    const [bookedMaterials, setBookedMaterials] = useState<BookingMaterial[]>([]);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    });

    const [client, setClient] = useState<Client>();
    // Beispiel-Materialien und -Services

    // Handle Navigation zwischen den Schritten
    const handleNext = () => setStep(step + 1);
    const handlePrev = () => setStep(step - 1);
    const navigate = useNavigate();


    useEffect(() => {
        console.log(selectedServices);
        MaterialService.getAll().then(
            (result: AxiosResponse<Material[]>) => {
                console.log("nach parsen", result.data);
                const finalList = result.data.map((material) => ({
                    material: material, // Kopiert alle bisherigen Attribute des Material-Objekts
                    quantity: 0  // Fügt das neue Attribut "quantity" hinzu und setzt es auf 0
                }));
                setBookedMaterials(finalList);
            }
        )
        if (dateRange?.from && dateRange?.to) {
            console.log("selected date", dateRange.from, dateRange.to);
            MaterialService.getOccupiedQuantity(dateRange.from, dateRange.to)
                .then((result: any) => {
                    console.log("nach parsen", result.data);
                    setAvailableMaterials(result.data);
                })
                .catch((error: any) => {
                    console.error("Error fetching material data:", error);
                });
        }
    }, [dateRange]);

    useEffect(() => {
        // Fetch names of clients from API
        ClientService.getAll().then((response: AxiosResponse<Client[]>) => {
            const namen = response.data.map(client => client.name);
            setClientNameOptions(namen);
        });
    }, []);


    const form = useForm<z.infer<typeof clientSchema>>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            id: undefined,
            name: "",
            phoneNumber: "",
            email: "",
            customerNumber: 0,
            address: {
                street: "",
                houseNumber: "",
                city: "",
                postalCode: ""
            },
        },
        mode: "onSubmit",
    })


    async function onSubmit(values: z.infer<typeof clientSchema>) {
        console.log(values)
        try {
            let response;
            if (values.id == undefined) {
                response = await ClientService.add(values);
            }
            else {
                response = await ClientService.update(values);
            }
            console.log("Kunde erstellt", response.data.id)
            //navigate('/newbooking/material', { state: { id: response.data.id } });
            setClient(response.data);
            form.setValue("id", response.data.id);
            form.setValue("address", response.data.address);
            handleNext();
        } catch (error) {
            console.error("Error creating client:", error);
        }
    }

    function handleClientNameChange(event: React.SyntheticEvent, value: string) {
        setInputClientName(value); // Update the form 'name' field as the user types
    }

    function handleBlur() {
        // If the input value doesn't match any option, still update the form
        form.setValue("name", inputClientName);
    }

    async function handleClientSelect(clientName: string) {
        if (clientName) {
            try {
                const response = await ClientService.getByName(clientName);
                const client = response.data; // Assuming the API returns an array of clients

                // Update the form with the selected client's data
                form.setValue("id", client.id);
                form.setValue("name", client.name);
                form.setValue("phoneNumber", client.phoneNumber);
                form.setValue("email", client.email);
                form.setValue("customerNumber", client.customerNumber);
                form.setValue("address", client.address);
            } catch (error) {
                console.error("Error fetching client details:", error);
            }
        }
    }

    const handleInputChangeBookedMaterial = (materialId: number, newQuantity: number) => {
        setBookedMaterials((prevMaterials) =>
            prevMaterials.map((material) =>
                material.material.id === materialId
                    ? { ...material, quantity: newQuantity }
                    : material
            )
        );
        console.log("bookedMaterials updated:", bookedMaterials);
    };

    const getCardTitle = () => {
        switch (step) {
            case 1:
                return "Buchungsvorgang: Schritt 1 - Kontaktdaten";
            case 2:
                return "Buchungsvorgang: Schritt 2 - Materialien wählen";
            case 3:
                return "Buchungsvorgang: Schritt 3 - Service wählen";
            case 4:
                return "Buchungsvorgang: Schritt 4 - Zusammenfassung";
            default:
                return "Buchungsvorgang";
        }
    };

    async function handleDone() {
        const booked = bookedMaterials.filter(b => b.quantity > 0);
        console.log(booked);
        const b: Booking = {
            id:undefined,
            client: client!,
            bookingMaterials: booked,
            setupServices:  selectedServices.map(s => ({name: s as SetupServiceName})),  // Akzeptiere auch 'null'
            dateDetails:  {
                startDate: dateRange!.from!,
                endDate: dateRange!.to!,
            },
            costDetails: {
                countWeekendRent:0,
                countDailyRent:0,
                deliveryCosts:0
            },
            status: "UNPROCESSED",
            invoiceNumber:""
        }
        await BookingService.save(b);
        navigate("/");
    }
        return (
        <Card>
            <CardHeader>
                <CardTitle style={{ marginBottom: "20px" }}>{getCardTitle()}</CardTitle>
                <Progress value={(step-1)*(100/3)} />
            </CardHeader>
            <CardContent>
                {step === 1 && (
                    <div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Autocomplete
                                                    options={clientNameOptions}
                                                    value={inputClientName}
                                                    getOptionLabel={(option) => option}
                                                    onChange={(_, value) => {
                                                        if (value === null) {
                                                            form.reset();
                                                        }
                                                        field.onChange(value);
                                                        handleClientSelect(value as string);
                                                    }}
                                                    onInputChange={handleClientNameChange}
                                                    onBlur={handleBlur}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Kundenname"
                                                            placeholder="Kundenname"
                                                        />
                                                    )}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="Email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="Telefonnummer" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address.street"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="Straße" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address.houseNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="Hausnummer" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address.postalCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="PLZ" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address.city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="Ort" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type={"submit"}>Weiter</Button>
                            </form>
                        </Form>
                    </div>
                )}

                {step === 2 && (
                    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                        <div className="flex flex-1 items-center space-x-2">
                            <DateRangePicker date={dateRange} setDate={setDateRange}/>
                            {(dateRange!.to) && (
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setDateRange({
                                            from: undefined,
                                            to: undefined,});
                                    }}
                                    className="h-8 px-2 lg:px-3"
                                >
                                    Zurücksetzen
                                    <Cross2Icon className="ml-2 h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <Card style={{ marginTop: "20px", marginBottom: "20px", flex: 1 }} x-chunk="dashboard-07-chunk-1">
                            <CardHeader>
                                <CardTitle>Bestellung</CardTitle>
                            </CardHeader>
                            <CardContent style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                                <Tabs defaultValue="Zelte" className="w-full h-full">
                                    <TabsList>
                                        <TabsTrigger value="Zelte">Zelte</TabsTrigger>
                                        <TabsTrigger value="Tische_Bänke_Stühle">Tische & Bänke</TabsTrigger>
                                        <TabsTrigger value="Licht_Schatten">Licht & Schatten</TabsTrigger>
                                        <TabsTrigger value="Wärme_Kälte">Wärme & Kälte</TabsTrigger>
                                        <TabsTrigger value="Aktivitäten">Aktivitäten</TabsTrigger>
                                    </TabsList>
                                    <div style={{ flex: 1 }}>
                                        {categoryValues.map((categoryName) =>
                                            <TabsContent value={categoryName} className="w-full h-full">
                                                <MaterialTable
                                                    availableMaterials={availableMaterials.filter(m => m.material.category == categoryName)}
                                                    bookedMaterials={bookedMaterials}
                                                    handleInputChangeBookedMaterial={handleInputChangeBookedMaterial}
                                                />
                                            </TabsContent>
                                        )}
                                    </div>
                                </Tabs>
                            </CardContent>
                        </Card>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                            <Button onClick={handlePrev} style={{ marginRight: "20px" }}>Zurück</Button>
                            <Button onClick={handleNext}>Weiter</Button>
                        </div>
                    </div>

                )}

                {step === 3 && (
                    <div>
                        {setupValues.map((service) => (
                            <div className="flex items-center space-x-2" style={{ alignItems: "center", paddingBottom: "10px"}}>
                                <Checkbox
                                    checked={selectedServices.includes(service)}
                                    onChange={(event) => {
                                        const checked = event.target.checked; // Erhalte den Checked-Status direkt aus dem Event
                                        if (checked) {
                                            setSelectedServices([...selectedServices, service]);
                                        } else {
                                            setSelectedServices(selectedServices.filter((s) => s !== service));
                                        }
                                    }}
                                    className="bg-white border border-gray-300 rounded w-6 h-6 flex items-center justify-center"
                                    style={{ color: "black" }}
                                    sx={{
                                        '& .MuiSvgIcon-root': {
                                            borderRadius: '30px', // Hier definierst du die Rundung der Checkbox-Ecken
                                        },
                                    }}
                                />
                                <label
                                    style={{ marginBottom: "0" }} // Entferne den unteren Rand, um das Label korrekt auszurichten
                                    htmlFor="terms"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {formatSetupServiceName(service)}
                                </label>
                            </div>
                        ))}
                        <div style={{paddingTop: "20px"}}>
                            <Button onClick={handlePrev} style={{ marginRight: "20px"}}>Zurück</Button>
                            <Button onClick={handleNext}>Buchung abschließen</Button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div>
                        <h2>Zusammenfassung</h2>
                        <Button onClick={handleDone}>Zurück zur Übersicht</Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
