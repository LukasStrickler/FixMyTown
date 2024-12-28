"use client"

import { useEffect, useState } from "react"
import type { Dictionary } from "@/dictionaries/dictionary"
import { api } from "@/trpc/react"
import LocationPicker, { type Location, type Address } from "@/components/LocationPicker/LocationPicker"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import dynamic from 'next/dynamic'
import { Skeleton } from "../ui/skeleton"
import { MultiStepLoader } from "./multi-step-loader"
import { useReportForm } from "./useReportForm"

interface ReportingFormProps {
    dictionary: Dictionary
    preselectedType?: string
    showUpload?: boolean
}

// Dynamic import with loading state
const FileUpload = dynamic(
    () => import('@/components/reporting/file-upload').then(mod => mod.FileUpload),
    {
        loading: () => <Skeleton className="w-full h-48" />,
        ssr: false
    }
);

export function ReportingForm({ dictionary, preselectedType, showUpload = true }: ReportingFormProps) {
    const {
        form,
        files,
        setFiles,
        isSubmitting,
        currentStep,
        isImageProcessing,
        setIsImageProcessing,
        onSubmit,
        getLoadingStates
    } = useReportForm(dictionary, preselectedType)
    const [locationDescription, setLocationDescription] = useState("")
    const [isLocked, setIsLocked] = useState(false)

    const types = Object.entries(dictionary.metadata.types).map(([id, type]) => ({
        id,
        name: type.name
    }))

    //on is locked, trigger validation of latitude and longitude
    useEffect(() => {
        if (isLocked) {
            void form.trigger(["latitude", "longitude"])
        }
    }, [form, isLocked])

    const handleLocationSelected = (loc: Location) => {
        form.setValue("latitude", loc.lat)
        form.setValue("longitude", loc.lng)
    }

    const handleAddressChange = (addr: Address) => {
        form.setValue("locationDescription", addr.displayName)
        setLocationDescription(addr.displayName)
    }

    const handleUploadComplete = (newFiles: File[]) => {
        setFiles(newFiles);
    };

    return (
        <>
            <MultiStepLoader
                loadingStates={getLoadingStates(files.length)}
                loading={isSubmitting}
                currentStep={currentStep}
            />
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
                                        <FormLabel>{dictionary.components.reportForm.type}</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(parseInt(value))}
                                            defaultValue={field.value?.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder={dictionary.components.reportForm.selectType} />
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
                                        <FormLabel>{dictionary.components.reportForm.name}</FormLabel>
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
                                    <FormLabel>{dictionary.components.reportForm.description}</FormLabel>
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
                            <FormLabel>{dictionary.components.reportForm.location}</FormLabel>
                            <FormControl>
                                <Card>
                                    <CardContent className="pt-6 relative z-10">
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
                            <FormLabel>{dictionary.components.reportForm.images}</FormLabel>
                            <FileUpload onChange={handleUploadComplete} dictionary={dictionary} setIsImageProcessing={setIsImageProcessing} />
                        </div>
                    )}

                    <div className="flex items-center gap-4 flex-wrap">
                        <Button
                            type="submit"
                            disabled={isSubmitting || !isLocked || !form.formState.isValid || isImageProcessing}
                            className="shrink-0"
                        >
                            {isSubmitting ? dictionary.components.reportForm.submitting : dictionary.components.reportForm.submit}
                        </Button>
                        {(isSubmitting || !isLocked || !form.formState.isValid || isImageProcessing) ? (
                            <p className="text-sm text-muted-foreground flex-1">
                                {dictionary.components.reportForm.submitInfo}
                            </p>
                        ) : (
                            <p className="text-sm text-green-600 dark:text-green-400 flex-1">
                                {dictionary.components.reportForm.submitReadyInfo}
                            </p>
                        )}
                    </div>
                </form>
            </Form>
        </>
    )
}