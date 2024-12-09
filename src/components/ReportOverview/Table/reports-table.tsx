"use client"

import { columns } from "./columns"
import { DataTable } from "./data-table"
import type { Dictionary } from "@/dictionaries/dictionary"

interface ReportsTableProps {
    reports: any[]
    metadata: any
    dictionary: Dictionary
}

export function ReportsTable({ reports, metadata, dictionary }: ReportsTableProps) {
    return (
        <DataTable
            columns={columns(dictionary)}
            data={reports}
            metadata={metadata}
            dictionary={dictionary}
        />
    )
} 