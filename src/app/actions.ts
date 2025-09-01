
'use server';

import { revalidatePath } from 'next/cache';
import clientPromise from '@/lib/db';
import type { DeliveryLocation, FoodItem, FoodCategory } from '@/lib/types';
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

async function getCategoryCollection(): Promise<Collection<Omit<FoodCategory, 'id'>>> {
    const client = await clientPromise;
    const db = client.db('meenos');
    return db.collection<Omit<FoodCategory, 'id'>>('food_categories');
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

// Food Category Actions
export async function getFoodCategories(): Promise<FoodCategory[]> {
    const collection = await getCategoryCollection();
    const categories = await collection.find({}).sort({ name: 1 }).toArray();
    return categories.map(cat => {
        const { _id, ...rest } = cat;
        return { ...rest, id: _id!.toString() };
    });
}

export async function addFoodCategory(categoryData: Omit<FoodCategory, 'id' | '_id'>): Promise<void> {
    const collection = await getCategoryCollection();
    await collection.insertOne(categoryData);
    revalidatePath('/admin/categories');
    revalidatePath('/admin/menu');
}

export async function updateFoodCategory(category: FoodCategory): Promise<void> {
    const { id, ...categoryData } = category;
    if (!id || !ObjectId.isValid(id)) {
        throw new Error('Invalid ID for updating food category.');
    }
    const collection = await getCategoryCollection();
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: categoryData });
    revalidatePath('/admin/categories');
    revalidatePath('/admin/menu');
}

export async function deleteFoodCategory(categoryId: string): Promise<void> {
    if (!ObjectId.isValid(categoryId)) {
        throw new Error('Invalid ID for deleting food category.');
    }
    const collection = await getCategoryCollection();
    await collection.deleteOne({ _id: new ObjectId(categoryId) });
    revalidatePath('/admin/categories');
    revalidatePath('/admin/menu');
}
