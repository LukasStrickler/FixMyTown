import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { api } from "@/trpc/react"
import { createReportSchema, type CreateReportInput } from "./report"
import { useToast } from "@/hooks/use-toast"
import { useUploadThing } from "@/lib/uploadthings"
import type { Dictionary } from "@/dictionaries/dictionary"
import { logger } from "@/lib/logger"

export function useReportForm(
    dictionary: Dictionary,
    language: string,
    preselectedType?: string,
) {
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
            language: language,
        },
        mode: "onSubmit",
    })

    const createReport = api.report.create.useMutation({
        onError: (error) => {
            logger.error("Error creating report:", error)
        }
    })

    const { startUpload } = useUploadThing("imageUploader", {
        onUploadError: (error) => {
            logger.error("Error uploading:", error)
            toast({
                title: "Error",
                description: dictionary.components.reportForm.uploadError,
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
            { text: dictionary.components.reportForm.validatingData },
            { text: dictionary.components.reportForm.savingReport },
            { text: dictionary.components.reportForm.redirecting }
        ]

        if (fileCount > 0) {
            states.splice(1, 0, {
                text: `${dictionary.components.reportForm.uploadingImages} (${fileCount})`
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
                    throw new Error(dictionary.components.reportForm.uploadError)
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
                title: dictionary.components.reportForm.success,
                description: dictionary.components.reportForm.successDescription,
                variant: "success",
            })
            form.reset()
            router.replace("/myReports")
        } catch (error) {
            logger.error("Error during submission:", error)
            let errorMessage = dictionary.components.reportForm.generalError
            if (error instanceof Error) {
                switch (error.message) {
                    case "components.reportForm.uploadError":
                        errorMessage = dictionary.components.reportForm.uploadError
                        break
                    case "components.reportForm.generalError":
                        errorMessage = dictionary.components.reportForm.generalError
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