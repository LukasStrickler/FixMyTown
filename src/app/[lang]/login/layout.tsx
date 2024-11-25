import { type Metadata } from "next";

export const metadata: Metadata = {
    title: "Anmelden | FixMyTown",
    description: "Melden Sie sich bei Ihrem FixMyTown-Konto an",
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
} 