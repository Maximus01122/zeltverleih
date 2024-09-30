import {DotsHorizontalIcon} from "@radix-ui/react-icons"
import {Column, Row, Table} from "@tanstack/react-table"

import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    CarouselFull
} from "@/components/ui/carousel"


import {bookingSchema} from "@/model/schema"
import {Booking, Status, statusValues, statusTranslation} from "@/model/AllTypes";
import {Link} from "react-router-dom";
import * as React from "react";
import BookingService from "@/services/BookingService";
import {Input} from "@/components/ui/input";
import {Calendar} from "@/components/ui/calendar";
import {toast} from "sonner"
import AlertDialogFilled from "@/components/ui/alertDialogFilled";

interface DataTableRowActionsProps<TData> {
    row: Row<TData>
    column: Column<TData>,
    table: Table<TData>,
}

export function DataTableRowActions<TData>({row, column, table}: DataTableRowActionsProps<TData>) {

    const [isOpen, setOpen] = React.useState(false)
    const [validUntil, setValidUntil] = React.useState<Date>(new Date())
    const [countDailyRent, setCountDailyRent] = React.useState(0)
    const [countWeekendRent, setCountWeekendRent] = React.useState(0)
    const [deliveryCosts, setDeliveryCosts] = React.useState(0)
    const [invoiceDate, setInvoiceDate] = React.useState<Date>(new Date())
    const [serviceDate, setServiceDate] = React.useState<Date>(new Date())
    const [paymentDate, setPaymentDate] = React.useState<Date>(
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    )


    const handleClose = () => {
        setOpen(false);
        setCountDailyRent(0)
        setCountWeekendRent(0)
        setDeliveryCosts(0)
        setValidUntil(new Date())
        setInvoiceDate(new Date())
        setServiceDate(new Date())
        setPaymentDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
    };

    const handleClickOffer = () => {
        console.log(buchung.client.name, countDailyRent, countWeekendRent, deliveryCosts, validUntil)
        BookingService.createOffer(buchung.id!,
            {
                countDailyRent: countDailyRent,
                countWeekendRent: countWeekendRent,
                deliveryCosts: deliveryCosts}, validUntil).then(
            _ => {
                handleChangeStatus("OFFER_SENT", buchung);
                toast.success("Angebot für " + buchung.client.name + " erstellt");
            }
        ).catch(r => {
            let message:string = `Fehlerhaftes Angebot für ${buchung.client.name}: \n ${r.response?.data.message}`
            console.log(message)
            toast.error(message)
        })
    }

    const handleClickInvoice = () => {
        console.log(buchung.client.name, invoiceDate, serviceDate, paymentDate)
        BookingService.createInvoice(buchung.id!, invoiceDate,
                serviceDate,
                paymentDate).then(
            _ => toast.success("Rechnung für " + buchung.client.name + " erstellt")
        ).catch(r => {
            let message:string = `Fehler bei Rechnung für ${buchung.client.name}: \n ${r.response?.data.message}`
            toast.error(message)
        })
    }

    const handleClickDelete = (rowIndex:number) => {
        BookingService.deleteBuchung(buchung.id!).then(
            _ =>{
                toast.success(`Buchung von ${buchung.client.name} gelöscht`)
                // @ts-ignore
                table.options.meta?.removeRow(rowIndex)
            }
        ).catch(
            r => {
                let message:string = `Buchung von ${buchung.client.name} konnte nicht gelöscht werden: \n ${r.response?.data.message}`
                toast.error(message)})
    }

    const handleClick = () => {
        setOpen(!isOpen)
    }

    const handleChangeStatus = (label:Status, buchung:Booking) => {
        buchung.status = label;
        (row.original as Booking).status = label;
        BookingService.save(buchung)
        // @ts-ignore
        table.options.meta?.updateData(row.index, column.id, label)
    }

    const buchung: Booking = bookingSchema.parse(row.original)
    return (
        <DropdownMenu open={isOpen} onOpenChange={handleClick}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                >
                    <DotsHorizontalIcon className="h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem>
                    <Link to={{pathname: '/singleview'}}
                          style={{textDecoration: 'none', color: 'black'}} state={{id: buchung.id}}>
                        Einzelansicht
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={e => e.preventDefault()}>
                    <AlertDialogFilled buttonName={"Angebot erstellen"}
                                       dialogTitle={"Angebot für " + buchung.client.name}
                                       dialogContent={<div className="grid items-center justify-center gap-3">
                                           <Input type={"number"} placeholder={"Anzahl Tagesmieten"} min={0}
                                                  onChange={e => setCountDailyRent(Number(e.target.value))}/>
                                           <Input type={"number"} placeholder={"Anzahl Wochenendmieten"} min={0}
                                                  onChange={e => setCountWeekendRent(Number(e.target.value))}/>
                                           <Input type={"number"} placeholder={"Lieferpauschale"} min={0}
                                                  onChange={e => setDeliveryCosts(Number(e.target.value))}/>
                                           <div>Angebot gültig bis:</div>
                                           <Calendar
                                               mode="single"
                                               selected={validUntil}
                                               onSelect={(date) => {
                                                   if (date) {
                                                       setValidUntil(date);
                                                   }
                                               }}
                                               className="rounded-md border shadow w-[400px}"
                                           />
                                       </div>}
                                       handleClickBack={handleClose}
                                       handleClickContinue={handleClickOffer}/>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={e => e.preventDefault()} disabled={!["OFFER_ACCEPTED", "PAYMENT_PENDING", "COMPLETED"].includes(buchung.status)}>
                    <AlertDialogFilled buttonName={"Rechnung erstellen"}
                                       dialogTitle={"Rechung für " + buchung.client.name}
                                       dialogContent={
                                           <CarouselFull
                                               names={["Rechnungsdatum", "Leistungsdatum", "Begleichsdatum"]} content={
                                               [
                                                   <Calendar
                                                       mode="single"
                                                       selected={invoiceDate}
                                                       onSelect={(date) => {
                                                           if (date) {
                                                               setInvoiceDate(date);
                                                           }
                                                       }}
                                                   />,
                                                   <Calendar
                                                       mode="single"
                                                       selected={serviceDate}
                                                       onSelect={(date) => {
                                                           if (date) {
                                                               setServiceDate(date);
                                                           }
                                                       }}
                                                   />,
                                                   <Calendar
                                                       mode="single"
                                                       selected={paymentDate}
                                                       onSelect={(date) => {
                                                           if (date) {
                                                               setPaymentDate(date);
                                                           }
                                                       }}
                                                   />
                                               ]
                                           }/>}
                                       handleClickBack={handleClose}
                                       handleClickContinue={handleClickInvoice}/>
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>
                    <Link to={{pathname: '/edit'}}
                          style={{textDecoration: 'none', color: 'black'}} state={{id: buchung.id}}>
                        Bearbeiten
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Status ändern</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup>
                            {statusValues.map((label) => (
                                <DropdownMenuRadioItem
                                    onClick={() => handleChangeStatus(label, buchung) }
                                    key={label}
                                    value={label}>
                                    {statusTranslation[label]}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onSelect={e => e.preventDefault()}>
                    <AlertDialogFilled buttonName={"Löschen"}
                                       dialogTitle={buchung.client.name === "" ?
                                           'Willst du die Booking löschen?'
                                           :
                                           'Willst du die Booking von ' + buchung.client.name + ' löschen?'}
                                       dialogContent={<p>Diese Aktion kann nicht rückgängig gemacht werden.
                                           Diese Buchung wird dauerhaft entfernt.</p>}
                                       handleClickBack={handleClose}
                                       handleClickContinue={ () => handleClickDelete(row.index)}/>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

