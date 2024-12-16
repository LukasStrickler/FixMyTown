import { z } from "zod"

export const createReportSchema = z.object({
    type: z.number({
        required_error: "Type is required",
    }),
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    latitude: z.number({
        required_error: "Location is required",
    }),
    longitude: z.number({
        required_error: "Location is required",
    }),
    locationDescription: z.string().min(1, "Location description is required"),
    prio: z.number().optional(),
    imageIds: z.array(z.string()).optional(),
})

export type CreateReportInput = z.infer<typeof createReportSchema>


export type ReportData = {
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