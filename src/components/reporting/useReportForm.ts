import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { api } from "@/trpc/react"
import { createReportSchema, type CreateReportInput } from "./report"
import { useToast } from "@/hooks/use-toast"
import { useUploadThing } from "@/lib/uploadthings"
import type { Dictionary } from "@/dictionaries/dictionary"

export function useReportForm(dictionary: Dictionary, preselectedType?: string) {
    const router = useRouter()
    const [files, setFiles] = useState<File[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [isImageProcessing, setIsImageProcessing] = useState(false)
    const { toast } = useToast()

    const form = useForm<CreateReportInput>({
        resolver: zodResolver(createReportSchema),
        defaultValues: {
            type: preselectedType ? parseInt(preselectedType) : undefined,
            prio: 0,
            name: "",
            description: "",
            latitude: undefined,
            longitude: undefined,
            locationDescription: "",
        },
        mode: "onSubmit",
    })

    const createReport = api.report.create.useMutation({
        onError: (error) => {
            console.error("Error creating report:", error)
        }
    })

    const { startUpload } = useUploadThing("imageUploader", {
        onUploadError: (error) => {
            console.error("Error uploading:", error)
            toast({
                title: "Error",
                description: dictionary.form.uploadError,
                variant: "destructive",
            })
        },
    })

    const withMinDuration = async <T,>(promise: Promise<T>, minDuration = 500): Promise<T> => {
        const start = Date.now()
        const result = await promise
        const elapsed = Date.now() - start
        if (elapsed < minDuration) {
            await new Promise(resolve => setTimeout(resolve, minDuration - elapsed))
        }
        return result
    }

    const getLoadingStates = (fileCount: number) => {
        const states = [
            { text: dictionary.form.validatingData },
            { text: dictionary.form.savingReport },
            { text: dictionary.form.redirecting }
        ]

        if (fileCount > 0) {
            states.splice(1, 0, {
                text: `${dictionary.form.uploadingImages} (${fileCount})`
            })
        }

        return states
    }

    const onSubmit = async (data: CreateReportInput) => {
        setIsSubmitting(true)
        setCurrentStep(0)

        try {
            await withMinDuration(Promise.resolve(), 500)
            setCurrentStep(1)

            let finalImageIds: string[] = []

            if (files.length > 0) {
                const uploadResult = await startUpload(files)
                if (!uploadResult) {
                    throw new Error(dictionary.form.uploadError)
                }
                finalImageIds = uploadResult.map((file) => file.key)
                setCurrentStep(2)
            }

            const validatedData = {
                ...data,
                imageIds: finalImageIds,
                prio: data.prio ?? 0
            }

            const reportPromise = new Promise<void>((resolve, reject) => {
                createReport.mutate(validatedData, {
                    onSuccess: () => resolve(),
                    onError: (error) => reject(new Error(error.message))
                })
            })
            await withMinDuration(reportPromise, 500)

            setCurrentStep(files.length > 0 ? 3 : 2)
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
        }
    }

    return {
        form,
        files,
        setFiles,
        isSubmitting,
        currentStep,
        isImageProcessing,
        setIsImageProcessing,
        onSubmit,
        getLoadingStates
    }
}