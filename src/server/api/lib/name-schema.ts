import { z } from "zod";
import type { Dictionary } from "@/dictionaries/dictionary";

const DEFAULT_MESSAGES = {
    empty: "Name empty",
    tooShort: "Name too short",
    tooLong: "Name too long",
    invalidChars: "Name contains forbidden chars"
} as const;

export const getNameSchema = (dictionary?: Dictionary | null) => {
    const messages = dictionary
        ? {
            empty: dictionary.pages.auth.account.editNameDialog.nameEmpty,
            tooShort: dictionary.pages.auth.account.editNameDialog.nameTooShort,
            tooLong: dictionary.pages.auth.account.editNameDialog.nameTooLong,
            invalidChars: dictionary.pages.auth.account.editNameDialog.nameNumbers,
        }
        : DEFAULT_MESSAGES;

    return z.string()
        .min(1, { message: messages.empty })
        .transform(val => val.trim())
        .refine(
            val => val.length >= 3,
            { message: messages.tooShort }
        )
        .refine(
            val => val.length <= 50,
            { message: messages.tooLong }
        )
        .refine(
            val => /^[\p{L}\s]*$/u.test(val),
            { message: messages.invalidChars }
        );
};

// For backwards compatibility and direct usage in server-side code
export const nameSchema = getNameSchema();

export type NameSchema = ReturnType<typeof getNameSchema>;
export type NameSchemaType = z.infer<NameSchema>;