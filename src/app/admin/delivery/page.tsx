
import { DeliveryPriceManager } from "@/components/admin/delivery-price-manager";

export default function DeliveryManagementPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="font-headline text-4xl font-bold tracking-tight">
                    Delivery Price Management
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Set and update the delivery fees for different locations.
                </p>
            </header>
            <section>
                <div className="mt-6">
                    <DeliveryPriceManager />
                </div>
            </section>
        </div>
    )
}
