import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import NamePopup from './namePopup';

// Mock necessary hooks and modules
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(() => ({
    data: { user: {} },
    status: 'authenticated',
  })),
}));

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/en'),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn(),
  })),
}));

vi.mock('@/components/provider/dictionaryProvider', () => ({
  useDictionary: vi.fn(() => ({
    dictionary: {
      components: {
        signUpPopup: {
          errorMessageA: "Please enter a valid name.",
          errorMessageC: "Please accept the terms of use and privacy policy to proceed.",
        }
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
      expect(screen.getByText('Please enter a valid name.')).toBeInTheDocument();
    });
  });

  it('displays validation error for short name', async () => {
    render(<NamePopup />);

    const input = screen.getByPlaceholderText('Your name');
    fireEvent.change(input, { target: { value: 'Ab' } });
    const form = screen.getByTestId('name-popup-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid name.')).toBeInTheDocument();
    });
  });

  it('displays validation error for long name', async () => {
    render(<NamePopup />);

    const input = screen.getByPlaceholderText('Your name');
    fireEvent.change(input, { target: { value: 'A'.repeat(51) } });
    const form = screen.getByTestId('name-popup-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid name.')).toBeInTheDocument();
    });
  });

  it('displays validation error for name with numbers', async () => {
    render(<NamePopup />);

    const input = screen.getByPlaceholderText('Your name');
    fireEvent.change(input, { target: { value: 'Name123' } });
    const form = screen.getByTestId('name-popup-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid name.')).toBeInTheDocument();
    });
  });
});