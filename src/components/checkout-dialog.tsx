
"use client";

import { useState, useEffect } from 'react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import type { DeliveryLocation, StoreSetting } from '@/lib/types';
import { getDeliveryLocations, addOrder, getStoreSettings } from '@/app/actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function CheckoutDialog() {
  const [orderType, setOrderType] = useState('delivery');
  const [isOpen, setIsOpen] = useState(false);
  const { clearCart, cartTotal, cartItems } = useCart();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [deliveryLocations, setDeliveryLocations] = useState<DeliveryLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>();
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [storeSettings, setStoreSettings] = useState<StoreSetting | null>(null);
  const [isPaymentDetailsOpen, setIsPaymentDetailsOpen] = useState(false);

  useEffect(() => {
    async function fetchInitialData() {
      const settings = await getStoreSettings();
      setStoreSettings(settings);

      if (orderType === 'delivery') {
        const locations = await getDeliveryLocations();
        setDeliveryLocations(locations);
      }
    }
    fetchInitialData();
  }, [orderType]);
  
  const handleLocationChange = (locationId: string) => {
    const location = deliveryLocations.find(loc => loc.id === locationId);
    if (location) {
        setSelectedLocation(locationId);
        setDeliveryFee(location.price);
    }
  }

  const handlePlaceOrder = async () => {
    const locationName = deliveryLocations.find(l=> l.id === selectedLocation)?.name || '';
    const deliveryAddress = orderType === 'delivery' ? `${address}, ${locationName}` : undefined;
    
    const orderData = {
      customer: { name, phone, address: deliveryAddress },
      items: cartItems,
      total: cartTotal + deliveryFee,
      status: 'Pending' as const,
      orderType: orderType as 'delivery' | 'pickup',
      notes: notes.trim() || undefined,
    };

    await addOrder(orderData);

    setIsOpen(false); // Close the checkout dialog
    setIsPaymentDetailsOpen(true); // Open the payment details dialog
  };

  const handlePaymentComplete = () => {
    toast({
        title: 'Order Placed Successfully!',
        description: 'Thank you for your order. We will process it shortly.',
    });
    clearCart();
    setIsPaymentDetailsOpen(false);
    setName('');
    setPhone('');
    setAddress('');
    setNotes('');
    setSelectedLocation(undefined);
    setDeliveryFee(0);
  }

  const finalTotal = cartTotal + (orderType === 'delivery' ? deliveryFee : 0);
  const isOrderButtonDisabled = !name || !phone || (orderType === 'delivery' && (!address || !selectedLocation)) || cartItems.length === 0;

  return (
    <>
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" size="lg" disabled={cartItems.length === 0}>
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
          <RadioGroup defaultValue="delivery" value={orderType} onValueChange={setOrderType} className="grid grid-cols-2 gap-4">
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
            <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          {orderType === 'delivery' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="address">Delivery Address</Label>
                <Input id="address" placeholder="123 Main St" value={address} onChange={e => setAddress(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Delivery Area</Label>
                <Select onValueChange={handleLocationChange} value={selectedLocation}>
                    <SelectTrigger id="location">
                        <SelectValue placeholder="Select a delivery area" />
                    </SelectTrigger>
                    <SelectContent>
                        {deliveryLocations.map(location => (
                            <SelectItem key={location.id} value={location.id!}>
                                {location.name} - {location.price.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
            </>
          )}
           <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" placeholder="08012345678" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea 
              id="notes" 
              placeholder="Any special instructions or requests..." 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </div>
        <DialogFooter>
            <div className="w-full flex justify-between items-center">
                <p className="text-lg font-bold">
                    Total: {finalTotal.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
                </p>
                <Button onClick={handlePlaceOrder} disabled={isOrderButtonDisabled}>Place Order</Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <AlertDialog open={isPaymentDetailsOpen} onOpenChange={setIsPaymentDetailsOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Make Payment</AlertDialogTitle>
                <AlertDialogDescription>
                    Please transfer the total amount to the bank account below to complete your order.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="my-4 space-y-3 rounded-lg border bg-secondary/50 p-4">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Bank:</span>
                    <span className="font-semibold">{storeSettings?.bankName || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Name:</span>
                    <span className="font-semibold">{storeSettings?.accountName || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Number:</span>
                    <span className="font-semibold">{storeSettings?.accountNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span>{finalTotal.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}</span>
                </div>
            </div>
            <AlertDialogFooter>
                <AlertDialogAction onClick={handlePaymentComplete}>
                    I have made the payment
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
