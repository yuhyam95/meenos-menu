"use client";

import { MenuManager } from "@/components/admin/menu-manager";

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          Menu Management
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Add, edit, or remove items from your restaurant's menu.
        </p>
      </header>
      <MenuManager />
    </div>
  );
}
