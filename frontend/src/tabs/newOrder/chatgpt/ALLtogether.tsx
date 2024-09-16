import React, {useEffect, useState} from "react";
import {Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {Toaster} from "@/components/ui/sonner";
import {Progress} from "@/components/ui/progress"
import {MaterialSelection} from "./MaterialSelection";
import {clientSchema} from "@/model/schema";
import ClientService from "@/services/ClientService";
import BookingService from "@/services/BookingService";
import MaterialService from "@/services/MaterialService";
import {
    Booking,
    Client,
    BookingMaterial,
    MaterialAvailability,
    SetupServiceName,
    Material,
    setupValues
} from "@/model/AllTypes";
import {useLocation, useNavigate} from "react-router-dom";
import {DateRange} from "react-day-picker";
import {AxiosResponse} from "axios/index";
import {z} from "zod";
import {ClientFormFields} from "@/tabs/newOrder/FormContactDetails";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@mui/material";
import {addMaterialAvailabilityLists, addMaterialLists, formatSetupServiceName} from "@/model/helperFunctions";
import {toast} from "sonner";
import {BookingSingleView} from "@/tabs/bookings/singleview";


export const CarouselBooking = () => {
    const location = useLocation();
    const {id:bookingProps} = location.state || {}; // Extrahiere die ID aus dem State
    const [step, setStep] = useState(1);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [availableMaterials, setAvailableMaterials] = useState<MaterialAvailability[]>([]);
    const [bookedMaterials, setBookedMaterials] = useState<BookingMaterial[]>([]);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({from: undefined, to: undefined});
    const [client, setClient] = useState<Client | undefined>();
    const [booking, setBooking] = useState<Booking>();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("bookingProps", bookingProps)
        BookingService.getBuchung(bookingProps).then(
            (existingBooking: Booking) => {
                setBooking(existingBooking);
                setDateRange({from:new Date(existingBooking.dateDetails.startDate),
                                    to: new Date(existingBooking.dateDetails.endDate)});
                setBookedMaterials(existingBooking.bookingMaterials);
                console.log("existing", );
            }
        )
    }, [bookingProps]);

    useEffect(() => {
        if (dateRange?.from && dateRange?.to) {
            console.log("selected date", dateRange.from, dateRange.to);
            MaterialService.getOccupiedQuantity(dateRange.from, dateRange.to)
                .then((result: any) => {
                    setAvailableMaterials(result.data);
                })
                .catch((error: any) => {
                    console.error("Error fetching material data:", error);
                });
        }
        else {
            setAvailableMaterials([]);
        }

        MaterialService.getAll().then(
            (result: AxiosResponse<Material[]>) => {
                let finalList = result.data.map((material) => ({
                    material: material, // Kopiert alle bisherigen Attribute des Material-Objekts
                    quantity: 0  // Fügt das neue Attribut "quantity" hinzu und setzt es auf 0
                }));
                if (booking) {
                    finalList = addMaterialAvailabilityLists(booking.bookingMaterials, finalList)
                    console.log("finalList2", finalList);
                }
                setBookedMaterials(finalList);
            }
        )
    }, [dateRange]);

    // Handle Navigation zwischen den Schritten
    const handleNext = () => setStep(step + 1);
    const handlePrev = () => setStep(step - 1);

    async function handleNextClient (values: z.infer<typeof clientSchema>) {
        console.log(values)
        try {
            let response;
            if (values.id == undefined) {
                response = await ClientService.add(values);
            } else {
                response = await ClientService.update(values);
            }
            console.log("Kunde erstellt", response.data.id)

            setClient(response.data);
            //form.setValue("id", response.data.id);
            //form.setValue("address", response.data.address);
            handleNext();
        } catch (error) {
            console.error("Error creating client:", error);
        }
        setStep(step + 1);
    }

    const handleNextMaterial = () => setStep(step + 1);
    const handleNextService = () => setStep(step + 1);


    const handleOrderSubmit = () => {
        console.log("bookedMaterials", bookedMaterials)
        if (bookedMaterials.filter((bm) => bm.quantity > 0).length === 0)
            toast.error("Die Bestellung darf nicht leer sein")
        else
            setStep(step + 1);
    }

    function createSummarization() {
        if (selectedServices.length === 0)
            toast.error("Mindestens ein Service muss ausgewählt werden")
        else {
            const booked = bookedMaterials.filter(b => b.quantity > 0);
            const b: Booking = {
                id: undefined,
                client: client!,
                bookingMaterials: booked,
                setupServices: selectedServices.map(s => ({name: s as SetupServiceName})),  // Akzeptiere auch 'null'
                dateDetails: {
                    startDate: dateRange!.from!,
                    endDate: dateRange!.to!,
                },
                costDetails: {
                    countWeekendRent: 0,
                    countDailyRent: 0,
                    deliveryCosts: 0
                },
                status: "UNPROCESSED",
                invoiceNumber: ""
            }
            setBooking(b);
            setStep(step + 1);
        }
    }


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
        const b: Booking = {
            id: undefined,
            client: client!,
            bookingMaterials: booked,
            setupServices: selectedServices.map(s => ({name: s as SetupServiceName})),  // Akzeptiere auch 'null'
            dateDetails: {
                startDate: dateRange!.from!,
                endDate: dateRange!.to!,
            },
            costDetails: {
                countWeekendRent: 0,
                countDailyRent: 0,
                deliveryCosts: 0
            },
            status: "UNPROCESSED",
            invoiceNumber: ""
        }
        await BookingService.save(b);
        navigate("/");
    }

    return (
        <Card>
            <Toaster position={"top-right"} richColors={true} closeButton/>
            <CardHeader>
                <CardTitle style={{marginBottom: "20px"}}>{getCardTitle()}</CardTitle>
                <Progress value={(step - 1) * (100 / 3)}/>
            </CardHeader>
            <CardContent>
                {step === 1 && <ClientFormFields bookingId={bookingProps} handleNextClient={handleNextClient} />}

                {step === 2 && (
                    <MaterialSelection
                        availableMaterials={availableMaterials}
                        bookedMaterials={bookedMaterials}
                        setBookedMaterials={setBookedMaterials}
                        dateRange={dateRange}
                        setDateRange={setDateRange}
                        handlePrev={handlePrev}
                        handleNext={handleOrderSubmit}
                    />
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
                            <Button onClick={createSummarization}>Weiter</Button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div>
                        <BookingSingleView bookingPreview={booking} showMenu={false}/>
                        <Button onClick={handleDone}>Buchung abschließen</Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

/*
{step === 1 && (


                )}
 */
