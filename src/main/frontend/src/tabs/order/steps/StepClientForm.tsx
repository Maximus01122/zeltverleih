import React, { useEffect, useState } from "react";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import ClientService from "@/services/ClientService";
import { AxiosResponse } from "axios";
import { Client } from "@/model/AllTypes";
import { z } from "zod";
import { clientSchema } from "@/model/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";

interface StepClientFormProps {
    onNext: (values: z.infer<typeof clientSchema>) => Promise<void>;
    client?: Client;
}

const StepClientForm: React.FC<StepClientFormProps> = ({ onNext, client }) => {
    const [clientNameOptions, setClientNameOptions] = useState<string[]>([]);

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
                postalCode: "",
            },
        },
    });

    const { control, reset } = form;

    useEffect(() => {
        ClientService.getAll().then((response: AxiosResponse<Client[]>) => {
            const names = response.data.map((client) => client.name);
            setClientNameOptions(names);
        });
    }, []);

    useEffect(() => {
        if (client) {
            reset(client);
        }
    }, [client, reset]);

    async function handleClientSelect(clientName: string | undefined) {
        if (clientName) {
            try {
                const response = await ClientService.getByName(clientName);
                // Fix: use reset() instead of 8 individual setValue calls
                reset(response.data);
            } catch (error) {
                console.error("Fehler beim Laden der Kundendaten:", error);
            }
        } else {
            reset({ name: clientName, id: undefined });
        }
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onNext)} className="space-y-8">
                <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Autocomplete
                                    options={clientNameOptions}
                                    getOptionLabel={(option) => option}
                                    value={field.value || null}
                                    onChange={(_, value) => {
                                        field.onChange(value);
                                        handleClientSelect(value as string);
                                    }}
                                    onInputChange={(_, value) => {
                                        form.setValue("name", value);
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Kundenname" placeholder="Kundenname" />
                                    )}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {[
                    { name: "email", placeholder: "Email" },
                    { name: "phoneNumber", placeholder: "Telefonnummer" },
                    { name: "address.street", placeholder: "Straße" },
                    { name: "address.houseNumber", placeholder: "Hausnummer" },
                    { name: "address.postalCode", placeholder: "PLZ" },
                    { name: "address.city", placeholder: "Ort" },
                ].map((fieldItem) => (
                    <FormField
                        key={fieldItem.name}
                        control={control}
                        name={fieldItem.name as any}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder={fieldItem.placeholder} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}

                <div className="button-container">
                    <Button type="submit">Weiter</Button>
                </div>
            </form>
        </FormProvider>
    );
};

export default StepClientForm;
