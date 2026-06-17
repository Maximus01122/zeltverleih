import { columns } from "@/components/ui/columns"
import { DataTable } from "@/components/ui/data-table"
import {useCallback, useEffect, useState} from "react";
import BookingService from "@/services/BookingService";
import {Booking} from "@/model/AllTypes";
import * as React from "react";
import {DateRange} from "react-day-picker";
import {DateRangePicker} from "@/components/ui/date-range-picker";
import {Button} from "@/components/ui/button";
import {Cross2Icon} from "@radix-ui/react-icons";
import {Toaster} from "@/components/ui/sonner";
import Menu from "@/tabs/navigation/menuNew";
import BookingCalendar from "@/components/ui/calendar2";

export default function BookingOverviewPage() {
    const [buchungen, setBuchungen] = useState<Booking[]>([])
    // Initialised as undefined — avoids `!` non-null assertions throughout
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined)

    // Single source of truth for "load all bookings" — used by both the
    // initial mount effect and the reset button to avoid duplication.
    const loadAll = useCallback(() => {
        BookingService.getAll().then(setBuchungen).catch(console.error);
    }, []);

    useEffect(() => { loadAll(); }, [loadAll])

    useEffect(() => {
        if (dateRange?.from && dateRange?.to) {
            BookingService.getByDate(dateRange.from, dateRange.to)
                .then((result: any) => setBuchungen(result.data))
                .catch(console.error);
        } else if (dateRange?.from) {
            BookingService.getByDate(dateRange.from, dateRange.from)
                .then((result: any) => setBuchungen(result.data))
                .catch(console.error);
        }
    }, [dateRange])

    return (
        <>
            {/* hidden md:flex: page is intentionally desktop-only */}
            <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Buchungsübersicht</h2>
                    <Toaster position={"top-right"} richColors={true} closeButton/>
                    <Menu/>
                </div>
                <div className="flex flex-1 items-center space-x-2">
                    <DateRangePicker date={dateRange} setDate={setDateRange}/>
                    {dateRange?.from && (
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setDateRange(undefined);
                                loadAll(); // reuse loadAll — no duplicate getAll() call
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
