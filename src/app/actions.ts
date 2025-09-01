'use server';

import { revalidatePath } from 'next/cache';
import clientPromise from '@/lib/db';
import type { DeliveryLocation } from '@/lib/types';
import { Collection, ObjectId } from 'mongodb';

async function getDeliveryCollection(): Promise<Collection<DeliveryLocation>> {
  const client = await clientPromise;
  const db = client.db('meenos');
  return db.collection<DeliveryLocation>('delivery_locations');
}

export async function getDeliveryLocations(): Promise<DeliveryLocation[]> {
  const collection = await getDeliveryCollection();
  const locations = await collection.find({}).toArray();
  // Convert _id to string for client-side usage
  return locations.map(loc => ({ ...loc, id: loc._id!.toString() }));
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
