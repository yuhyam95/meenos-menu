"use client";

import { MenuManager } from "@/components/admin/menu-manager";
import { DeliveryPriceManager } from "@/components/admin/delivery-price-manager";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage your restaurant's menu and delivery settings.
        </p>
      </header>
      
      <section className="mb-8">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight">Order Management</h2>
            <Button asChild>
                <Link href="/admin/orders">
                    <Eye className="mr-2 h-4 w-4" />
                    View Orders
                </Link>
            </Button>
        </div>
        <p className="mt-1 text-muted-foreground">
          View and manage incoming customer orders.
        </p>
      </section>
      
      <Separator className="my-12" />

      <section>
        <h2 className="text-2xl font-bold tracking-tight">Menu Management</h2>
        <p className="mt-1 text-muted-foreground">
          Add, edit, or remove items from your restaurant's menu.
        </p>
        <div className="mt-6">
            <MenuManager />
        </div>
      </section>

      <Separator className="my-12" />

      <section>
        <h2 className="text-2xl font-bold tracking-tight">Delivery Price Management</h2>
        <p className="mt-1 text-muted-foreground">
            Set and update the delivery fees for different locations.
        </p>
        <div className="mt-6">
            <DeliveryPriceManager />
        </div>
      </section>
    </div>
  );
}
