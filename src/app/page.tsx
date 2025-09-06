
'use client';

import React, { useState, useEffect } from 'react';
import { FoodItemCard } from '@/components/food-item-card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { FoodItem } from '@/lib/types';
import { UtensilsCrossed } from 'lucide-react';
import { getMenuItems } from './actions';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

function MenuItemsDisplay() {
  const [allMenuItems, setAllMenuItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchItems() {
      setIsLoading(true);
      const items = await getMenuItems();
      setAllMenuItems(items);
      setIsLoading(false);
    }
    fetchItems();
  }, []);

  const [activeTab, setActiveTab] = useState('All');
  
  // Memoize categories to prevent re-calculation on every render
  const categories = React.useMemo(() => 
    ['All', ...Array.from(new Set(allMenuItems.map((item) => item.category)))],
    [allMenuItems]
  );

  const filteredItems = activeTab === 'All'
    ? allMenuItems
    : allMenuItems.filter(item => item.category === activeTab);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
      </div>
    )
  }

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col items-center mb-8">
        <TabsList className="grid w-full max-w-md h-auto" style={{ gridTemplateColumns: `repeat(${Math.min(categories.length, 4)}, 1fr)`}}>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="text-base">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <FoodItemCard key={item.id} item={item} />
        ))}
      </div>

      {filteredItems.length === 0 && !isLoading && (
         <div className="col-span-full flex flex-col items-center justify-center text-center py-20 rounded-lg bg-card border border-dashed">
            <UtensilsCrossed className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold text-foreground">No Items Found</h2>
            <p className="text-muted-foreground mt-2">There are no items in this category yet. Check back soon!</p>
        </div>
      )}
    </>
  )
}

export default function Home() {
  return (
    <>
      <div className="relative h-64 md:h-96 w-full">
        <Image 
          src="/header.jpeg" 
          alt="Nigerian food platter"
          fill
          className="object-cover"
          data-ai-hint="food platter"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
          <header className="text-center text-white px-4">
            <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">
              Our Menu
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Bringing you deliciousness from the heart of Kano at Meenos
            </p>
          </header>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Suspense fallback={<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
        </div>}>
          <MenuItemsDisplay />
        </Suspense>
      </div>
    </>
  );
}
