
import { Facebook, Instagram, Twitter, UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center md:items-start">
             <Link href="/" className="mb-4 flex items-center">
              <Image src="/meenos-logo.png" alt="meenos.ng logo" width={140} height={38} />
            </Link>
            <p className="text-center text-sm md:text-left">
              The finest Nigerian cuisine, delivered right to your doorstep.
            </p>
          </div>

          <div className="text-center md:text-left">
            <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
            <address className="not-italic">
              <p>123 Foodie Lane, Lekki, Lagos</p>
              <p>Nigeria</p>
              <p className="mt-2">
                <a href="tel:+2348012345678" className="hover:underline">
                  +234 801 234 5678
                </a>
              </p>
              <p>
                <a
                  href="mailto:orders@meenos.ng"
                  className="hover:underline"
                >
                  orders@meenos.ng
                </a>
              </p>
            </address>
          </div>

          <div className="text-center md:text-left">
            <h3 className="mb-4 text-lg font-semibold">Follow Us</h3>
            <div className="flex justify-center gap-4 md:justify-start">
              <Link href="#" className="text-secondary-foreground hover:text-primary">
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-secondary-foreground hover:text-primary">
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-secondary-foreground hover:text-primary">
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-secondary-foreground/10 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} meenos.ng. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
