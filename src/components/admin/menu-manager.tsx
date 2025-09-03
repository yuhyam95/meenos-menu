
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { FoodItem, FoodCategory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { MoreHorizontal, PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { MenuItemForm } from './menu-item-form';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem, getFoodCategories } from '@/app/actions';
import { Badge } from '../ui/badge';
  

export function MenuManager() {
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
        setIsLoading(true);
        const [items, cats] = await Promise.all([
          getMenuItems(),
          getFoodCategories()
        ]);
        setMenuItems(items);
        setCategories(cats);
        setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleSaveItem = async (item: Omit<FoodItem, 'id'> & { id?: string }) => {
    if (editingItem && item.id) {
      await updateMenuItem({ ...item, id: item.id });
    } else {
      const { id, ...newItemData } = item;
      await addMenuItem(newItemData);
    }
    
    const updatedItems = await getMenuItems();
    setMenuItems(updatedItems);
    setEditingItem(null);
    setIsFormOpen(false);
  };

  const handleEditItem = (item: FoodItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  }

  const handleDeleteItem = async (itemId: string) => {
    await deleteMenuItem(itemId);
    const updatedItems = await getMenuItems();
    setMenuItems(updatedItems);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Item
        </Button>
      </div>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">Loading menu items...</TableCell>
                </TableRow>
            ) : menuItems.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">No menu items found.</TableCell>
                </TableRow>
            ) : (
                menuItems.map((item) => (
                <TableRow key={item.id}>
                    <TableCell>
                    <div className="relative h-12 w-12 overflow-hidden rounded-md">
                        <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="100px"
                        className="object-cover"
                        />
                    </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground">{item.category}</TableCell>
                    <TableCell className="text-muted-foreground">
                        {item.price.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.quantity > 0 ? 'default' : 'destructive'}>
                        {item.quantity > 0 ? `${item.quantity} in stock` : 'Out of Stock'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditItem(item)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                    <span className="text-destructive">Delete</span>
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the menu item.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteItem(item.id)} className="bg-destructive hover:bg-destructive/90">
                                    Delete
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                </TableRow>
                ))
            )}
            
          </TableBody>
        </Table>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update the details of your menu item.' : 'Fill in the details for the new menu item.'}
            </DialogDescription>
          </DialogHeader>
          <MenuItemForm
            item={editingItem}
            categories={categories}
            onSave={handleSaveItem}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
