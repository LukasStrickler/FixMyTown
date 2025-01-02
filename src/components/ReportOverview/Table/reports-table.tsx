"use client"

import { columns } from "./columns"
import { DataTable } from "./data-table"
import type { Dictionary } from "@/dictionaries/dictionary"
import type { ReportData } from "@/components/reporting/report"

interface ReportsTableProps {
    reports: ReportData[]
    dictionary: Dictionary
    worker: boolean
}

export function ReportsTable({ reports, dictionary, worker }: ReportsTableProps) {
    return (
        <div className="w-full max-w-[92vw] overflow-auto">
            <DataTable
                columns={columns(dictionary, worker)}
                data={reports}
                dictionary={dictionary}
            />
        </div>
    )
} 