
"use client";

import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, ShoppingCart, UtensilsCrossed } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { Cart } from '@/components/cart';
import Image from 'next/image';

export function Header() {
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Desktop Header */}
        <div className="mr-4 hidden md:flex md:flex-1">
          <Link href="/" className="mr-6 flex items-center">
            <Image src="/meenos-logo.png" alt="meenos.ng logo" width={120} height={32} />
          </Link>
        </div>

        {/* Mobile Header */}
        <div className="flex w-full items-center justify-between md:hidden">
            {/* Left: Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <Link href="/" className="mr-6 flex items-center space-x-2 mb-6">
                  <Image src="/meenos-logo.png" alt="meenos.ng logo" width={120} height={32} />
                </Link>
                <nav className="flex flex-col space-y-4">
                  <Link
                    href={'/'}
                    className="transition-colors hover:text-foreground/80 text-foreground"
                  >
                    Menu
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            
            {/* Center: Logo */}
            <Link href="/" className="flex items-center">
              <Image src="/meenos-logo.png" alt="meenos.ng logo" width={120} height={32} />
            </Link>

            {/* Right: Cart */}
             <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {cartCount}
                    </span>
                  )}
                  <span className="sr-only">Open cart</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
                <Cart />
              </SheetContent>
            </Sheet>
        </div>

        {/* Desktop Cart */}
        <div className="hidden items-center justify-end md:flex">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {cartCount}
                  </span>
                )}
                <span className="sr-only">Open cart</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
              <Cart />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
