
'use client';

import { SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar";
import { UtensilsCrossed, ShoppingCart, Truck, Tags, Settings, Users, LogOut } from 'lucide-react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { logout } from "@/lib/auth";
import { Button } from "@/components/ui/button";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { href: '/admin/orders', label: 'Order Management', icon: ShoppingCart },
    { href: '/admin/menu', label: 'Menu Management', icon: UtensilsCrossed },
    { href: '/admin/categories', label: 'Category Management', icon: Tags },
    { href: '/admin/delivery', label: 'Delivery Management', icon: Truck },
    { href: '/admin/users', label: 'User Management', icon: Users },
    { href: '/admin/store-setup', label: 'Store Setup', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
  }

  return (
      <SidebarProvider>
        <div className="flex flex-1">
          <Sidebar>
              <SidebarHeader className="h-16 flex-shrink-0">
              </SidebarHeader>
              <SidebarContent>
                <SidebarMenu>
                    {menuItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                        <Link href={item.href}>
                            <SidebarMenuButton 
                                isActive={pathname.startsWith(item.href)}
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
              <SidebarFooter>
                <form action={handleLogout}>
                    <Button type="submit" variant="ghost" className="w-full justify-start">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out
                    </Button>
                </form>
              </SidebarFooter>
          </Sidebar>
          <SidebarInset>
              {children}
          </SidebarInset>
        </div>
      </SidebarProvider>
  );
}
