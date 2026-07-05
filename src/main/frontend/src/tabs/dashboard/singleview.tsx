import {useLocation, useNavigate} from 'react-router-dom';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import React, {useEffect, useState} from "react";
import {Booking} from "@/model/AllTypes";
import BookingService from "@/services/BookingService";
import {AdresseToString, formatDateRangeDE, formatSetupServiceName} from "@/model/helperFunctions";
import {Button} from "@/components/ui/button";
import {Cross2Icon} from "@radix-ui/react-icons";
import {Textarea} from "@/components/ui/textarea";
import { PageShell } from "@/components/PageShell";

/**
 * Reusable read-only label + input pair.
 * Extracted from the 4 copy-pasted blocks in Kundeninformationen.
 * Each instance gets a unique `id` which fixes the broken <label> accessibility.
 */
function ReadonlyField({ id, label, value }: { id: string; label: string; value: string }) {
    return (
        <div className="grid gap-3">
            <Label htmlFor={id}>{label}</Label>
            <Input id={id} type="text" className="w-full" defaultValue={value} readOnly />
        </div>
    );
}

interface BookingSingleViewProps {
    bookingPreview?: Booking;
    handleDone?: () => Promise<void>;
}

export const BookingSingleView: React.FC<BookingSingleViewProps> = ({ bookingPreview, handleDone }) => {
    const location = useLocation();
    const {id} = location.state || {};
    const [booking, setBooking] = useState<Booking>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // Fix: was inferred as null, set with string
    const navigate = useNavigate();

    const handleClickClose = () => navigate('/');

    // Single effect — handles both the preview prop and the route-state id.
    // The previous duplicate second useEffect([]) that did the same thing has been removed.
    useEffect(() => {
        if (bookingPreview) {
            setBooking(bookingPreview);
            setLoading(false);
            return;
        }
        if (id) {
            BookingService.getBuchung(id)
                .then(data => { setBooking(data); setLoading(false); })
                .catch(err  => { setError(err.message); setLoading(false); });
        }
    }, [id, bookingPreview]);

    if (loading)  return <div>Loading...</div>;
    if (error)    return <div>Error: {error}</div>;
    if (!booking) return <div>No booking found</div>;

    const isEmbedded = !!bookingPreview;

    const content = (
        <div className={`grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8 ${isEmbedded ? '' : ''}`}>

            {/* Kundeninformationen ---------------------------------------- */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Kundeninformationen</CardTitle>
                        <Button
                            variant="ghost"
                            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                            onClick={handleClickClose}
                        >
                            <Cross2Icon className="h-4 w-4"/>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        {/* Each field has a unique id — fixes the broken htmlFor/id accessibility link */}
                        <ReadonlyField id="name"    label="Name"          value={booking.client.name        || "Kein Name gefunden"} />
                        <ReadonlyField id="email"   label="Email"         value={booking.client.email       || "Keine Email gefunden"} />
                        <ReadonlyField id="phone"   label="Telefonnummer" value={booking.client.phoneNumber || "Keine Telefonnummer gefunden"} />
                        <ReadonlyField id="address" label="Adresse"       value={AdresseToString(booking.client.address) || "Keine Adresse gefunden"} />
                    </div>
                </CardContent>
            </Card>

            {/* Mietdauer -------------------------------------------------- */}
            <Card>
                <CardHeader>
                    <CardTitle>Mietdauer</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <div className="grid gap-3">
                            {/* formatDateRangeDE replaces the inline toLocaleDateString + toLocaleString mismatch */}
                            <Input
                                id="date-range"
                                type="text"
                                className="w-full"
                                defaultValue={formatDateRangeDE(
                                    booking.dateDetails.startDate,
                                    booking.dateDetails.endDate
                                )}
                                readOnly
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Bestellung ------------------------------------------------- */}
            <Card>
                <CardHeader>
                    <CardTitle>Bestellung</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Anzahl</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {booking.bookingMaterials.length === 0 ? (
                                <TableRow>
                                    <TableCell align="left" style={{paddingLeft: "2.5%"}}>
                                        keine Bestellung gefunden
                                    </TableCell>
                                </TableRow>
                            ) : (
                                booking.bookingMaterials.map((bm) => (
                                    <TableRow key={bm.id ?? `${bm.material.id}-${bm.material.name}`}>
                                        <TableCell className="min-w-[120px] font-semibold">
                                            {bm.material.name}
                                        </TableCell>
                                        <TableCell className="min-w-[200px] font-semibold">
                                            {/* unique id per row — fixes the duplicate id="material-quantity" */}
                                            <Input
                                                id={`material-quantity-${bm.id ?? bm.material.id}`}
                                                defaultValue={bm.quantity}
                                                readOnly
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Service ---------------------------------------------------- */}
            <Card>
                <CardHeader>
                    <CardTitle>Service</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Fix: the old `?.length == 0` returned undefined when services were
                                null/undefined, which is falsy — so it fell into the .map() branch
                                and crashed. The corrected guard explicitly checks for null/undefined. */}
                            {!booking.setupServices || booking.setupServices.length === 0 ? (
                                <TableRow>
                                    <TableCell align="left" style={{paddingLeft: "2.5%"}}>
                                        kein Service gebucht
                                    </TableCell>
                                </TableRow>
                            ) : (
                                booking.setupServices.map((setupService) => (
                                    <TableRow key={setupService.id ?? setupService.name}>
                                        <TableCell className="min-w-[120px] font-semibold">
                                            {formatSetupServiceName(setupService.name)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Kommentar -------------------------------------------------- */}
            <Card>
                <CardHeader>
                    <CardTitle>Kommentar</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <div className="grid gap-3">
                            <Textarea readOnly>{booking.comment}</Textarea>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {handleDone !== undefined && (
                <Button className="w-full sm:w-auto" onClick={handleDone}>Buchung abschließen</Button>
            )}
        </div>
    );

    if (isEmbedded) {
        return content;
    }

    return (
        <PageShell title="Buchungsdetails">
            {content}
        </PageShell>
    );
};
