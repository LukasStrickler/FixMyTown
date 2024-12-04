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
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { ButtonUpload } from "@/components/uploadbutton"


interface ReportingFormProps {
    dictionary: Dictionary
    preselectedType?: string
    showUpload?: boolean
}

export function ReportingForm({ dictionary, preselectedType, showUpload = true }: ReportingFormProps) {
    const router = useRouter()
    const [isLocked, setIsLocked] = useState(false)
    const [locationDescription, setLocationDescription] = useState("")
    const { data: types } = api.report.getTypes.useQuery()
    const { toast } = useToast()
    const [imageIds, setImageIds] = useState<string[]>([])

    const createReport = api.report.create.useMutation({
        onSuccess: () => {
            toast({
                title: dictionary.form.success,
                description: dictionary.form.successDescription,
                variant: "success",
            })
            form.reset()
            router.replace("/myReports")
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

    const registerImages = api.report.registerImages.useMutation()

    const onSubmit = async (data: CreateReportInput) => {
        try {
            // Validate the data before submission
            const validatedData = createReportSchema.parse({
                ...data,
                imageIds,
                prio: data.prio ?? 0
            });

            console.log("Submitting validated data:", validatedData);
            await createReport.mutateAsync(validatedData);
        } catch (error) {
            console.error("Validation or submission error:", error);
            toast({
                title: "Error",
                description: "Please fill in all required fields",
                variant: "destructive",
            });
        }
    }

    const handleLocationSelected = (loc: Location) => {
        form.setValue("latitude", loc.lat)
        form.setValue("longitude", loc.lng)
    }

    const handleAddressChange = (addr: Address) => {
        form.setValue("locationDescription", addr.displayName)
        setLocationDescription(addr.displayName)
    }

    const handleUploadComplete = async (ids: string[]) => {
        try {
            await registerImages.mutateAsync({ imageIds: ids });
            setImageIds(imageIds.concat(ids));
        } catch (error) {
            console.error("Error registering images:", error);
            toast({
                title: "Error",
                description: "Failed to register images",
                variant: "destructive",
            });
        }
    };


    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 w-full max-w-2xl mx-auto px-4 sm:px-6"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                            <SelectTrigger className="w-full">
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
                                        <Input {...field} maxLength={50} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{dictionary.form.description}</FormLabel>
                                <FormControl>
                                    <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="mt-4">
                    <FormItem>
                        <FormLabel>{dictionary.form.location}</FormLabel>
                        <FormControl>
                            <Card>
                                <CardContent className="pt-6">
                                    <LocationPicker
                                        onLocationSelected={handleLocationSelected}
                                        onAddressChange={handleAddressChange}
                                        dictionary={dictionary}
                                        onLockStatusChange={setIsLocked}
                                    />

                                    {locationDescription && (
                                        <>
                                            <Separator className="my-4" />
                                            <div className="flex items-center gap-2">
                                                <MapPin className="text-muted-foreground h-8 w-8" />
                                                <p className="text-sm text-muted-foreground">
                                                    {locationDescription}
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </div>

                {showUpload && (
                    <div className="mt-4">
                        <FormLabel>{dictionary.form.images}</FormLabel>
                        <ButtonUpload onUploadComplete={handleUploadComplete} />
                        {imageIds.length > 0 && (
                            <div className="mt-2 grid grid-cols-2 gap-2">
                                {imageIds.map((id) => (
                                    <img
                                        key={id}
                                        src={`https://uploadthing.com/f/${id}`}
                                        alt="Uploaded image"
                                        className="w-full h-auto"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 flex-wrap">
                    <Button
                        type="submit"
                        disabled={createReport.isPending || !isLocked || !form.formState.isValid}
                        className="shrink-0"
                    >
                        {createReport.isPending ? dictionary.form.submitting : dictionary.form.submit}
                    </Button>
                    {(createReport.isPending || !isLocked || !form.formState.isValid) ? (
                        <p className="text-sm text-muted-foreground flex-1">
                            {dictionary.form.submitInfo}
                        </p>
                    ) : (
                        <p className="text-sm text-green-600 dark:text-green-400 flex-1">
                            {dictionary.form.submitReadyInfo}
                        </p>
                    )}
                </div>
            </form>
        </Form>
    )
}