"use client"

import { columns, ReportData } from "./columns"
import { DataTable } from "./data-table"
import type { Dictionary } from "@/dictionaries/dictionary"

interface ReportsTableProps {
    reports: ReportData[]
    dictionary: Dictionary
}

export function ReportsTable({ reports, dictionary }: ReportsTableProps) {
    return (
        <DataTable
            columns={columns(dictionary)}
            data={reports}
            dictionary={dictionary}
        />
    )
} 