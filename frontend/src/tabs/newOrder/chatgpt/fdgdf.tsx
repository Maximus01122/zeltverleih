import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {Client} from "@/model/AllTypes";
import {clientSchema} from "@/model/schema";


// TypeScript-Typ für das Formular basierend auf dem Schema
type Kunde = z.infer<typeof clientSchema>;

interface KundendatenProps {
    onNext: (kunde: Kunde) => void;
}

const Kundendaten: React.FC<KundendatenProps> = ({ onNext }) => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<Kunde>({
        resolver: zodResolver(clientSchema),
    });

    const onSubmit = (data: Kunde) => {
        onNext(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h2>Kundendaten</h2>

            <div>
                <label>Vorname</label>
                <input
                    type="text"
                    {...register('name')}
                    placeholder="Vorname"
                />
                {errors.name && <span>{errors.name.message}</span>}
            </div>

            <div>
                <label>Email</label>
                <input
                    type="email"
                    {...register('email')}
                    placeholder="E-Mail"
                />
                {errors.email && <span>{errors.email.message}</span>}
            </div>

            <button type="submit">Weiter</button>
        </form>
    );
};

export default Kundendaten;
