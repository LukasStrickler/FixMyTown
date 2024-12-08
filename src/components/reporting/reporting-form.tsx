"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
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
import dynamic from 'next/dynamic';
import { Skeleton } from "../ui/skeleton"
import { MultiStepLoader } from "./multi-step-loader"
import { useUploadThing } from "@/lib/uploadthings"

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
    const router = useRouter()
    const [isLocked, setIsLocked] = useState(false)
    const [locationDescription, setLocationDescription] = useState("")
    const { data: types } = api.report.getTypes.useQuery()
    const { toast } = useToast()
    const [imageIds, setImageIds] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [files, setFiles] = useState<File[]>([])
    const [uploadComplete, setUploadComplete] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [isImageProcessing, setIsImageProcessing] = useState(false)

    const getLoadingStates = (fileCount: number) => {
        const states = [
            { text: dictionary.form.validatingData },
            { text: dictionary.form.savingReport },
            { text: dictionary.form.redirecting }
        ]

        // Add image upload state if there are files
        if (fileCount > 0) {
            states.splice(1, 0, {
                text: `${dictionary.form.uploadingImages} (${fileCount})`
            })
        }

        return states
    }

    const createReport = api.report.create.useMutation({
        onSuccess: () => {

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

    // const registerImages = api.report.registerImages.useMutation()

    const { startUpload, isUploading } = useUploadThing("imageUploader", {
        onClientUploadComplete: (res) => {
            const uploadedImageIds = res?.map((file) => file.key) ?? [];
            setImageIds(uploadedImageIds);
            setUploadComplete(true);

            // toast({
            //     title: dictionary.form.uploadSuccess,
            //     description: dictionary.form.uploadSuccessDescription,
            //     variant: "success",
            // });
        },
        onUploadError: (error) => {
            console.error("Error uploading:", error);
            toast({
                title: "Error",
                description: dictionary.form.uploadError,
                variant: "destructive",
            });
        },
    });

    const withMinDuration = async <T,>(promise: Promise<T>, minDuration: number = 500): Promise<T> => {
        const start = Date.now();
        const result = await promise;
        const elapsed = Date.now() - start;
        if (elapsed < minDuration) {
            await new Promise(resolve => setTimeout(resolve, minDuration - elapsed));
        }
        return result;
    };

    const onSubmit = async (data: CreateReportInput) => {
        setIsSubmitting(true)
        setCurrentStep(0) // Start with validating data

        try {
            // Validation step - minimum 500ms
            await withMinDuration(Promise.resolve(), 500)
            setCurrentStep(1)

            let finalImageIds: string[] = [];

            if (files.length > 0) {
                // Image upload step
                const uploadPromise = startUpload(files)
                const uploadResult = await uploadPromise
                if (!uploadResult) {
                    throw new Error(dictionary.form.uploadError)
                }
                finalImageIds = uploadResult.map((file) => file.key)
                setCurrentStep(2)
            }

            // Prepare and submit data
            const validatedData = {
                ...data,
                imageIds: finalImageIds,
                prio: data.prio ?? 0
            }

            // Create report step
            const reportPromise = new Promise<void>((resolve, reject) => {
                createReport.mutate(validatedData, {
                    onSuccess: () => resolve(),
                    onError: (error) => reject(error)
                })
            })
            // Wrap the report creation in withMinDuration
            await withMinDuration(reportPromise, 500)

            setCurrentStep(files.length > 0 ? 3 : 2)

            // Final success and redirect step - ensure it lasts at least 1 second
            await withMinDuration(Promise.resolve(), 1000)

            toast({
                title: dictionary.form.success,
                description: dictionary.form.successDescription,
                variant: "success",
            })
            form.reset()
            router.replace("/myReports")
        } catch (error) {
            console.error("Error during submission:", error)

            let errorMessage = dictionary.form.generalError
            if (error instanceof Error) {
                switch (error.message) {
                    case "form.uploadError":
                        errorMessage = dictionary.form.uploadError
                        break
                    case "form.generalError":
                        errorMessage = dictionary.form.generalError
                        break
                    default:
                        errorMessage = error.message
                }
            }

            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
            setUploadComplete(false)
        }
    }

    //on is locked, trigger validation of latitude and longitude
    useEffect(() => {
        if (isLocked) {
            void form.trigger(["latitude", "longitude"])
        }
    }, [isLocked])

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
                            <FormLabel>{dictionary.form.images}</FormLabel>
                            <FileUpload onChange={handleUploadComplete} dictionary={dictionary} setIsImageProcessing={setIsImageProcessing} />
                        </div>
                    )}

                    <div className="flex items-center gap-4 flex-wrap">
                        <Button
                            type="submit"
                            disabled={createReport.isPending || !isLocked || !form.formState.isValid || isImageProcessing}
                            className="shrink-0"
                        >
                            {createReport.isPending ? dictionary.form.submitting : dictionary.form.submit}
                        </Button>
                        {(createReport.isPending || !isLocked || !form.formState.isValid || isImageProcessing) ? (
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
        </>
    )
}