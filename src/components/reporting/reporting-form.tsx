"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { Dictionary } from "@/dictionaries/dictionary"
import { api } from "@/trpc/react"
import { createReportSchema, type CreateReportInput } from "@/components/reporting/report"
import LocationPicker, { type Location, type Address } from "@/components/LocationPicker/LocationPicker"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface ReportingFormProps {
    dictionary: Dictionary
    preselectedType?: string
}

export function ReportingForm({ dictionary, preselectedType }: ReportingFormProps) {
    const router = useRouter()
    const [location, setLocation] = useState<Location>()
    const [address, setAddress] = useState<Address>()
    const [isLocked, setIsLocked] = useState(false)
    const { data: types } = api.report.getTypes.useQuery()
    const { data: prios } = api.report.getPrios.useQuery()

    const createReport = api.report.create.useMutation({
        onSuccess: () => {
            router.replace("/report")
        },
        onError: (error) => {
            console.error("Error creating report:", error)
        }
    })

    const form = useForm<CreateReportInput>({
        resolver: zodResolver(createReportSchema),
        defaultValues: {
            type: preselectedType ? parseInt(preselectedType) : undefined,
            prio: 0, // default prio is 0 (unset)
            name: "",
            description: "",
            latitude: undefined,
            longitude: undefined,
            locationDescription: "",
        },
        mode: "onSubmit",
    })

    const onSubmit = async (data: CreateReportInput) => {
        try {
            await createReport.mutateAsync(data)
        } catch (error) {
            console.error("Error submitting form:", error)
        }
    }

    const handleLocationSelected = (loc: Location) => {
        setLocation(loc)
        form.setValue("latitude", loc.lat)
        form.setValue("longitude", loc.lng)
    }

    const handleAddressChange = (addr: Address) => {
        setAddress(addr)
        form.setValue("locationDescription", addr.displayName)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{dictionary.form.type}</FormLabel>
                            <Select
                                onValueChange={(value) => field.onChange(parseInt(value))}
                                defaultValue={field.value?.toString()}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder={dictionary.form.selectType} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {types?.map((type) => (
                                        <SelectItem key={type.id} value={type.id.toString()}>
                                            {type.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{dictionary.form.name}</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{dictionary.form.description}</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <LocationPicker
                    onLocationSelected={handleLocationSelected}
                    onAddressChange={handleAddressChange}
                    dictionary={dictionary}
                    onLockStatusChange={setIsLocked}
                />

                <Button type="submit" disabled={createReport.isPending || !isLocked}>
                    {createReport.isPending ? dictionary.form.submitting : dictionary.form.submit}
                </Button>
            </form>
        </Form>
    )
}