import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import NamePopup from './namePopup';

// Mock the LanguageSwitcher component
vi.mock('@/components/language-switcher', () => ({
    LanguageSwitcher: () => <div>Language Switcher Mock</div>,
}));

// Mock necessary hooks and modules
vi.mock('next-auth/react', () => ({
    useSession: vi.fn(() => ({
        data: { user: {} },
        status: 'authenticated',
    })),
}));

vi.mock('next/navigation', () => ({
    usePathname: vi.fn(() => '/'),
}));

vi.mock('@/hooks/use-toast', () => ({
    useToast: vi.fn(() => ({
        toast: vi.fn(),
    })),
}));

vi.mock('@/components/provider/dictionaryProvider', () => ({
    useDictionary: vi.fn(() => ({
        dictionary: {
            pages: {
                auth: {
                    account: {
                        editNameDialog: {
                            title: "Edit Name",
                            description: "Enter your new display name below.",
                            nameLabel: "Name",
                            namePlaceholder: "Enter your name",
                            cancel: "Cancel",
                            confirm: "Save Changes",
                            nameTooLong: "Name is too long",
                            nameTooShort: "Name is too short",
                            nameEmpty: "Name cannot be empty",
                            nameNumbers: "Name must not contain numbers or special characters",
                        },
                    },
                },
            },
            components: {
                signUpPopup: {
                    errorMessageC: "Please accept the terms of use and privacy policy to proceed.",
                    successTitle: "Success",
                    successMessage: "Your name has been updated.",
                    errorTitle: "Error",
                    errorMessageB: "There was an error updating your name.",
                    inputPlaceholder: "Enter your name",
                    saveButton: "Save Changes",
                    termsAndConditionsPartA: "I accept the ",
                    termsAndConditionsPartB: " and ",
                    termsAndConditionsPartC: ".",
                },
            },
            layout: {
                footer: {
                    contact: "Contact",
                    about: "About",
                    imprint: "Imprint",
                    privacy: "Privacy",
                    terms: "Terms",
                },
            },
        },
    })),
}));

vi.mock('@/trpc/react', () => ({
    api: {
        user: {
            updateUserName: {
                useMutation: vi.fn(() => ({
                    mutateAsync: vi.fn(),
                })),
            },
        },
    },
}));

describe('NamePopup Input Validation', () => {
    it('displays validation error for empty name', async () => {
        render(<NamePopup />);

        const form = screen.getByTestId('name-popup-form');
        fireEvent.submit(form);

        await waitFor(() => {
            expect(screen.getByText('Name cannot be empty')).toBeInTheDocument();
        });
    });

    it('displays validation error for short name', async () => {
        render(<NamePopup />);

        const input = screen.getByRole('textbox', { name: "" });
        fireEvent.change(input, { target: { value: 'Ab' } });
        const form = screen.getByTestId('name-popup-form');
        fireEvent.submit(form);

        await waitFor(() => {
            expect(screen.getByText('Name is too short')).toBeInTheDocument();
        });
    });

    it('displays validation error for long name', async () => {
        render(<NamePopup />);

        const input = screen.getByRole('textbox', { name: "" });
        fireEvent.change(input, { target: { value: 'A'.repeat(51) } });
        const form = screen.getByTestId('name-popup-form');
        fireEvent.submit(form);

        await waitFor(() => {
            expect(screen.getByText('Name is too long')).toBeInTheDocument();
        });
    });

    it('displays validation error for name with numbers', async () => {
        render(<NamePopup />);

        const input = screen.getByRole('textbox', { name: "" });
        fireEvent.change(input, { target: { value: 'Name123' } });
        const form = screen.getByTestId('name-popup-form');
        fireEvent.submit(form);

        await waitFor(() => {
            expect(screen.getByText('Name must not contain numbers or special characters')).toBeInTheDocument();
        });
    });
});
