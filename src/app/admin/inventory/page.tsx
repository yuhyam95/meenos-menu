import { InventoryManager } from "@/components/admin/inventory-manager";

export default function InventoryManagementPage() {
    return (
        <div className="space-y-8">
            <header>
                <h1 className="font-headline text-4xl font-bold tracking-tight">
                    Inventory Management
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                    Manage raw materials, track quantities, and monitor stock levels.
                </p>
            </header>
            <section>
                <div className="mt-6">
                    <InventoryManager />
                </div>
            </section>
        </div>
    )
}

