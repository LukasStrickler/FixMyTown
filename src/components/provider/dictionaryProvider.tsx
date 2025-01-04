"use client";
import React, { createContext, useState, useEffect } from 'react';
import type { Dictionary } from '@/dictionaries/dictionary';
import type { Locale } from '@/i18n-config';
import { usePathname } from 'next/navigation';
import { logger } from '@/lib/logger';

export type DictionaryContextType = {
    dictionary: Dictionary | null;
    setLocale: (locale: Locale) => void;
};

export const DictionaryContext = createContext<DictionaryContextType | undefined>(undefined);

export const DictionaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [dictionary, setDictionary] = useState<Dictionary | null>(null);
    const [previousLocale, setPreviousLocale] = useState<Locale | null>(null);
    const pathname = usePathname();

    const loadDictionary = async (locale: Locale) => {
        if (locale === previousLocale) return;

        try {
            const dict = await import(`@/dictionaries/${locale}.json`) as { default: Dictionary };
            setDictionary(dict.default);
            setPreviousLocale(locale);
        } catch (error) {
            logger.error('Error loading dictionary:', error);
        }
    };

    const setLocale = (locale: Locale) => {
        void loadDictionary(locale);
    };

    useEffect(() => {
        const urlLang = pathname.split('/')[1] as Locale;
        if (urlLang && (urlLang === 'en' || urlLang === 'de')) {
            void loadDictionary(urlLang);
        }
    }, [pathname]);

    return (
        <DictionaryContext.Provider value={{ dictionary, setLocale }}>
            {children}
        </DictionaryContext.Provider>
    );
};

