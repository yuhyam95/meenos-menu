
"use client";

import { usePathname } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export function LayoutProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith('/admin');
    const isLoginPage = pathname === '/login';

    return (
        <div className="relative flex min-h-screen flex-col">
            {!isAdminPage && !isLoginPage && <Header />}
            <main className="flex-1">{children}</main>
            {!isAdminPage && !isLoginPage && <Footer />}
        </div>
    )
}
