import { i18n } from '@/i18n-config';

export const getNativeLanguageName = (locale: string) => {
    return new Intl.DisplayNames([locale], { type: 'language' }).of(locale);
};

export const nativeLanguageNames = i18n.locales.reduce((acc, locale) => ({
    ...acc,
    [locale]: getNativeLanguageName(locale)
}), {} as Record<(typeof i18n.locales)[number], string>);

export type SupportedLanguage = keyof typeof nativeLanguageNames; 