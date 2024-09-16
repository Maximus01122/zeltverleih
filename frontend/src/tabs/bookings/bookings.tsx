import { columns } from "@/components/ui/columns"
import { DataTable } from "@/components/ui/data-table"
import {useEffect, useState} from "react";
import BookingService from "@/services/BookingService";
import {Booking} from "@/model/AllTypes";
import * as React from "react";
import {DateRange} from "react-day-picker";
import {DateRangePicker} from "@/components/ui/date-range-picker";
import {Button} from "@/components/ui/button";
import {Cross2Icon} from "@radix-ui/react-icons";
import {Toaster} from "@/components/ui/sonner";
import Menu from "@/tabs/navigation/menuNew";

export default function BookingOverviewPage() {
    const [buchungen, setBuchungen] = useState<Booking[]>([])
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    })

    useEffect(() => {
        BookingService.getAll().then(
            value => setBuchungen(value)
    )
    }, [])

    useEffect(() => {
        if (date!.from && date!.to){
            BookingService.getByDate(date!.from,date!.to)
                .then((result: any) => {
                    setBuchungen(result.data);
                })
        }
        else if (date!.from){
            BookingService.getByDate(date!.from, date!.from)
                .then((result: any) => {
                    setBuchungen(result.data);
                })

        }
    }, [date])

    return (
        <>
            <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Buchungsübersicht</h2>
                    <Toaster position={"top-right"} richColors={true} closeButton/>
                    <Menu/>
                </div>
                <div className="flex flex-1 items-center space-x-2">
                    <DateRangePicker date={date} setDate={setDate}/>
                    {(date!.to) && (
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setDate({
                                    from: undefined,
                                    to: undefined,});
                                BookingService.getAll().then(value => setBuchungen(value))
                            }}
                            className="h-8 px-2 lg:px-3"
                        >
                            Zurücksetzen
                            <Cross2Icon className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>
                <DataTable columns={columns} data={buchungen} setData={setBuchungen}/>
            </div>
        </>

    )
}
