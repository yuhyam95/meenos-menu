
"use client";

import { useState } from 'react';
import Image from 'next/image';
import type { FoodItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCart } from '@/hooks/use-cart';
import { ShoppingCart, Info } from 'lucide-react';
import { MenuItemModal } from './menu-item-modal';

interface FoodItemCardProps {
  item: FoodItem;
}

export function FoodItemCard({ item }: FoodItemCardProps) {
  const { addToCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent modal from opening
    addToCart(item);
  };

  return (
    <>
      <Card 
        className="group flex flex-col overflow-hidden h-full transition-all hover:shadow-lg sm:hover:-translate-y-1 cursor-pointer hover:ring-2 hover:ring-primary/20 sm:min-h-[400px]"
        onClick={handleCardClick}
      >
      {/* Desktop View - Default */}
      <div className="hidden sm:block h-full flex flex-col">
          <CardHeader className="p-0">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                data-ai-hint={item['data-ai-hint']}
              />
            </div>
            <div className="p-6 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-headline text-xl leading-tight">{item.name}</CardTitle>
                  <Info className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow p-6 pt-0">
            <CardDescription className="line-clamp-3">{item.description}</CardDescription>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 pt-0 mt-auto gap-4 sm:gap-2">
            <p className="text-xl font-bold text-primary">
              {item.price.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
            </p>
            <Button onClick={handleAddToCartClick} className="w-full sm:w-auto">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </CardFooter>
      </div>

      {/* Mobile View */}
      <div className="flex sm:hidden flex-row items-stretch p-3 gap-3 h-auto">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
            <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                sizes="96px"
                className="object-cover rounded-md"
                data-ai-hint={item['data-ai-hint']}
            />
        </div>
        <div className="flex flex-col flex-grow gap-2">
            <div>
                <h3 className="font-headline font-semibold leading-tight">{item.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
            </div>
            <div className="flex items-center justify-between">
                <p className="text-base font-bold text-primary">
                    {item.price.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
                </p>
                <Button onClick={handleAddToCartClick} size="sm" className="shrink-0 h-8 px-2 py-1 text-xs">
                    <ShoppingCart className="mr-1 h-3 w-3" />
                    Add
                </Button>
            </div>
        </div>
      </div>
    </Card>
    
    <MenuItemModal 
      item={item}
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
    />
    </>
  );
}
