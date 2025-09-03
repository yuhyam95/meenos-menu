
"use client";

import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import type { CartItem, FoodItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: FoodItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number, item: FoodItem) => void;
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
      setCartItems(JSON.parse(storedCart));
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
        if (existingItem.quantity + 1 > item.quantity) {
          toast({
            title: "Not enough stock",
            description: `You cannot add more of ${item.name}.`,
            variant: "destructive",
          });
          return prevItems;
        }
        toast({
            title: "Added to cart",
            description: `${item.name} has been added to your cart.`,
        });
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      toast({
        title: "Added to cart",
        description: `${item.name} has been added to your cart.`,
      });
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((i) => i.id !== itemId));
    toast({
        title: "Removed from cart",
        variant: "destructive",
      });
  };

  const updateQuantity = (itemId: string, quantity: number, item: FoodItem) => {
    if (quantity > item.quantity) {
        toast({
            title: "Not enough stock",
            description: `You cannot add more of ${item.name}. Only ${item.quantity} available.`,
            variant: "destructive",
        });
        // Reset to max available quantity
        setCartItems((prevItems) =>
            prevItems.map((i) => (i.id === itemId ? { ...i, quantity: item.quantity } : i))
        );
        return;
    }

    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((i) => (i.id === itemId ? { ...i, quantity } : i))
      );
    }
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
