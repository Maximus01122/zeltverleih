// DataTableToolbar.tsx
import { Cross2Icon, CalendarIcon, TableIcon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    isCalendarView: boolean
    toggleView: () => void
}

export function DataTableToolbar<TData>({
                                            table,
                                            isCalendarView,
                                            toggleView,
                                        }: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                {!isCalendarView && (
                    <Input
                        placeholder="Kunde suchen..."
                        value={(table.getColumn("client")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => {
                            const searchValue = event.target.value
                            const k = table.getColumn("client")!
                            k.setFilterValue(searchValue)
                        }}
                        className="h-8 w-[150px] lg:w-[250px]"
                    />
                )}
                {isFiltered && !isCalendarView && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Zurücksetzen
                        <Cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <Button
                variant="outline"
                size="sm"
                onClick={toggleView}
                className="ml-2"
            >
                {isCalendarView ? (
                    <>
                        <TableIcon className="mr-2 h-4 w-4" /> Tabelle
                    </>
                ) : (
                    <>
                        <CalendarIcon className="mr-2 h-4 w-4" /> Kalender
                    </>
                )}
            </Button>
        </div>
    )
}
