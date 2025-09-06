"use client";

import { useState } from 'react';
import Image from 'next/image';
import type { FoodItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/use-cart';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

interface MenuItemModalProps {
  item: FoodItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MenuItemModal({ item, isOpen, onClose }: MenuItemModalProps) {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!item) return null;

  // Check if item is already in cart
  const cartItem = cartItems.find(cartItem => cartItem.id === item.id);
  const isInCart = !!cartItem;

  const handleAddToCart = () => {
    if (isInCart) {
      // If already in cart, increase quantity
      updateQuantity(item.id, cartItem.quantity + quantity);
    } else {
      // Add new item to cart
      for (let i = 0; i < quantity; i++) {
        addToCart(item);
      }
    }
    onClose();
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= item.quantity) {
      setQuantity(newQuantity);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">{item.name}</DialogTitle>
          <DialogDescription className="text-base">
            {item.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Image */}
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover"
              data-ai-hint={item['data-ai-hint']}
            />
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Badge variant="outline" className="text-sm">
                  {item.category}
                </Badge>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Stock:</span>
                  <Badge variant={item.quantity > 0 ? 'default' : 'destructive'}>
                    {item.quantity > 0 ? `${item.quantity} available` : 'Out of Stock'}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">
                  {item.price.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
                </p>
              </div>
            </div>

            {/* Quantity Selector */}
            {item.quantity > 0 && (
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= item.quantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Cart Status */}
            {isInCart && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  ✓ This item is already in your cart ({cartItem.quantity} {cartItem.quantity === 1 ? 'item' : 'items'})
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Close
          </Button>
          <Button 
            onClick={handleAddToCart} 
            disabled={item.quantity === 0}
            className="w-full sm:w-auto"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isInCart ? `Add ${quantity} More` : `Add ${quantity} to Cart`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
