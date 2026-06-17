// File: useBookingWizard.ts
import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";
import ClientService from "@/services/ClientService";
import BookingService from "@/services/BookingService";
import MaterialService from "@/services/MaterialService";
import {
    Booking,
    BookingMaterial,
    Client,
    Material,
    MaterialAvailability,
    SetupServiceName,
} from "@/model/AllTypes";
import { clientSchema } from "@/model/schema";
import { z } from "zod";
import {
    addBookingMaterialLists,
    addMaterialAvailabilityLists,
} from "@/model/helperFunctions";

const useBookingWizard = (bookingId: number | undefined, navigate: (path: string) => void) => {
    const [step, setStep] = useState(1);
    const [client, setClient] = useState<Client | undefined>();
    const [booking, setBooking] = useState<Booking>();
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [availableMaterials, setAvailableMaterials] = useState<MaterialAvailability[]>([]);
    const [bookedMaterials, setBookedMaterials] = useState<BookingMaterial[]>([]);
    // Fix #9: typed as SetupServiceName[] instead of string[] for type safety
    const [selectedServices, setSelectedServices] = useState<SetupServiceName[]>([]);
    const [comment, setComment] = useState<string>("");
    // Fix #6: isSubmitting guard prevents double-submission on async steps
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fix #13: Capture the initial booking's existing materials in a ref so the
    // availability effect doesn't re-fire when `booking` state changes at step 4→5.
    const initialBookingMaterials = useRef<BookingMaterial[]>([]);

    const stepTitles = [
        "Kontaktdaten",
        "Materialien wählen",
        "Service wählen",
        "Kommentar hinzufügen",
        "Zusammenfassung",
    ];
    const stepTitle = `Schritt ${step}: ${stepTitles[step - 1] || "Buchung"}`;

    // Initialdaten laden
    useEffect(() => {
        if (!bookingId) {
            MaterialService.getAll().then((res) => {
                setBookedMaterials(res.data.map((m: Material) => ({ material: m, quantity: 0 })));
            });
            return;
        }

        const fetchBookingData = async () => {
            try {
                const existingBooking = await BookingService.getBuchung(bookingId);
                setBooking(existingBooking);
                setClient(existingBooking.client);
                setComment(existingBooking.comment || "");
                setDateRange({
                    from: new Date(existingBooking.dateDetails.startDate),
                    to: new Date(existingBooking.dateDetails.endDate),
                });
                // Fix #9: cast to SetupServiceName[] — setupServices names are already that type
                setSelectedServices((existingBooking.setupServices?.map(s => s.name) || []) as SetupServiceName[]);

                // Fix #13: Snapshot existing booking materials once — used in the availability effect
                initialBookingMaterials.current = existingBooking.bookingMaterials;

                const res = await MaterialService.getAll();
                const allItems = res.data.map((m: Material) => ({ material: m, quantity: 0 }));
                setBookedMaterials(addBookingMaterialLists(existingBooking.bookingMaterials, allItems));
            } catch (error) {
                toast.error("Fehler beim Laden der Buchungsdaten");
            }
        };
        fetchBookingData();
    }, [bookingId]);

    // Fix #13: Depends only on dateRange — uses the ref snapshot instead of booking state
    // so this does NOT re-fire when createSummarization sets booking at step 4→5.
    useEffect(() => {
        if (!dateRange?.from || !dateRange?.to) return;

        MaterialService.getAvailableQuantity(dateRange.from, dateRange.to)
            .then(res => {
                const existing = initialBookingMaterials.current;
                const result = existing.length > 0
                    ? addMaterialAvailabilityLists(existing, res.data)
                    : res.data;
                setAvailableMaterials(result);
            });
    }, [dateRange]); // ← booking removed from deps

    const handleNext = () => setStep(prev => prev + 1);
    const handlePrev = () => setStep(prev => prev - 1);
    const handleClose = () => {
        toast.info("Abbruch: Keine Änderungen gespeichert");
        navigate("/");
    };

    const handleNextClient = async (values: z.infer<typeof clientSchema>) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const response = values.id
                ? await ClientService.update(values)
                : await ClientService.add(values);
            setClient(response.data);
            handleNext();
        } catch (err) {
            toast.error("Fehler beim Speichern der Kundendaten");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fix #1: calls checkOrder against the backend before advancing to step 3
    const handleOrderSubmit = async () => {
        if (!dateRange?.from || !dateRange?.to) {
            return toast.error("Bitte wählen Sie einen Zeitraum aus");
        }
        const selected = bookedMaterials.filter(m => m.quantity > 0);
        if (selected.length === 0) {
            return toast.error("Bitte wählen Sie mindestens ein Material aus");
        }
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const isValid = await BookingService.checkOrder({ from: dateRange.from, to: dateRange.to }, selected);
            if (!isValid) {
                toast.error("Ausgewählte Materialien sind im gewählten Zeitraum nicht verfügbar");
                return;
            }
            handleNext();
        } catch (err: any) {
            toast.error(err.message || "Verfügbarkeit konnte nicht geprüft werden");
        } finally {
            setIsSubmitting(false);
        }
    };

    const createSummarization = () => {
        if (!client || !dateRange?.from || !dateRange?.to) return;

        const summary: Booking = {
            id: bookingId,
            client,
            bookingMaterials: bookedMaterials.filter(m => m.quantity > 0),
            setupServices: selectedServices.map(name => ({ name })),
            dateDetails: { startDate: dateRange.from, endDate: dateRange.to },
            costDetails: booking?.costDetails || { countWeekendRent: 0, countDailyRent: 0, deliveryCosts: 0 },
            status: booking?.status || "UNPROCESSED",
            invoiceNumber: booking?.invoiceNumber || 0,
            comment,
        };
        setBooking(summary);
        handleNext();
    };

    const handleDone = async () => {
        if (!booking || isSubmitting) return;
        setIsSubmitting(true);
        try {
            await BookingService.save(booking);
            toast.success("Buchung erfolgreich gespeichert");
            navigate("/");
        } catch {
            toast.error("Fehler beim finalen Speichern");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        step, stepTitle, client, booking, dateRange, setDateRange,
        bookedMaterials, setBookedMaterials, availableMaterials,
        selectedServices, setSelectedServices, comment, setComment,
        handlePrev, handleClose, handleDone, handleNextClient,
        handleOrderSubmit, createSummarization, isSubmitting,
        // Fix #5: service selection is now optional — no guard, always advances
        handleServiceSubmit: handleNext,
    };
};

export default useBookingWizard;