"use client";
import { type DictionaryContextType, DictionaryContext } from '@/components/provider/dictionaryProvider';
import { useContext } from 'react';
export const useDictionary = (): DictionaryContextType => {
    const context = useContext(DictionaryContext);
    if (!context) {
        throw new Error('useDictionary must be used within a DictionaryProvider');
    }
    return context;
};