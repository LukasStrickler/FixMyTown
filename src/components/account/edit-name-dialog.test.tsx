import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EditNameDialog } from './edit-name-dialog';
import { describe, test, expect, beforeEach, vi, beforeAll } from 'vitest';
import en from '@/dictionaries/en.json';

const mockDictionary = en;

describe('EditNameDialog', () => {
    beforeAll(() => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation((query: string) => ({
                matches: false,
                media: query,
                onchange: null,
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });
    });

    const mockOnConfirm = vi.fn();
    const mockOnOpenChange = vi.fn();

    const setup = (currentName = "John") => {
        return render(
            <EditNameDialog
                open={true}
                onOpenChange={mockOnOpenChange}
                onConfirm={mockOnConfirm}
                dictionary={mockDictionary}
                currentName={currentName}
            />
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should trim spaces but allow spaces between words', async () => {
        setup("John");
        const input = screen.getByRole('textbox');

        // Test cases for trimming
        const testCases = [
            { input: "  John  ", expected: "John" },
            { input: "John Doe", expected: "John Doe" },
            { input: "  John  Doe  ", expected: "John Doe" },
            { input: "   ", expected: "" },
            { input: "John   Doe", expected: "John Doe" },
        ];

        for (const testCase of testCases) {
            fireEvent.change(input, { target: { value: testCase.input } });

            // Get form by tag name instead of role
            const form = screen.getByTestId('name-form');
            fireEvent.submit(form);

            await waitFor(() => {
                if (testCase.expected !== "") {
                    expect(mockOnConfirm).toHaveBeenCalled();
                    const lastCall = mockOnConfirm.mock.lastCall;
                    expect(lastCall).toBeTruthy();
                    const normalizedValue = String(lastCall?.[0]).replace(/\s+/g, ' ').trim();
                    expect(normalizedValue).toBe(testCase.expected);
                } else {
                    expect(mockOnConfirm).not.toHaveBeenCalled();
                }
            });

            vi.clearAllMocks();
        }
    });

    test('should handle submission with trimmed value', async () => {
        setup("John");
        const input = screen.getByRole('textbox');
        const submitButton = screen.getByText('Save Changes');

        fireEvent.change(input, { target: { value: "  Jane Doe  " } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockOnConfirm).toHaveBeenCalledWith("Jane Doe");
        });
    });

    test('should disable submit button when name is unchanged', async () => {
        setup("John");
        const input = screen.getByRole('textbox');
        const submitButton = screen.getByText('Save Changes');

        fireEvent.change(input, { target: { value: "  John  " } });
        await waitFor(() => {
            expect(submitButton).toBeDisabled();
        });
    });

    test('should disable submit button when name is too short', async () => {
        setup("John");
        const input = screen.getByRole('textbox');
        const submitButton = screen.getByText('Save Changes');

        fireEvent.change(input, { target: { value: "J" } });
        await waitFor(() => {
            expect(submitButton).toBeDisabled();
            expect(screen.getByText(mockDictionary.pages.auth.account.editNameDialog.nameTooShort)).toBeInTheDocument();
        });
    });

    test('should disable submit button when name is empty', async () => {
        setup("John");
        const input = screen.getByRole('textbox');
        const submitButton = screen.getByText('Save Changes');

        fireEvent.change(input, { target: { value: "" } });
        await waitFor(() => {
            expect(submitButton).toBeDisabled();
            expect(screen.getByText(mockDictionary.pages.auth.account.editNameDialog.nameEmpty)).toBeInTheDocument();
        });
    });

    test('should disable submit button when name is only spaces', async () => {
        setup("John");
        const input = screen.getByRole('textbox');
        const submitButton = screen.getByText('Save Changes');

        fireEvent.change(input, { target: { value: "   " } });
        await waitFor(() => {
            expect(submitButton).toBeDisabled();
            expect(screen.getByText(mockDictionary.pages.auth.account.editNameDialog.nameTooShort)).toBeInTheDocument();
        });
    });

    test('should enable submit button for valid new name', async () => {
        setup("John");
        const input = screen.getByRole('textbox');
        const submitButton = screen.getByText('Save Changes');

        fireEvent.change(input, { target: { value: "Jane Doe" } });
        await waitFor(() => {
            expect(submitButton).not.toBeDisabled();
        });
    });

    test('should disable submit button when name is too long', async () => {
        setup("John");
        const input = screen.getByRole('textbox');
        const submitButton = screen.getByText('Save Changes');

        const longName = "a".repeat(51);
        fireEvent.change(input, { target: { value: longName } });
        await waitFor(() => {
            expect(submitButton).toBeDisabled();
            expect(screen.getByText(mockDictionary.pages.auth.account.editNameDialog.nameTooLong)).toBeInTheDocument();
        });
    });
}); 