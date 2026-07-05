import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {DateRange} from "react-day-picker";
import {CalendarIcon} from "@radix-ui/react-icons";
import {de} from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";


type DateRangePickerProps = {
    date: DateRange | undefined,
    setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
    className?: string
}

function formatDateLabel(date: Date, compact: boolean): string {
    if (compact) {
        return date.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }
    return date.toLocaleDateString('de-DE', {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export function DateRangePicker({date, setDate, className}: DateRangePickerProps) {
    const isMobile = useIsMobile();

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-full max-w-full justify-start text-left font-normal sm:max-w-md md:max-w-lg",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                        <span className="truncate">
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {formatDateLabel(date.from, isMobile)} – {formatDateLabel(date.to, isMobile)}
                                    </>
                                ) : (
                                    formatDateLabel(date.from, isMobile)
                                )
                            ) : (
                                "Datum auswählen"
                            )}
                        </span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto max-w-[calc(100vw-2rem)] p-0" align="start">
                    <Calendar
                        locale={de}
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={isMobile ? 1 : 2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
