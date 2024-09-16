import { z } from "zod";
import {Booking, categoryValues, statusValues, setupValues, Address} from "@/model/AllTypes";

// Address schema
const addressSchema = z.object({
    id: z.number().optional(),
    street: z.string(),
    houseNumber: z.string(),
    city: z.string(),
    postalCode: z.string(),
});

// Schema für Client
const clientSchema = z.object({
    id: z.number().optional(),
    email: z.string(),
    name: z.string().refine((val) => val.trim().length > 0, {
        message: "Der Name darf nicht leer sein oder nur aus Leerzeichen bestehen",
    }),
    phoneNumber: z.string(),
    customerNumber: z.number().optional(),
    address: addressSchema
});

// Schema für SetupService
const setupServiceSchema = z.object({
    id: z.number().optional(),
    name: z.enum(setupValues),
    price: z.number(),
});

// Schema für LoadingFee
const loadingFeeSchema = z.object({
    id: z.number().optional(),
    name: z.string(),
    price: z.number(),
});

// Schema für CostDetails
const costDetailsSchema = z.object({
    countDailyRent: z.number(),
    countWeekendRent: z.number(),
    deliveryCosts: z.number(),
});

// Schema für DateDetails
const dateDetailsSchema = z.object({
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    offerDate: z.coerce.date().optional(),
    validUntil: z.coerce.date().optional(),
});

// Schema für Material
const materialSchema = z.object({
    id: z.number().optional(),
    name: z.string(),
    count: z.number(),
    category: z.enum(categoryValues),
    materialPrices: z.array(z.any()),

});

// Schema für BookingMaterial
const bookingMaterialSchema = z.object({
    id: z.number().optional(),
    material: materialSchema,
    quantity: z.number(),
    booking: z.lazy(() => bookingSchema).optional(), // Markiere das Feld 'booking' als optional
});

// Booking schema
const bookingSchema: z.ZodType<Booking> = z.object({
    id: z.any().optional(),
    client: clientSchema,
    bookingMaterials: z.array(bookingMaterialSchema),
    setupServices: z.array(setupServiceSchema).nullable().optional(),
    loadingFee: loadingFeeSchema.nullable().optional(),
    dateDetails: dateDetailsSchema,
    costDetails: costDetailsSchema,
    status: z.enum(statusValues),
    invoiceNumber: z.string().optional(),
});

export { bookingSchema, clientSchema};
