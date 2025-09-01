"use client";

import { useState, useEffect } from 'react';
import type { DeliveryLocation } from '@/lib/types';
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
import { DeliveryPriceForm } from './delivery-price-form';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { getDeliveryLocations, addDeliveryLocation, updateDeliveryLocation, deleteDeliveryLocation } from '@/app/actions';
  

export function DeliveryPriceManager() {
  const [locations, setLocations] = useState<DeliveryLocation[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<DeliveryLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLocations() {
      setIsLoading(true);
      const fetchedLocations = await getDeliveryLocations();
      setLocations(fetchedLocations);
      setIsLoading(false);
    }
    fetchLocations();
  }, []);

  const handleSaveLocation = async (location: DeliveryLocation) => {
    if (editingLocation) {
      await updateDeliveryLocation({ ...location, id: editingLocation.id });
    } else {
      await addDeliveryLocation({ name: location.name, price: location.price });
    }
    const updatedLocations = await getDeliveryLocations();
    setLocations(updatedLocations);
    setEditingLocation(null);
    setIsFormOpen(false);
  };

  const handleEditLocation = (location: DeliveryLocation) => {
    setEditingLocation(location);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingLocation(null);
    setIsFormOpen(true);
  }

  const handleDeleteLocation = async (locationId: string) => {
    await deleteDeliveryLocation(locationId);
    const updatedLocations = await getDeliveryLocations();
    setLocations(updatedLocations);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Location
        </Button>
      </div>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
                <TableRow>
                    <TableCell colSpan={3} className="text-center h-24">Loading delivery locations...</TableCell>
                </TableRow>
            ) : locations.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={3} className="text-center h-24">No delivery locations found.</TableCell>
                </TableRow>
            ) : (
                locations.map((location) => (
                <TableRow key={location.id}>
                    <TableCell className="font-medium">{location.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                        {location.price.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
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
                        <DropdownMenuItem onClick={() => handleEditLocation(location)}>
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
                                    This action cannot be undone. This will permanently delete the delivery location.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteLocation(location.id!)} className="bg-destructive hover:bg-destructive/90">
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
            <DialogTitle>{editingLocation ? 'Edit Location' : 'Add New Location'}</DialogTitle>
            <DialogDescription>
              {editingLocation ? 'Update the details of your delivery location.' : 'Fill in the details for the new delivery location.'}
            </DialogDescription>
          </DialogHeader>
          <DeliveryPriceForm
            location={editingLocation}
            onSave={handleSaveLocation}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
