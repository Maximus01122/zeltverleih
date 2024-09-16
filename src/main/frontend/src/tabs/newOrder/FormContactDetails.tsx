import React, {useEffect, useState} from "react";
import {FormField, FormItem, FormControl, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import ClientService from "@/services/ClientService";
import {AxiosResponse} from "axios";
import {Client} from "@/model/AllTypes";
import {z} from "zod";
import {clientSchema} from "@/model/schema";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm, FormProvider, useFormContext} from "react-hook-form";
import {Button} from "@/components/ui/button";
import BookingService from "@/services/BookingService";


interface ClientFormFieldsProps {
    bookingId?: number;
    handleNextClient: (values: z.infer<any>) => Promise<void>;
}

export const ClientFormFields: React.FC<ClientFormFieldsProps> = ({bookingId, handleNextClient}) => {
    const [clientNameOptions, setClientNameOptions] = useState<string[]>([]);
    const [inputClientName, setInputClientName] = useState<string>("");


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
    const {setValue, control, reset} = form


    useEffect(() => {
        console.log("bookingId", bookingId)
        if (bookingId !== undefined) {
            BookingService.getBuchung(bookingId)
                .then(data => {
                    console.log("BookingID found", data);
                    reset(data.client);
                    setInputClientName(data.client.name);
                })
                .catch(error => {
                });
        }
    }, [bookingId])


    useEffect(() => {
        // Fetch names of clients from API
        ClientService.getAll().then((response: AxiosResponse<Client[]>) => {
            const namen = response.data.map(client => client.name);
            setClientNameOptions(namen);
        });
    }, []);

    // Bei Auswahl eines existierenden Kunden, lade dessen Details
    async function handleClientSelect(clientName: string | undefined) {
        if (clientName) {
            try {
                const response = await ClientService.getByName(clientName);
                const client = response.data;

                // Setze die Daten des existierenden Kunden ins Formular
                setValue("id", client.id);
                setValue("name", client.name);
                setValue("phoneNumber", client.phoneNumber);
                setValue("email", client.email);
                setValue("customerNumber", client.customerNumber);
                setValue("address.street", client.address.street);
                setValue("address.houseNumber", client.address.houseNumber);
                setValue("address.city", client.address.city);
                setValue("address.postalCode", client.address.postalCode);
            } catch (error) {
                console.error("Fehler beim Laden der Kundendaten:", error);
            }
        } else {
            // Wenn der Name kein existierender Kunde ist, zurücksetzen und neuen Kunden anlegen
            reset({name: clientName, id: undefined});
        }
    }

    /*<Autocomplete
        options={clientNameOptions}
        //value={inputClientName}
        getOptionLabel={(option) => option}
        onChange={(_, value) => {
            if (value === null) {
                reset();
            }
            field.onChange(value);
            handleClientSelect(value as string);
        }}
        //onInputChange={handleClientNameChange}
        renderInput={(params) => (
            <TextField {...params} label="Kundenname" placeholder="Kundenname"/>
        )}
    />*/
    return (
        <>
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(handleNextClient)} className="space-y-8">
                    <FormField
                        control={control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Autocomplete
                                        options={clientNameOptions}
                                        value={inputClientName}
                                        getOptionLabel={(option) => option}
                                        onChange={(_, value) => {
                                            if (value === null) {
                                                reset();
                                            }
                                            field.onChange(value);
                                            handleClientSelect(value as string);
                                        }}
                                        onInputChange={(_, value) =>setInputClientName(value)}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Kundenname" placeholder="Kundenname"/>
                                        )}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Email" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="phoneNumber"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Telefonnummer" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="address.street"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Straße" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="address.houseNumber"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Hausnummer" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="address.postalCode"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="PLZ" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="address.city"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Ort" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <div className="button-container">
                        <Button type="submit">Weiter</Button>
                    </div>
                </form>
            </FormProvider>
        </>
    );
};




