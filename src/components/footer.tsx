import React from "react";
import Link from "next/link";
import { TextHoverEffect } from "./ui/text-hover-effect";
import type { Dictionary } from "@/dictionaries/dictionary";

export function Footer({ dictionary }: { dictionary: Dictionary }) {
    return (
        <footer className="min-h-32 py-8 flex flex-col md:flex-row items-center justify-between px-8 md:px-16">
            <div className="flex items-center mb-6 md:mb-0 p-2">
                <TextHoverEffect text="FixMy.Town" />
            </div>

            <nav className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4 text-sm text-neutral-600 dark:text-neutral-400">
                <Link
                    href="/contact"
                    className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                >
                    {dictionary.layout.footer.contact}
                </Link>
                <Link
                    href="/about"
                    className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                >
                    {dictionary.layout.footer.about}
                </Link>
                <Link
                    href="/impressum"
                    className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                >
                    {dictionary.layout.footer.imprint}
                </Link>
                <Link
                    href="/datenschutz"
                    className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                >
                    {dictionary.layout.footer.privacy}
                </Link>
                <Link
                    href="/agb"
                    className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                >
                    {dictionary.layout.footer.terms}
                </Link>
            </nav>
        </footer>
    );
}
