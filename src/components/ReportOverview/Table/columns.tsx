import type { ColumnDef, Row, Column } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, Filter, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import type { Dictionary } from "@/dictionaries/dictionary"
import { useRouter } from 'next/navigation'
import { type ReportData } from "@/components/reporting/report"

const SortButton = ({ column, children }: {
    column: Column<ReportData, unknown>,
    children: React.ReactNode
}) => {
    const sortDirection = column.getIsSorted()

    return (
        <Button
            variant="ghost"
            onClick={() => {
                if (sortDirection === false) {
                    column.toggleSorting(false)
                } else if (sortDirection === "asc") {
                    column.toggleSorting(true)
                } else {
                    column.clearSorting()
                }
            }}
            className="flex items-center gap-2"
        >
            {children}
            {sortDirection === "asc" ? (
                <ArrowUp className="h-4 w-4" />
            ) : sortDirection === "desc" ? (
                <ArrowDown className="h-4 w-4" />
            ) : (
                <ArrowUpDown className="h-4 w-4" />
            )}
        </Button>
    )
}

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
                    <span className="sr-only">{dictionary.components.reportTable.actions.label}</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{dictionary.components.reportTable.actions.label}</DropdownMenuLabel>
                <DropdownMenuItem onClick={copyId}>
                    {dictionary.components.reportTable.actions.copyId}
                </DropdownMenuItem>
                {worker && <DropdownMenuItem onClick={copyAll}>
                    {dictionary.components.reportTable.actions.copyAll}
                </DropdownMenuItem>}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(worker ? `/worker/report/details/${report.report.id}` : `/myReports/${report.report.id}`)}>
                    {dictionary.common.seeDetails}
                </DropdownMenuItem>
                <DropdownMenuItem>{dictionary.components.reportTable.actions.viewLocation}</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export const columns = (dictionary: Dictionary, worker: boolean): ColumnDef<ReportData>[] => [
    {
        accessorKey: "report.name",
        enableGlobalFilter: true,
        header: ({ column }) => (
            <SortButton column={column}>
                {dictionary.components.reportTable.columns.name}
            </SortButton>
        ),
    },
    {
        accessorKey: "report.description",
        enableGlobalFilter: true,
        header: ({ column }) => (
            <SortButton column={column}>
                {dictionary.components.reportTable.columns.description}
            </SortButton>
        ),
    },
    {
        accessorKey: "report.locationDescription",
        enableGlobalFilter: false,
        header: ({ column }) => (
            <SortButton column={column}>
                {dictionary.components.reportTable.columns.location}
            </SortButton>
        ),
    },
    {
        accessorKey: "protocols",
        enableGlobalFilter: false,
        header: ({ column }) => {
            const filterValue = column.getFilterValue() as string[] || []
            const isFiltered = filterValue.length > 0

            return (
                <div className="flex items-center gap-2">
                    <SortButton column={column}>
                        {dictionary.components.reportTable.columns.status}
                    </SortButton>
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant={isFiltered ? "secondary" : "ghost"}
                                className="h-8 w-8 p-0"
                            >
                                <Filter className={`h-4 w-4 ${isFiltered ? "text-primary" : ""}`} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" onCloseAutoFocus={(e) => e.preventDefault()}>
                            {Object.entries(dictionary.metadata?.statuses || {}).map(([id, status]) => (
                                <DropdownMenuCheckboxItem
                                    key={id}
                                    checked={filterValue.includes(id)}
                                    onSelect={(e) => e.preventDefault()}
                                    onCheckedChange={(_checked) => {
                                        const newFilterValue = filterValue.includes(id)
                                            ? filterValue.filter(item => item !== id)
                                            : [...filterValue, id]
                                        column.setFilterValue(newFilterValue.length ? newFilterValue : undefined)
                                    }}
                                >
                                    {status.name}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
        filterFn: (row, id, value: string[]) => {
            if (!value?.length) return true
            const protocols = row.getValue<ReportData["protocols"]>("protocols")
            const latestStatus = protocols[protocols.length - 1]?.statusId?.toString()
            return latestStatus ? value.includes(latestStatus) : false
        },
        cell: ({ row }) => {
            const protocols = row.getValue<ReportData["protocols"]>("protocols")
            const latestStatus = protocols[protocols.length - 1]?.statusId

            if (!latestStatus || !dictionary.metadata?.statuses?.[String(latestStatus) as keyof typeof dictionary.metadata.statuses]) {
                return null
            }

            return dictionary.metadata.statuses[String(latestStatus) as keyof typeof dictionary.metadata.statuses].name
        },
    },
    {
        accessorKey: "pictures",
        enableGlobalFilter: false,
        header: ({ column }) => (
            <SortButton column={column}>
                {dictionary.components.reportTable.columns.pictures}
            </SortButton>
        ),
        cell: ({ row }) => {
            const pictures = row.getValue<ReportData["pictures"]>("pictures")
            return pictures?.length || 0
        },
    },
    {
        accessorKey: "typeId",
        enableGlobalFilter: false,
        header: ({ column }) => {
            const filterValue = column.getFilterValue() as string[] || []
            const isFiltered = filterValue.length > 0

            return (
                <div className="flex items-center gap-2">
                    <SortButton column={column}>
                        {dictionary.components.reportTable.columns.type}
                    </SortButton>
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant={isFiltered ? "secondary" : "ghost"}
                                className="h-8 w-8 p-0"
                            >
                                <Filter className={`h-4 w-4 ${isFiltered ? "text-primary" : ""}`} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" onCloseAutoFocus={(e) => e.preventDefault()}>
                            {Object.entries(dictionary.metadata?.types || {}).map(([id, type]) => (
                                <DropdownMenuCheckboxItem
                                    key={id}
                                    checked={filterValue.includes(id)}
                                    onSelect={(e) => e.preventDefault()}
                                    onCheckedChange={(_checked) => {
                                        const newFilterValue = filterValue.includes(id)
                                            ? filterValue.filter(item => item !== id)
                                            : [...filterValue, id]
                                        column.setFilterValue(newFilterValue.length ? newFilterValue : undefined)
                                    }}
                                >
                                    {type.name}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
        filterFn: (row, id, value: string[]) => {
            if (!value?.length) return true
            const typeId = row.getValue<number>("typeId")?.toString()
            return value.includes(typeId)
        },
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
        enableGlobalFilter: false,
        header: ({ column }) => (
            <SortButton column={column}>
                {dictionary.components.reportTable.columns.createdAt}
            </SortButton>
        ),
        cell: ({ row }) => {
            const protocols = row.getValue<ReportData["protocols"]>("protocols")
            const firstProtocol = protocols?.[0]
            return firstProtocol?.time ? new Date(firstProtocol.time).toLocaleDateString() : '-'
        },
    },
    {
        id: "actions",
        enableGlobalFilter: false,
        header: dictionary.components.reportTable.actions.label,
        cell: ({ row }) => <ActionCell row={row} dictionary={dictionary} worker={worker} />
    },
]
