'use server';

import { revalidatePath } from 'next/cache';
import clientPromise from '@/lib/db';
import type { DeliveryLocation, FoodItem } from '@/lib/types';
import { Collection, ObjectId } from 'mongodb';

async function getDeliveryCollection(): Promise<Collection<DeliveryLocation>> {
  const client = await clientPromise;
  const db = client.db('meenos');
  return db.collection<DeliveryLocation>('delivery_locations');
}

async function getMenuCollection(): Promise<Collection<Omit<FoodItem, 'id'>>> {
    const client = await clientPromise;
    const db = client.db('meenos');
    return db.collection<Omit<FoodItem, 'id'>>('menu_items');
}

export async function getDeliveryLocations(): Promise<DeliveryLocation[]> {
  const collection = await getDeliveryCollection();
  const locations = await collection.find({}).toArray();
  // Convert _id to string for client-side usage and remove it
  return locations.map(loc => {
    const { _id, ...rest } = loc;
    return { ...rest, id: _id!.toString() };
  });
}

export async function addDeliveryLocation(locationData: Omit<DeliveryLocation, 'id' | '_id'>): Promise<void> {
  const collection = await getDeliveryCollection();
  await collection.insertOne(locationData);
  revalidatePath('/admin/delivery');
}

export async function updateDeliveryLocation(location: DeliveryLocation): Promise<void> {
    const { id, ...locationData } = location;
    if (!id || !ObjectId.isValid(id)) {
        throw new Error('Invalid ID for updating delivery location.');
    }
    const collection = await getDeliveryCollection();
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: locationData });
    revalidatePath('/admin/delivery');
}

export async function deleteDeliveryLocation(locationId: string): Promise<void> {
  if (!ObjectId.isValid(locationId)) {
    throw new Error('Invalid ID for deleting delivery location.');
  }
  const collection = await getDeliveryCollection();
  await collection.deleteOne({ _id: new ObjectId(locationId) });
  revalidatePath('/admin/delivery');
}


// Menu Item Actions
export async function getMenuItems(): Promise<FoodItem[]> {
    const collection = await getMenuCollection();
    const items = await collection.find({}).toArray();
    return items.map(item => {
        const { _id, ...rest } = item;
        return { ...rest, id: _id!.toString() };
    });
}

export async function addMenuItem(itemData: Omit<FoodItem, 'id' | '_id'>): Promise<void> {
    const collection = await getMenuCollection();
    await collection.insertOne(itemData);
    revalidatePath('/admin/menu');
    revalidatePath('/');
}

export async function updateMenuItem(item: FoodItem): Promise<void> {
    const { id, ...itemData } = item;
    if (!id || !ObjectId.isValid(id)) {
        throw new Error('Invalid ID for updating menu item.');
    }
    const collection = await getMenuCollection();
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: itemData });
    revalidatePath('/admin/menu');
    revalidatePath('/');
}

export async function deleteMenuItem(itemId: string): Promise<void> {
    if (!ObjectId.isValid(itemId)) {
        throw new Error('Invalid ID for deleting menu item.');
    }
    const collection = await getMenuCollection();
    await collection.deleteOne({ _id: new ObjectId(itemId) });
    revalidatePath('/admin/menu');
    revalidatePath('/');
}
