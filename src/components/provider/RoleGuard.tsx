"use server"
import { redirect } from 'next/navigation';
import { auth } from '@/server/auth';
import type { UserRole } from '@/server/auth/config';
import type { Locale } from '@/i18n-config';

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
    redirectTo?: string;
    lang: Locale;
}

export async function RoleGuard({
    children,
    allowedRoles,
    lang,
    redirectTo = '/',
}: RoleGuardProps) {
    // Validate inputs
    if (!allowedRoles || allowedRoles.length === 0) {
        throw new Error('RoleGuard: allowedRoles must not be empty');
    }

    // Get session
    const session = await auth();

    // Check authentication
    if (!session) {
        return redirect(`/${lang}/login`);
    }

    // Check role authorization
    if (!allowedRoles.includes(session.user.role)) {
        return redirect(`/${lang}/${redirectTo}`);
    }

    return <>{children}</>;
}
