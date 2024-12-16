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
        <DataTable
            columns={columns(dictionary, worker)}
            data={reports}
            dictionary={dictionary}
        />
    )
} 