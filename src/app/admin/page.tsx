
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";


export default function AdminPage() {
  return (
    <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight">
                Welcome to your Dashboard
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
                Select a section from the sidebar to get started.
            </p>
            <div className="mt-8 flex justify-center gap-4">
                <Button asChild>
                    <Link href="/admin/orders">
                        View Orders
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
                <Button asChild variant="secondary">
                    <Link href="/admin/menu">
                        Manage Menu
                    </Link>
                </Button>
            </div>
        </div>
    </div>
  );
}
