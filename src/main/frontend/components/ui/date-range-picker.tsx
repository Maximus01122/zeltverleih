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
import {addDays, format} from "date-fns";
import {CalendarIcon} from "@radix-ui/react-icons";


type dateProps = {
    date:DateRange | undefined,
    setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}


export function DateRangePicker({date, setDate}: dateProps, {className}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[500px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-8" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {date.from.toLocaleDateString('de-DE',{
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })} - {" "}
                                    {date.to.toLocaleDateString('de-DE', {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </>
                            ) : (
                                date.from.toLocaleDateString('de-DE',{
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })
                            )
                        ) : (
                            <span>Datum auswählen</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
