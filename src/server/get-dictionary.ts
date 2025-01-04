import "server-only";
import type { Locale } from "../i18n-config";

type AllowedLanguage = "de" | "en";

// Define the structure of your dictionary
import { type Dictionary } from "../dictionaries/dictionary";

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries: Record<AllowedLanguage, () => Promise<Dictionary>> = {
    de: () => import("../dictionaries/de.json").then((module): Dictionary => module.default),
    en: () => import("../dictionaries/en.json").then((module): Dictionary => module.default),

};

function validateLanguage(lang: string): AllowedLanguage {
    return lang === "de" ? "de" : "en";
}

const dictionaryCache: Partial<Record<AllowedLanguage, Dictionary>> = {};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
    const lang = validateLanguage(locale);

    // Return cached version if available
    if (dictionaryCache[lang]) {
        return dictionaryCache[lang];
    }

    // Load and cache if not available
    const dictionary = await dictionaries[lang]();
    dictionaryCache[lang] = dictionary;
    return dictionary;
};
