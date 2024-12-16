import { type ColumnDef, type Row } from "@tanstack/react-table"
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
import { useRouter } from 'next/navigation'
import { type ReportData } from "@/components/reporting/report"
const ActionCell = ({ row, dictionary, worker }: { row: Row<ReportData>; dictionary: Dictionary, worker: boolean }) => {
    const router = useRouter()
    const report = row.original

    const copyId = () => {
        if (typeof window !== 'undefined') {
            void navigator.clipboard.writeText(report.report.id.toString())
        }
    }

    const copyAll = () => {
        if (typeof window !== 'undefined') {
            void navigator.clipboard.writeText(JSON.stringify(report))
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
                {worker && <DropdownMenuItem onClick={copyAll}>
                    {dictionary.reportTable.actions.copyAll}
                </DropdownMenuItem>}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(worker ? `/worker/report/details/${report.report.id}` : `/myReports/${report.report.id}`)}>
                    {dictionary.common.seeDetails}
                </DropdownMenuItem>
                <DropdownMenuItem>{dictionary.reportTable.actions.viewLocation}</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const columns = (dictionary: Dictionary, worker: boolean): ColumnDef<ReportData>[] => [
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
        cell: ({ row }) => {
            const protocols = row.getValue<ReportData["protocols"]>("protocols")
            const latestStatus = protocols[protocols.length - 1]?.statusId

            if (!latestStatus || !dictionary.metadata?.statuses?.[latestStatus.toString() as keyof typeof dictionary.metadata.statuses]) {
                return null
            }

            return dictionary.metadata.statuses[latestStatus.toString() as keyof typeof dictionary.metadata.statuses].name
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
        cell: ({ row }) => {
            const typeId = row.getValue<number>("typeId")

            if (!typeId || !dictionary.metadata?.types?.[typeId.toString() as keyof typeof dictionary.metadata.types]) {
                return null
            }

            return dictionary.metadata.types[typeId.toString() as keyof typeof dictionary.metadata.types].name
        },
    },
    {
        accessorKey: "createdAt",
        header: dictionary.reportTable.columns.createdAt,
        cell: ({ row }) => {
            const protocols = row.getValue<ReportData["protocols"]>("protocols")
            const firstProtocol = protocols?.[0]
            return firstProtocol?.time ? new Date(firstProtocol.time).toLocaleDateString() : '-'
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <ActionCell row={row} dictionary={dictionary} worker={worker} />
    },
]