
import { Suspense } from 'react';
import { DeliveryPriceManager } from "@/components/admin/delivery-price-manager";
import { Skeleton } from '@/components/ui/skeleton';

export default function DeliveryManagementPage() {
    return (
        <div className="space-y-8">
            <header>
                <h1 className="font-headline text-4xl font-bold tracking-tight">
                    Delivery Price Management
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Set and update the delivery fees for different locations.
                </p>
            </header>
            <section>
                <div className="mt-6">
                    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                        <DeliveryPriceManager />
                    </Suspense>
                </div>
            </section>
        </div>
    )
}
