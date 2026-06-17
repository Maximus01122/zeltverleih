import {DotsHorizontalIcon} from "@radix-ui/react-icons"
import {Column, Row, Table as TanstackTable} from "@tanstack/react-table"

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
import {Booking, Status, statusValues, statusTranslation, setupValues} from "@/model/AllTypes";
import {Link} from "react-router-dom";
import * as React from "react";
import BookingService from "@/services/BookingService";
import {Input} from "@/components/ui/input";
import {Calendar} from "@/components/ui/calendar";
import {toast} from "sonner"
import {AlertDialogFilled} from "@/components/ui/alertDialogFilled";

import {de} from "date-fns/locale";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {TrashIcon, PlusIcon} from "@radix-ui/react-icons";

interface DataTableRowActionsProps<TData> {
    row: Row<TData>
    column: Column<TData>,
    table: TanstackTable<TData>,
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
    const [invoiceItems, setInvoiceItems] = React.useState<any[]>([])


    const handleClose = () => {
        setOpen(false);
        handleOnWindowClose();
    };

    const handleOnWindowClose = () => {
        setCountDailyRent(0)
        setCountWeekendRent(0)
        setDeliveryCosts(0)
        setValidUntil(new Date())
        setInvoiceDate(new Date())
        setServiceDate(new Date())
        setPaymentDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
        setInvoiceItems([])
    }

    const handleClickOffer = () => {
        BookingService.createOffer(buchung.id!,
            {
                countDailyRent: countDailyRent,
                countWeekendRent: countWeekendRent,
                deliveryCosts: deliveryCosts
            }, validUntil).then(
            _ => {
                toast.success("Angebot für " + buchung.client.name + " erstellt");
            }
        ).catch(r => {
            const message: string = `Fehlerhaftes Angebot für ${buchung.client.name}: \n ${r.response?.data.message}`
            toast.error(message)
        }).finally(
            () => {
                handleOnWindowClose();
            }
        )
    }

    const handleClickInvoice = () => {
        BookingService.createInvoice(buchung.id!, invoiceDate,
            serviceDate,
            paymentDate,
            invoiceItems).then(
            _ => toast.success("Rechnung für " + buchung.client.name + " erstellt")
        ).catch(r => {
            let message: string = `Fehler bei Rechnung für ${buchung.client.name}: \n ${r.response?.data.message}`
            toast.error(message)
        }).finally(
            () => {
                handleOnWindowClose();
            }
        )
    }

    const handleLoadPreview = async () => {
        try {
            const preview = await BookingService.getInvoicePreview(buchung.id!);
            setInvoiceItems(preview);
        } catch (e) {
            toast.error("Vorschau konnte nicht geladen werden");
        }
    }

    const updateInvoiceItem = (index: number, field: string, value: any) => {
        const newItems = [...invoiceItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setInvoiceItems(newItems);
    }

    const addInvoiceItem = () => {
        setInvoiceItems([...invoiceItems, { name: "Neues Element", quantity: "1", price: 0 }]);
    }

    const removeInvoiceItem = (index: number) => {
        setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
    }

    const handleClickDelete = (rowIndex: number) => {
        BookingService.deleteBuchung(buchung.id!).then(
            _ => {
                toast.success(`Buchung von ${buchung.client.name} gelöscht`)
                // @ts-ignore
                table.options.meta?.removeRow(rowIndex)
            }
        ).catch(
            r => {
                let message: string = `Buchung von ${buchung.client.name} konnte nicht gelöscht werden: \n ${r.response?.data.message}`
                toast.error(message)
            })
    }

    const handleClick = () => {
        setOpen(!isOpen)
    }

    // Fix: awaited with error handling; direct state mutation removed (updateData handles UI)
    const handleChangeStatus = async (label: Status, bookingId: number) => {
        try {
            await BookingService.setStatus(bookingId, label);
            // @ts-ignore
            table.options.meta?.updateData(row.index, column.id, label);
        } catch {
            toast.error("Status konnte nicht geändert werden");
        }
    }

    const buchung: Booking = bookingSchema.parse(row.original)
    const serviceNames = buchung.setupServices?.map(service => service.name) || [];
    // Fix: use the literal instead of magic index setupValues[1]
    const isLieferung = serviceNames.includes("LIEFERUNG");

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
                                           <Input
                                               disabled={!isLieferung}
                                               type={"number"} placeholder={isLieferung? "Lieferpauschale": "keine Lieferung nötig"} min={0}
                                               onChange={e => setDeliveryCosts(Number(e.target.value))}/>
                                           <div>Angebot gültig bis:</div>
                                           <Calendar
                                               locale={de}
                                               mode="single"
                                               selected={validUntil}
                                               onSelect={(date) => {
                                                   if (date) {
                                                       setValidUntil(date);
                                                   }
                                               }}
                                               className="rounded-md border shadow w-[400px]"
                                           />
                                       </div>}
                                       handleClickBack={handleClose}
                                       handleClickContinue={handleClickOffer}/>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={e => {
                    e.preventDefault();
                    handleLoadPreview();
                }}
                                  disabled={!["OFFER_ACCEPTED", "PAYMENT_PENDING", "COMPLETED"].includes(buchung.status)}>
                    <AlertDialogFilled buttonName={"Rechnung erstellen"}
                                       dialogTitle={"Rechung für " + buchung.client.name}
                                       dialogContent={
                                           <CarouselFull
                                               names={["Rechnungsdatum", "Leistungsdatum", "Fälligkeitsdatum", "Positionen anpassen"]}
                                               content={
                                                   [
                                                       <Calendar
                                                           locale={de}
                                                           mode="single"
                                                           selected={invoiceDate}
                                                           onSelect={(date) => {
                                                               if (date) {
                                                                   setInvoiceDate(date);
                                                               }
                                                           }}
                                                       />,
                                                       <Calendar
                                                           locale={de}
                                                           mode="single"
                                                           selected={serviceDate}
                                                           onSelect={(date) => {
                                                               if (date) {
                                                                   setServiceDate(date);
                                                               }
                                                           }}
                                                       />,
                                                       <Calendar
                                                           locale={de}
                                                           mode="single"
                                                           selected={paymentDate}
                                                           onSelect={(date) => {
                                                               if (date) {
                                                                   setPaymentDate(date);
                                                               }
                                                           }}
                                                       />,
                                                       <div className="w-full max-h-[400px] overflow-y-auto px-4">
                                                           <Table>
                                                               <TableHeader>
                                                                   <TableRow>
                                                                       <TableHead>Bezeichnung</TableHead>
                                                                       <TableHead>Menge</TableHead>
                                                                       <TableHead>Preis (€)</TableHead>
                                                                       <TableHead></TableHead>
                                                                   </TableRow>
                                                               </TableHeader>
                                                               <TableBody>
                                                                   {invoiceItems.map((item, index) => (
                                                                       <TableRow key={index}>
                                                                           <TableCell>
                                                                               <Input
                                                                                   value={item.name}
                                                                                   onChange={(e) => updateInvoiceItem(index, 'name', e.target.value)}
                                                                               />
                                                                           </TableCell>
                                                                           <TableCell>
                                                                               <Input
                                                                                   value={item.quantity}
                                                                                   onChange={(e) => updateInvoiceItem(index, 'quantity', e.target.value)}
                                                                                   className="w-16"
                                                                               />
                                                                           </TableCell>
                                                                           <TableCell>
                                                                               <Input
                                                                                   type="number"
                                                                                   value={item.price}
                                                                                   onChange={(e) => updateInvoiceItem(index, 'price', parseFloat(e.target.value))}
                                                                                   className="w-24"
                                                                               />
                                                                           </TableCell>
                                                                           <TableCell>
                                                                               <Button
                                                                                   variant="ghost"
                                                                                   size="icon"
                                                                                   onClick={() => removeInvoiceItem(index)}
                                                                               >
                                                                                   <TrashIcon className="h-4 w-4 text-red-500" />
                                                                               </Button>
                                                                           </TableCell>
                                                                       </TableRow>
                                                                   ))}
                                                               </TableBody>
                                                           </Table>
                                                           <Button
                                                               variant="outline"
                                                               size="sm"
                                                               className="mt-2 w-full"
                                                               onClick={addInvoiceItem}
                                                           >
                                                               <PlusIcon className="mr-2 h-4 w-4" /> Position hinzufügen
                                                           </Button>
                                                       </div>
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
                                    onClick={() => handleChangeStatus(label, buchung.id!)}
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
                                           'Willst du die Buchung löschen?'
                                           :
                                           'Willst du die Buchung von ' + buchung.client.name + ' löschen?'}
                                       dialogContent={<p>Diese Aktion kann nicht rückgängig gemacht werden.
                                           Diese Buchung wird dauerhaft entfernt.</p>}
                                       handleClickBack={handleClose}
                                       handleClickContinue={() => handleClickDelete(row.index)}/>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

