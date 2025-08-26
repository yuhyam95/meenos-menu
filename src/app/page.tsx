"use client";

import { useState } from 'react';
import { FoodItemCard } from '@/components/food-item-card';
import { menuItems as allMenuItems } from '@/lib/data';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { FoodItem } from '@/lib/types';
import { UtensilsCrossed } from 'lucide-react';

export default function Home() {
  const categories = ['All', ...Array.from(new Set(allMenuItems.map((item) => item.category)))];
  const [activeTab, setActiveTab] = useState('All');

  const filteredItems = activeTab === 'All' 
    ? allMenuItems 
    : allMenuItems.filter(item => item.category === activeTab);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
          Our Menu
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our delicious offerings, crafted with the freshest ingredients from meenos.ng.
        </p>
      </header>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col items-center mb-8">
        <TabsList className="grid w-full max-w-md grid-cols-2 md:grid-cols-4 h-auto">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="text-base">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredItems.map((item) => (
          <FoodItemCard key={item.id} item={item} />
        ))}
      </div>

      {filteredItems.length === 0 && (
         <div className="col-span-full flex flex-col items-center justify-center text-center py-20 rounded-lg bg-card border border-dashed">
            <UtensilsCrossed className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold text-foreground">No Items Found</h2>
            <p className="text-muted-foreground mt-2">There are no items in this category yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
