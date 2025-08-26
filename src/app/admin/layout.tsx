
'use client';

import { SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarTrigger, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { UtensilsCrossed, ShoppingCart, Truck, Settings } from 'lucide-react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Header } from "@/components/header";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { href: '/admin/orders', label: 'Order Management', icon: ShoppingCart },
    { href: '/admin/menu', label: 'Menu Management', icon: UtensilsCrossed },
    { href: '/admin/delivery', label: 'Delivery Management', icon: Truck },
  ];

  return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full flex-col">
          <Header/>
          <div className="flex flex-1">
            <Sidebar>
                <SidebarHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Settings className="h-5 w-5" />
                    </div>
                    <span className="text-lg font-semibold">Admin Panel</span>
                  </div>
                </SidebarHeader>
                <SidebarContent>
                <SidebarMenu>
                    {menuItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                        <Link href={item.href}>
                            <SidebarMenuButton 
                                isActive={pathname === item.href}
                                tooltip={item.label}
                            >
                                <item.icon />
                                <span>{item.label}</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    ))}
                </SidebarMenu>
                </SidebarContent>
            </Sidebar>
            <SidebarInset>
                {children}
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
  );
}
