"use client";

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
import { ShoppingCart } from 'lucide-react';

interface FoodItemCardProps {
  item: FoodItem;
}

export function FoodItemCard({ item }: FoodItemCardProps) {
  const { addToCart } = useCart();

  return (
    <Card className="flex flex-col overflow-hidden h-full transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative aspect-video w-full">
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
            <CardTitle className="font-headline text-xl leading-tight">{item.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6 pt-0">
        <CardDescription>{item.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 pt-0 mt-auto gap-4 sm:gap-2">
        <p className="text-xl font-bold text-primary">
          {item.price.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
        </p>
        <Button onClick={() => addToCart(item)} className="w-full sm:w-auto">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
