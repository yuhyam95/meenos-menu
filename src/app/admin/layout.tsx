
'use client';

import { SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger } from "@/components/ui/sidebar";
import { UtensilsCrossed, ShoppingCart, Truck, Tags, Settings, Users, LogOut, PanelLeft } from 'lucide-react';
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

  const currentPage = menuItems.find((item) => pathname.startsWith(item.href));

  return (
      <SidebarProvider>
        <div className="flex flex-1">
          <Sidebar>
              <SidebarHeader className="h-16 flex-shrink-0 p-2 flex items-center gap-2">
                <h2 className="font-semibold text-lg group-data-[collapsible=icon]:hidden">Meenos Admin</h2>
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
                    <Button type="submit" variant="ghost" className="w-full justify-start group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:size-8">
                        <LogOut className="group-data-[collapsible=icon]:m-0 mr-2" />
                        <span className="group-data-[collapsible=icon]:hidden">Log Out</span>
                    </Button>
                </form>
              </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
                <SidebarTrigger>
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </SidebarTrigger>
                <h1 className="font-semibold text-lg">{currentPage?.label || 'Dashboard'}</h1>
            </header>
            <div className="p-4 md:p-6 lg:p-8">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
  );
}
