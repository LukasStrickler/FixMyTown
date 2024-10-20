import "server-only";
import type { Locale } from "./i18n-config";

type AllowedLanguage = "de";

// Define the structure of your dictionary
import { type Dictionary } from "./dictionaries/dictionary";

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries: Record<AllowedLanguage, () => Promise<Dictionary>> = {
    //   en: () => import("./dictionaries/en.json").then((module): Dictionary => module.default),
    de: () => import("./dictionaries/de.json").then((module): Dictionary => module.default),
};

function validateLanguage(lang: string): AllowedLanguage {
    return lang === "de" ? "de" : "de";
}

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
    dictionaries[validateLanguage(locale)]();
