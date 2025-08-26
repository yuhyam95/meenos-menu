"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';

export function CheckoutDialog() {
  const [orderType, setOrderType] = useState('delivery');
  const [isOpen, setIsOpen] = useState(false);
  const { clearCart, cartTotal } = useCart();
  const { toast } = useToast();

  const handlePlaceOrder = () => {
    toast({
      title: 'Order Placed Successfully!',
      description: 'Thank you for your order. We will process it shortly.',
    });
    clearCart();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" size="lg">
          Proceed to Checkout
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>
            Choose your order type and provide your details.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RadioGroup defaultValue="delivery" onValueChange={setOrderType} className="grid grid-cols-2 gap-4">
            <div>
              <RadioGroupItem value="delivery" id="delivery" className="peer sr-only" />
              <Label
                htmlFor="delivery"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                Delivery
              </Label>
            </div>
            <div>
              <RadioGroupItem value="pickup" id="pickup" className="peer sr-only" />
              <Label
                htmlFor="pickup"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                Pickup
              </Label>
            </div>
          </RadioGroup>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" />
          </div>
          {orderType === 'delivery' && (
            <div className="space-y-2">
              <Label htmlFor="address">Delivery Address</Label>
              <Input id="address" placeholder="123 Main St, Lagos" />
            </div>
          )}
           <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" placeholder="08012345678" />
          </div>
        </div>
        <DialogFooter>
            <div className="w-full flex justify-between items-center">
                <p className="text-lg font-bold">
                    Total: {cartTotal.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
                </p>
                <Button onClick={handlePlaceOrder}>Place Order</Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
