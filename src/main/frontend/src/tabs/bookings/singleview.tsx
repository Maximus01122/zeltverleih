import {useLocation} from 'react-router-dom';
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
import {AdresseToString, formatSetupServiceName} from "@/model/helperFunctions";
import Menu from "@/tabs/navigation/menuNew";
import {Button} from "@/components/ui/button";

interface BookingSingleViewProps {
    bookingPreview?: Booking;
    handleDone?:  () => Promise<void>
}

export const BookingSingleView: React.FC<BookingSingleViewProps> = ({ bookingPreview,handleDone }) => {
    const location = useLocation();
    const {id} = location.state || {}; // Extrahiere die ID aus dem State
    const [booking, setBooking] = useState<Booking>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            BookingService.getBuchung(id)
                .then(data => {
                    console.log("singleview", data);
                    setBooking(data);
                    setLoading(false);
                })
                .catch(error => {
                    setError(error.message);
                    setLoading(false);
                });
        }
    }, [id])

    useEffect(() => {
        if (bookingPreview) {
            setBooking(bookingPreview);
            setLoading(false);
        }
    }, [])

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!booking) return <div>No booking found</div>;

    return (
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8 p-4 lg:p-8">
            <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Kundeninformationen</CardTitle>
                        {handleDone === undefined ? <Menu/> : <></>}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <div className="grid gap-3">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                className="w-full"
                                defaultValue={booking.client.name || "Kein Name gefunden"}
                                readOnly={true}
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="text"
                                className="w-full"
                                defaultValue={booking.client.email || "Keine Email gefunden"}
                                readOnly={true}
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="description">Telefonnummer</Label>
                            <Input
                                id="description"
                                defaultValue={booking.client.phoneNumber || "Keine Telefonnummer gefunden"}
                                className="w-full"
                                readOnly={true}
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="description">Adresse</Label>
                            <Input
                                id="description"
                                defaultValue={AdresseToString(booking.client.address) || "Keine Adresse gefunden"}
                                className="w-full"
                                readOnly={true}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Mietdauer</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <div className="grid gap-3">
                            <Input
                                id="name"
                                type="text"
                                className="w-full"
                                defaultValue={new Date(booking.dateDetails.startDate).toLocaleDateString('de-DE', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    }) + " - " +
                                    new Date(booking.dateDetails.endDate).toLocaleString('de-DE', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',}
                                    )}
                                readOnly={true}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card x-chunk="dashboard-07-chunk-1">
                <CardHeader>
                    <CardTitle>Bestellung</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Anzahl</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {booking.bookingMaterials.length == 0 ?
                                <TableRow>
                                    <TableCell align='left' style={{paddingLeft: "2.5%"}}>
                                        keine Bestellung gefunden
                                    </TableCell>
                                </TableRow>
                                :
                                booking.bookingMaterials.map((bookingMaterial) => (
                                    <TableRow>
                                        <TableCell className="font-semibold w-[100px]">
                                            {bookingMaterial.material.name}
                                        </TableCell>
                                        <TableCell className="font-semibold w-[350px]">
                                            <Input
                                                id="material-quantity"
                                                defaultValue={bookingMaterial.quantity}
                                                readOnly={true}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card x-chunk="dashboard-07-chunk-2">
                <CardHeader>
                    <CardTitle>Service</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {booking.setupServices?.length == 0 ?
                                <TableRow>
                                    <TableCell align='left' style={{paddingLeft: "2.5%"}}>
                                        kein Service gebucht
                                    </TableCell>
                                </TableRow>
                                :
                                booking.setupServices!.map((setupService) => (
                                    <TableRow>
                                        <TableCell className="font-semibold w-[100px]">
                                            {formatSetupServiceName(setupService.name)}
                                        </TableCell>
                                    </TableRow>)
                                )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            {handleDone == undefined ? <></> : <Button onClick={handleDone}>Buchung abschließen</Button>}
        </div>
    )
}



