
import { Suspense } from 'react';
import { CategoryManager } from "@/components/admin/category-manager";
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoryManagementPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="font-headline text-4xl font-bold tracking-tight">
                    Food Category Management
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Add, edit, or remove food categories for your menu.
                </p>
            </header>
            <section>
                <div className="mt-6">
                    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                        <CategoryManager />
                    </Suspense>
                </div>
            </section>
        </div>
    )
}
