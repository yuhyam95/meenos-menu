
"use client";

import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import type { CartItem, FoodItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: FoodItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        // Migrate existing cart items to include originalQuantity if missing
        const migratedCart = parsedCart.map((item: any) => ({
          ...item,
          originalQuantity: item.originalQuantity || item.quantity
        }));
        setCartItems(migratedCart);
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        setCartItems([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: FoodItem) => {
    if (item.quantity === 0) {
        toast({
            title: "Out of stock",
            description: `${item.name} is currently out of stock.`,
            variant: "destructive",
        });
        return;
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        // Use originalQuantity if available, otherwise fall back to the current item's quantity
        const maxQuantity = existingItem.originalQuantity || item.quantity;
        if (existingItem.quantity + 1 > maxQuantity) {
          toast({
            title: "Not enough stock",
            description: `Only ${maxQuantity} of ${item.name} available.`,
            variant: "destructive",
          });
          return prevItems;
        }
        toast({
            title: "Added to cart",
            description: `${item.name} has been added to your cart.`,
        });
        return prevItems.map((i) =>
          i.id === item.id ? { 
            ...i, 
            quantity: i.quantity + 1,
            // Ensure originalQuantity is set for backward compatibility
            originalQuantity: i.originalQuantity || item.quantity
          } : i
        );
      }
      toast({
        title: "Added to cart",
        description: `${item.name} has been added to your cart.`,
      });
      return [...prevItems, { ...item, quantity: 1, originalQuantity: item.quantity }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((i) => i.id !== itemId));
    toast({
        title: "Removed from cart",
        variant: "destructive",
      });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems((prevItems) => {
        const itemToUpdate = prevItems.find((i) => i.id === itemId);
        if (!itemToUpdate) return prevItems;

        // Check against the original product stock quantity (with backward compatibility)
        const maxQuantity = itemToUpdate.originalQuantity || itemToUpdate.quantity;
        if (quantity > maxQuantity) {
            toast({
                title: "Not enough stock",
                description: `You cannot add more of ${itemToUpdate.name}. Only ${maxQuantity} available.`,
                variant: "destructive",
            });
            // Reset to max available quantity
            return prevItems.map((i) =>
              i.id === itemId ? { ...i, quantity: maxQuantity } : i
            );
        }

        return prevItems.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
        );
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
