"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Dictionary } from '@/dictionaries/dictionary';
import type { Locale } from '@/i18n-config';

type DictionaryContextType = {
    dictionary: Dictionary | null;
    setLocale: (locale: Locale) => void;
};

const DictionaryContext = createContext<DictionaryContextType | undefined>(undefined);

export const DictionaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [dictionary, setDictionary] = useState<Dictionary | null>(null);

    const loadDictionary = async (locale: Locale) => {
        try {
            const module = await import(`@/dictionaries/${locale}.json`);
            setDictionary(module.default);
        } catch (error) {
            console.error('Error loading dictionary:', error);
        }
    };

    const setLocale = (locale: Locale) => {
        loadDictionary(locale);
    };

    useEffect(() => {
        // Load default language on mount
        loadDictionary('de');
    }, []);

    return (
        <DictionaryContext.Provider value={{ dictionary, setLocale }}>
            {children}
        </DictionaryContext.Provider>
    );
};

export const useDictionary = (): DictionaryContextType => {
    const context = useContext(DictionaryContext);
    if (!context) {
        throw new Error('useDictionary must be used within a DictionaryProvider');
    }
    return context;
};