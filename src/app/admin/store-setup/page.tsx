

import { StoreSetupForm } from "@/components/admin/store-setup-form";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function StoreSetupPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="font-headline text-4xl font-bold tracking-tight">
                    Store Setup
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Manage your general store settings, like header images and account details.
                </p>
            </header>
            <section>
                <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                    <StoreSetupForm />
                </Suspense>
            </section>
        </div>
    )
}

