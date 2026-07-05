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
import { PageShell } from "@/components/PageShell";

export default function BookingOverviewPage() {
    const [buchungen, setBuchungen] = useState<Booking[]>([])
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined)

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
        <PageShell title="Buchungsübersicht">
            <Toaster position="top-center" richColors closeButton />
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                <DateRangePicker date={dateRange} setDate={setDateRange} className="w-full sm:w-auto" />
                {dateRange?.from && (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setDateRange(undefined);
                            loadAll();
                        }}
                        className="h-8 w-full px-2 sm:w-auto lg:px-3"
                    >
                        Zurücksetzen
                        <Cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <DataTable columns={columns} data={buchungen} setData={setBuchungen}/>
        </PageShell>
    )
}
