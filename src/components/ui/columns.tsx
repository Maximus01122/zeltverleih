import {ColumnDef} from "@tanstack/react-table"
import {DataTableColumnHeader} from "./data-table-column-header"
import {DataTableRowActions} from "./data-table-row-actions"
import {Booking, Client, statusTranslation} from "@/model/AllTypes";

const getStatusColor = (status: string) => {
    switch (status) {
        case 'UNPROCESSED':
            return 'text-blue-500'; // Blau für unbearbeitete Buchungen
        case 'OFFER_SENT':
            return 'text-yellow-500'; // Gelb für gesendete Angebote
        case 'OFFER_REJECTED':
            return 'text-red-500'; // Rot für abgelehnte Angebote
        case 'OFFER_ACCEPTED':
            return 'text-green-500'; // Grün für akzeptierte Angebote
        case 'PAYMENT_PENDING':
            return 'text-orange-500'; // Orange für ausstehende Zahlungen
        case 'COMPLETED':
            return 'text-gray-500'; // Grau für abgeschlossene Buchungen
        default:
            return 'text-gray-600'; // Standardfarbe für unbekannte Stati
    }
}

export const columns: ColumnDef<Booking>[] = [
    {
        accessorKey: 'client',
        accessorFn: data => data["client"]["name"],
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Kunde"/>
        ),
        cell: ({row}) => {
            const client: Client = row.original.client;
            return (
                <div className="flex space-x-1">
                  <span className="flex w-[300px] items-center">
                      {client.name}
                  </span>
                </div>
            )
        },
        enableHiding: false,
    },
    {
        accessorKey: "startDate",
        accessorFn: data => data["dateDetails"]["startDate"],
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Startdatum"/>
        ),
        cell: ({row}) => {
            return (
                <div className="flex space-x-1">
          <span className="max-w-[80px] truncate font-medium">
            {new Date(
                row.getValue("startDate"))
                .toLocaleDateString('de-DE', {year: 'numeric', month: '2-digit', day: '2-digit'})}
          </span>
                </div>
            )
        },
    },
    {
        accessorKey: "endDate",
        accessorFn: data => data["dateDetails"]["endDate"],
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Enddatum"/>
        ),
        cell: ({row}) => {
            return (
                <div className="flex space-x-1">
          <span className="max-w-[80px] truncate font-medium">
            {new Date(
                row.getValue("endDate"))
                .toLocaleDateString('de-DE', {year: 'numeric', month: '2-digit', day: '2-digit'})}
          </span>
                </div>
            )
        },
    },
    {
        accessorKey: "offerDate",
        accessorFn: data => data["dateDetails"]["offerDate"],
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Angebot von"/>
        ),
        cell: ({row}) => {
            return (
                <div className="flex space-x-1">
          <span className="max-w-[80px] truncate font-medium">
            {new Date(
                row.getValue("offerDate"))
                .toLocaleDateString('de-DE', {year: 'numeric', month: '2-digit', day: '2-digit'})}
          </span>
                </div>
            )
        },
    },
    {
        accessorKey: "status",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Status"/>
        ),
        cell: ({row}) => {
            const status = row.original.status;
            const colorClass = getStatusColor(status);

            return (
                <div className={`flex space-x-1 ${colorClass}`}>
                <span className="max-w-[100%] truncate font-medium">
                    {statusTranslation[status]}
                </span>
                </div>
            )
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({row, column, table}) => {
            return (<DataTableRowActions column={column} row={row} table={table}/>)
        },
    }
]
