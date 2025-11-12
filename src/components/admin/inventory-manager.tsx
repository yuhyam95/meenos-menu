"use client";

import { useState, useEffect } from 'react';
import type { InventoryItem } from '@/lib/types';
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
import { MoreHorizontal, PlusCircle, Pencil, Trash2, Plus, Minus } from 'lucide-react';
import { InventoryForm } from './inventory-form';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Input } from '@/components/ui/input';
import {
  Dialog as QuantityDialog,
  DialogContent as QuantityDialogContent,
  DialogDescription as QuantityDialogDescription,
  DialogHeader as QuantityDialogHeader,
  DialogTitle as QuantityDialogTitle,
  DialogFooter as QuantityDialogFooter,
} from '@/components/ui/dialog';
import { getInventoryItems, addInventoryItem, updateInventoryItem, deleteInventoryItem, adjustInventoryQuantity } from '@/app/actions';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { useToast } from '@/hooks/use-toast';

export function InventoryManager() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantityDialogOpen, setQuantityDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState<string>('');
  const [isIncrease, setIsIncrease] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
        setIsLoading(true);
        const items = await getInventoryItems();
        setInventoryItems(items);
        setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleSaveItem = async (item: Omit<InventoryItem, 'id'> & { id?: string }) => {
    if (editingItem && item.id) {
      await updateInventoryItem({ ...item, id: item.id });
    } else {
      const { id, ...newItemData } = item;
      await addInventoryItem(newItemData);
    }
    
    const updatedItems = await getInventoryItems();
    setInventoryItems(updatedItems);
    setEditingItem(null);
    setIsFormOpen(false);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  }

  const handleDeleteItem = async (itemId: string) => {
    await deleteInventoryItem(itemId);
    const updatedItems = await getInventoryItems();
    setInventoryItems(updatedItems);
  };

  const handleOpenQuantityDialog = (item: InventoryItem, increase: boolean) => {
    setSelectedItem(item);
    setAdjustmentAmount('');
    setIsIncrease(increase);
    setQuantityDialogOpen(true);
  };

  const handleAdjustQuantity = async () => {
    if (!selectedItem || !adjustmentAmount) return;
    
    const amount = parseFloat(adjustmentAmount);
    if (isNaN(amount) || amount <= 0) return;

    // Prevent decreasing below zero
    if (!isIncrease && amount > selectedItem.quantity) {
      toast({
        title: "Invalid adjustment",
        description: `Cannot remove more than ${selectedItem.quantity.toLocaleString()} ${selectedItem.unit}. Current quantity is ${selectedItem.quantity.toLocaleString()} ${selectedItem.unit}.`,
        variant: "destructive",
      });
      return;
    }

    try {
      const adjustment = isIncrease ? amount : -amount;
      await adjustInventoryQuantity(selectedItem.id!, adjustment);
      
      const updatedItems = await getInventoryItems();
      setInventoryItems(updatedItems);
      setQuantityDialogOpen(false);
      setSelectedItem(null);
      setAdjustmentAmount('');
      
      toast({
        title: "Quantity updated",
        description: `Successfully ${isIncrease ? 'increased' : 'decreased'} quantity by ${amount.toLocaleString()} ${selectedItem.unit}.`,
      });
    } catch (error) {
      toast({
        title: "Error updating quantity",
        description: error instanceof Error ? error.message : "Failed to update quantity. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isLowStock = (item: InventoryItem) => {
    return item.minQuantity !== undefined && item.quantity <= item.minQuantity;
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Material
        </Button>
      </div>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Current Quantity</TableHead>
              <TableHead>Minimum Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">Loading inventory items...</TableCell>
                </TableRow>
            ) : inventoryItems.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">No inventory items found.</TableCell>
                </TableRow>
            ) : (
                inventoryItems.map((item) => (
                <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground">{item.unit}</TableCell>
                    <TableCell className="font-medium">{item.quantity.toLocaleString()}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.minQuantity !== undefined ? item.minQuantity.toLocaleString() : '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={isLowStock(item) ? 'destructive' : 'default'}>
                        {isLowStock(item) ? 'Low Stock' : 'In Stock'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenQuantityDialog(item, true)}
                        className="h-8"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenQuantityDialog(item, false)}
                        className="h-8"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
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
                                    This action cannot be undone. This will permanently delete the inventory item.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteItem(item.id!)} className="bg-destructive hover:bg-destructive/90">
                                    Delete
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </div>
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
            <DialogTitle>{editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update the details of your inventory item.' : 'Fill in the details for the new inventory item.'}
            </DialogDescription>
          </DialogHeader>
          <InventoryForm
            item={editingItem}
            onSave={handleSaveItem}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <QuantityDialog open={quantityDialogOpen} onOpenChange={setQuantityDialogOpen}>
        <QuantityDialogContent>
          <QuantityDialogHeader>
            <QuantityDialogTitle>
              {isIncrease ? 'Increase' : 'Decrease'} Quantity
            </QuantityDialogTitle>
            <QuantityDialogDescription>
              {selectedItem && (
                <>
                  Adjust quantity for <strong>{selectedItem.name}</strong>
                  <br />
                  Current quantity: <strong>{selectedItem.quantity.toLocaleString()} {selectedItem.unit}</strong>
                </>
              )}
            </QuantityDialogDescription>
          </QuantityDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount to {isIncrease ? 'add' : 'remove'}</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                max={!isIncrease && selectedItem ? selectedItem.quantity : undefined}
                placeholder="0"
                value={adjustmentAmount}
                onChange={(e) => setAdjustmentAmount(e.target.value)}
              />
              {selectedItem && (
                <>
                  {!isIncrease && (
                    <p className="text-sm text-muted-foreground">
                      Maximum you can remove: <strong>{selectedItem.quantity.toLocaleString()} {selectedItem.unit}</strong>
                    </p>
                  )}
                  <p className={`text-sm ${(() => {
                    const amount = parseFloat(adjustmentAmount) || 0;
                    const newQty = selectedItem.quantity + (isIncrease ? amount : -amount);
                    return newQty < 0 ? 'text-destructive font-medium' : 'text-muted-foreground';
                  })()}`}>
                    New quantity will be: <strong>
                      {(() => {
                        const amount = parseFloat(adjustmentAmount) || 0;
                        const newQty = selectedItem.quantity + (isIncrease ? amount : -amount);
                        return Math.max(0, newQty).toLocaleString();
                      })()} {selectedItem.unit}
                    </strong>
                    {(() => {
                      const amount = parseFloat(adjustmentAmount) || 0;
                      const newQty = selectedItem.quantity + (isIncrease ? amount : -amount);
                      return newQty < 0 ? ' (Cannot be negative!)' : '';
                    })()}
                  </p>
                </>
              )}
            </div>
          </div>
          <QuantityDialogFooter>
            <Button variant="outline" onClick={() => setQuantityDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAdjustQuantity}
              disabled={(() => {
                if (!adjustmentAmount) return true;
                const amount = parseFloat(adjustmentAmount);
                if (isNaN(amount) || amount <= 0) return true;
                // Disable if decreasing would result in negative quantity
                if (!isIncrease && selectedItem && amount > selectedItem.quantity) return true;
                return false;
              })()}
            >
              {isIncrease ? 'Increase' : 'Decrease'} Quantity
            </Button>
          </QuantityDialogFooter>
        </QuantityDialogContent>
      </QuantityDialog>
    </>
  );
}

