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
    handleNextClient: (values: z.infer<any>) => Promise<void>;
    existingClient?: Client;  // Neue Prop für den bestehenden Kunden
}


export const ClientFormFields: React.FC<ClientFormFieldsProps> = ({handleNextClient, existingClient}) => {
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
        // Fetch names of clients from API
        ClientService.getAll().then((response: AxiosResponse<Client[]>) => {
            const namen = response.data.map(client => client.name);
            setClientNameOptions(namen);
        });
    }, []);

    useEffect(() => {
        if (existingClient !== undefined) {
            console.log(existingClient);
            reset(existingClient);
            setInputClientName(existingClient.name);
        }
    }, [existingClient])

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
                                        getOptionLabel={(option) => option}
                                        value={field.value || null} // Ensure value from form is passed correctly
                                        onChange={(_, value) => {
                                            field.onChange(value); // Update the form state
                                            handleClientSelect(value as string); // Additional handler
                                        }}
                                        onBlur={() => console.log("Input field blurred")}
                                        onInputChange={(_, value) => {
                                            setValue("name", value); // Update form state or local state
                                        }}
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




