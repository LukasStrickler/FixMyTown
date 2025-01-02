"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { Languages } from "lucide-react"
import type { Dictionary } from "@/dictionaries/dictionary"
import { nativeLanguageNames } from "@/dictionaries/native-names"

export function LanguageSwitcher(
    dictionary: Dictionary
) {
    const router = useRouter()
    const pathname = usePathname()
    const currentLang = pathname.split('/')[1] as 'en' | 'de'

    const switchLanguage = (newLocale: string) => {
        const segments = pathname.split('/')
        segments[1] = newLocale
        const newPath = segments.join('/')
        router.push(newPath)
    }

    const targetLang = currentLang === 'en' ? 'de' : 'en'

    return (
        <div
            className="flex items-center w-full gap-4 cursor-pointer bg-background"
            onClick={() => switchLanguage(targetLang)}
        >
            <Languages className="h-4 w-4 flex-shrink-0 text-primary bg-background" />
            <div className="flex flex-wrap items-center gap-1 bg-background">
                {dictionary.layout.navigation.languageSwitcher.text}
                <span className="font-medium whitespace-nowrap text-foreground bg-background">
                    ({dictionary.layout.navigation.languageSwitcher.languages[targetLang]} / {nativeLanguageNames[targetLang]})
                </span>
            </div>
        </div>
    )
} 