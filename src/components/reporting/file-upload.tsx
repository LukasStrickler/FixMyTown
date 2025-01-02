"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { IconUpload, IconX } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import type { Dictionary } from "@/dictionaries/dictionary";
import { useToast } from "@/hooks/use-toast";
import heic2any from 'heic2any';
import { Skeleton } from "@/components/ui/skeleton";
import Image from 'next/image';
import { logger } from "@/utils/logger";

const mainVariant = {
    initial: {
        x: 0,
        y: 0,
    },
    animate: {
        x: 20,
        y: -20,
        opacity: 0.9,
    },
};

const secondaryVariant = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
    },
};

const isImageFile = (file: File) => {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/heic', 'image/heif'];
    return validImageTypes.includes(file.type);
};

const convertHeicToJpeg = async (file: File): Promise<File> => {
    if (file.type === 'image/heic' || file.type === 'image/heif') {
        try {
            const convertedBlob = await heic2any({
                blob: file,
                toType: 'image/jpeg',
                quality: 0.8
            });
            return new File(
                [convertedBlob as Blob],
                file.name.replace(/\.(heic|heif)$/i, '.jpg'),
                { type: 'image/jpeg' }
            );
        } catch (error) {
            console.error('HEIC conversion failed:', error);
            return file;
        }
    }
    return file;
};

export const FileUpload = ({
    onChange,
    dictionary,
    setIsImageProcessing,
    setIsImagesValid
}: {
    onChange?: (files: File[]) => void;
    dictionary: Dictionary
    setIsImageProcessing: (isProcessing: boolean) => void
    setIsImagesValid: (isValid: boolean) => void
}) => {
    const [files, setFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileChange = async (newFiles: File[]) => {
        const uniqueNewFiles = newFiles.filter(newFile =>
            !files.some(existingFile =>
                existingFile.name === newFile.name &&
                existingFile.size === newFile.size
            )
        );

        if (uniqueNewFiles.length === 0) {
            toast({
                title: dictionary.components.reportForm.upload.error,
                description: dictionary.components.reportForm.upload.errorDuplicate,
                variant: "destructive",
            });
            return;
        }

        const imageFiles = uniqueNewFiles.filter(isImageFile);
        const hasHeicImages = imageFiles.some(file =>
            file.type === 'image/heic' || file.type === 'image/heif'
        );

        if (hasHeicImages) {
            setIsImageProcessing(true);
        }

        const placeholders = imageFiles.map((file) => {
            if (file.type === 'image/heic' || file.type === 'image/heif') {
                return new File([], file.name, { type: 'image/jpeg' });
            }
            return file;
        });

        setFiles((prevFiles) => [...prevFiles, ...placeholders]);

        const convertedFiles = await Promise.allSettled(
            imageFiles.map(file => convertHeicToJpeg(file))
        );

        if (hasHeicImages) {
            setIsImageProcessing(false);
        }

        const successfulConversions = convertedFiles
            .filter((result): result is PromiseFulfilledResult<File> => result.status === 'fulfilled')
            .map(result => result.value);

        setFiles((prevFiles) => {
            // Replace placeholders with converted files
            const updatedFiles = prevFiles.map(file => {
                if (file.size === 0) {
                    const convertedFile = successfulConversions.find(conv =>
                        conv.name === file.name.replace(/\.(heic|heif)$/i, '.jpg')
                    );
                    return convertedFile ?? file;
                }
                return file;
            });

            const totalSize = updatedFiles.reduce((sum, file) => sum + file.size, 0);
            const wouldExceedSizeLimit = totalSize > 10 * 1024 * 1024; // 10MB in bytes
            const wouldExceedFileLimit = updatedFiles.length > 10;

            if (wouldExceedSizeLimit || wouldExceedFileLimit) {
                setIsImagesValid(false)
                toast({
                    title: dictionary.components.reportForm.upload.error,
                    description: dictionary.components.reportForm.upload.errorDescription,
                    variant: "destructive",
                });
                return prevFiles;
            } else {
                setIsImagesValid(true)
            }

            if (onChange) onChange(updatedFiles);
            return updatedFiles;
        });
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const { getRootProps, isDragActive } = useDropzone({
        multiple: false,
        noClick: true,
        onDrop: (acceptedFiles) => {
            void handleFileChange(acceptedFiles);
        },
        onDropRejected: (error) => {
            logger.error(error);
        },
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/webp': [],
            'image/svg+xml': [],
            'image/heic': [],
            'image/heif': []
        },
    });

    const handleRemoveFile = (indexToRemove: number, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setFiles((prevFiles) => {
            const newFiles = prevFiles.filter((_, idx) => idx !== indexToRemove);

            const totalSize = newFiles.reduce((sum, file) => sum + file.size, 0);
            const wouldExceedSizeLimit = totalSize > 10 * 1024 * 1024; // 10MB in bytes
            const wouldExceedFileLimit = newFiles.length > 10;

            setIsImagesValid(!wouldExceedSizeLimit && !wouldExceedFileLimit);

            if (onChange) onChange(newFiles);
            return newFiles;
        });
    };

    return (
        <div className="w-full" {...getRootProps()}>
            <motion.div
                onClick={handleClick}
                whileHover="animate"
                className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
            >
                <input
                    ref={fileInputRef}
                    id="file-upload-handle"
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/svg+xml,image/heic,image/heif"
                    onChange={(e) => {
                        const fileList = Array.from(e.target.files ?? []);
                        void handleFileChange(fileList);
                        e.target.value = '';
                    }}
                    className="hidden"
                />
                <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
                    <GridPattern />
                </div>
                <div className="flex flex-col items-center justify-center">
                    <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
                        {dictionary.components.reportForm.upload.title}
                    </p>
                    <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2">
                        {dictionary.components.reportForm.upload.description}
                    </p>
                    <div className="relative w-full mt-10 max-w-xl mx-auto">
                        {files.length > 0 &&
                            files.map((file, idx) => (
                                <motion.div
                                    key={"file" + idx}
                                    layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                                    layout="position"
                                    className={cn(
                                        "relative overflow-hidden z-40 bg-neutral-900 flex flex-col items-start justify-start p-2 mt-4 w-full mx-auto rounded-md",
                                        "shadow-sm"
                                    )}
                                >
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleRemoveFile(idx, e);
                                        }}
                                        className="absolute top-2 right-2 p-1 mt-0.5 hover:bg-neutral-800 rounded-full transition-colors"
                                    >
                                        <IconX className="h-4 w-4 text-neutral-500 hover:text-neutral-300 transition-colors" />
                                    </button>
                                    <div className="flex justify-between w-full items-center gap-4 pr-7">
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            layout
                                            className="text-base text-neutral-300 truncate max-w-xs"
                                        >
                                            {file.name}
                                        </motion.p>
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            layout
                                            className="rounded-lg px-2 py-1 w-fit flex-shrink-0 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input"
                                        >
                                            {file.size === 0 ? dictionary.components.reportForm.upload.converting : `${(file.size / (1024 * 1024)).toFixed(2)} MB`}
                                        </motion.p>
                                    </div>

                                    <div className="w-full flex justify-center">
                                        <div className="my-2 rounded-md overflow-hidden border border-neutral-800">
                                            {file.size === 0 ? (
                                                <Skeleton className="w-32 h-32" />
                                            ) : (
                                                <Image
                                                    src={URL.createObjectURL(file)}
                                                    alt={file.name}
                                                    width={128}
                                                    height={128}
                                                    className="w-full h-full object-contain"
                                                    onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full justify-between text-neutral-600 dark:text-neutral-400">
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            layout
                                            className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800"
                                        >
                                            {file.type}
                                        </motion.p>
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            layout
                                        >
                                            {new Date(file.lastModified).toLocaleDateString("de-DE", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric"
                                            })}
                                        </motion.p>
                                    </div>
                                </motion.div>
                            ))}
                        {!files.length && (
                            <motion.div
                                layoutId="file-upload"
                                variants={mainVariant}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20,
                                }}
                                className={cn(
                                    "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                                    "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                                )}
                            >
                                {isDragActive ? (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-neutral-600 flex flex-col items-center"
                                    >
                                        {dictionary.components.reportForm.upload.dropHere}
                                        <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                                    </motion.p>
                                ) : (
                                    <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                                )}
                            </motion.div>
                        )}

                        {!files.length && (
                            <motion.div
                                variants={secondaryVariant}
                                className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
                            ></motion.div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export function GridPattern() {
    const columns = 41;
    const rows = 11;
    return (
        <div className="flex bg-gray-100 dark:bg-neutral-900 flex-shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px  scale-105">
            {Array.from({ length: rows }).map((_, row) =>
                Array.from({ length: columns }).map((_, col) => {
                    const index = row * columns + col;
                    return (
                        <div
                            key={`${col}-${row}`}
                            className={`w-10 h-10 flex flex-shrink-0 rounded-[2px] ${index % 2 === 0
                                ? "bg-gray-50 dark:bg-neutral-950"
                                : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
                                }`}
                        />
                    );
                })
            )}
        </div>
    );
}
