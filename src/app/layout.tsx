
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/providers/cart-provider';
import { LayoutProvider } from '@/components/layout-provider';
import { getStoreSettings } from './actions';
import { StoreSetting } from '@/lib/types';

export const metadata: Metadata = {
  title: 'meenos.ng',
  description: 'The easiest way to manage your menu and receive orders.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storeSettings: StoreSetting | null = await getStoreSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased'
        )}
      >
        <CartProvider>
            <LayoutProvider storeSettings={storeSettings}>
              {children}
            </LayoutProvider>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
