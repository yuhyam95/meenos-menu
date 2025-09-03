
import { Suspense } from 'react';
import { UserManager } from "@/components/admin/user-manager";
import { Skeleton } from '@/components/ui/skeleton';

export default function UserManagementPage() {
    return (
        <div className="space-y-8">
            <header>
                <h1 className="font-headline text-4xl font-bold tracking-tight">
                    User Management
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    View and manage users who have access to your application.
                </p>
            </header>
            <section>
                <div className="mt-6">
                    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                        <UserManager />
                    </Suspense>
                </div>
            </section>
        </div>
    )
}
