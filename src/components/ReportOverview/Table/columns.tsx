import { type ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Dictionary } from "@/dictionaries/dictionary"

type ReportData = {
    report: {
        id: number
        name: string
        description: string | null
        latitude: number
        longitude: number
        locationDescription: string | null
    }
    protocols: {
        id: number
        time: Date
        statusId: number
        comment: string | null
    }[]
    pictures: {
        id: string
        timestamp: Date
    }[]
    typeId: number
    prioId: number
}

export const columns = (dictionary: Dictionary): ColumnDef<ReportData>[] => [
    {
        accessorKey: "report.name",
        header: dictionary.reportTable.columns.name,
    },
    {
        accessorKey: "report.description",
        header: dictionary.reportTable.columns.description,
    },
    {
        accessorKey: "report.locationDescription",
        header: dictionary.reportTable.columns.location,
    },
    {
        accessorKey: "protocols",
        header: dictionary.reportTable.columns.status,
        cell: ({ row, table }) => {
            const protocols = row.getValue<ReportData["protocols"]>("protocols")
            const latestStatus = protocols[protocols.length - 1]?.statusId
            const metadata = (table.options.meta as { metadata: { statuses: Record<number, { name: string }> } })?.metadata

            if (!latestStatus || !metadata?.statuses[latestStatus]) {
                return null
            }

            return metadata.statuses[latestStatus].name
        },
    },
    {
        accessorKey: "pictures",
        header: dictionary.reportTable.columns.pictures,
        cell: ({ row }) => {
            const pictures = row.getValue<ReportData["pictures"]>("pictures")
            return pictures?.length || 0
        },
    },
    {
        accessorKey: "typeId",
        header: dictionary.reportTable.columns.type,
        cell: ({ row, table }) => {
            const typeId = row.getValue<number>("typeId")
            const metadata = (table.options.meta as { metadata: { types: Record<number, { name: string }> } })?.metadata

            if (!typeId || !metadata?.types[typeId]) {
                return null
            }

            return metadata.types[typeId].name
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const report = row.original
            const copyId = () => {
                if (typeof window !== 'undefined') {
                    void navigator.clipboard.writeText(report.report.id.toString())
                }
            }

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">{dictionary.reportTable.actions.label}</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{dictionary.reportTable.actions.label}</DropdownMenuLabel>
                        <DropdownMenuItem onClick={copyId}>
                            {dictionary.reportTable.actions.copyId}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>{dictionary.reportTable.actions.viewDetails}</DropdownMenuItem>
                        <DropdownMenuItem>{dictionary.reportTable.actions.viewLocation}</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
