
'use server';

import { revalidatePath } from 'next/cache';
import clientPromise from '@/lib/db';
import type { DeliveryLocation, FoodItem, FoodCategory, Order, OrderStatus, StoreSetting, User } from '@/lib/types';
import { Collection, ObjectId } from 'mongodb';
import { redirect } from 'next/navigation';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY || 'your-super-secret-jwt-key');

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

async function getOrdersCollection(): Promise<Collection<Omit<Order, 'id'>>> {
  const client = await clientPromise;
  const db = client.db('meenos');
  return db.collection<Omit<Order, 'id'>>('orders');
}

async function getStoreSettingsCollection(): Promise<Collection<StoreSetting>> {
    const client = await clientPromise;
    const db = client.db('meenos');
    return db.collection<StoreSetting>('store_settings');
}

async function getUsersCollection(): Promise<Collection<Omit<User, 'id'>>> {
    const client = await clientPromise;
    const db = client.db('meenos');
    return db.collection<Omit<User, 'id'>>('users');
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

// Order Actions
export async function getOrders(): Promise<Order[]> {
  const collection = await getOrdersCollection();
  const orders = await collection.find({}).sort({ createdAt: -1 }).toArray();
  return orders.map(order => {
    const { _id, ...rest } = order;
    return { ...rest, id: _id!.toString() };
  });
}

export async function addOrder(orderData: Omit<Order, 'id' | '_id' | 'createdAt'>): Promise<void> {
  const collection = await getOrdersCollection();
  const now = new Date();
  await collection.insertOne({ ...orderData, createdAt: now });
  revalidatePath('/admin/orders');
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  if (!ObjectId.isValid(orderId)) {
    throw new Error('Invalid ID for updating order status.');
  }
  const collection = await getOrdersCollection();
  await collection.updateOne({ _id: new ObjectId(orderId) }, { $set: { status } });
  revalidatePath('/admin/orders');
}

// Store Settings Actions
export async function getStoreSettings(): Promise<StoreSetting | null> {
    const collection = await getStoreSettingsCollection();
    const settings = await collection.findOne({});
    if (!settings) {
        return null;
    }
    const { _id, ...rest } = settings;
    return { ...rest, id: _id!.toString() };
}

export async function saveStoreSettings(settingsData: Omit<StoreSetting, 'id' | '_id'>): Promise<void> {
    const collection = await getStoreSettingsCollection();
    // Use upsert to create if not exists, or update if it does.
    // We assume there's only one settings document.
    await collection.updateOne({}, { $set: settingsData }, { upsert: true });
    revalidatePath('/admin/store-setup');
    revalidatePath('/');
}

// User Actions
export async function getUsers(): Promise<User[]> {
    const collection = await getUsersCollection();
    const users = await collection.find({}).toArray();
    return users.map(user => {
        const { _id, password, ...rest } = user;
        return { ...rest, id: _id!.toString() };
    });
}

export async function addUser(userData: Omit<User, 'id' | '_id'>): Promise<void> {
    const collection = await getUsersCollection();
    // In a real app, you would hash the password here
    // For example:
    // const hashedPassword = await bcrypt.hash(userData.password, 10);
    // await collection.insertOne({ ...userData, password: hashedPassword });
    await collection.insertOne(userData);
    revalidatePath('/admin/users');
}


// Auth Actions
export async function login(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'Invalid credentials' };
  }

  const usersCollection = await getUsersCollection();
  const user = await usersCollection.findOne({
    $or: [{ email: username }, { phone: username }],
  });

  if (!user || user.password !== password) {
    return { error: 'Invalid credentials' };
  }

  const { password: userPassword, ...payload } = user;

  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secretKey);

  cookies().set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60, // 1 hour
    path: '/',
  });

  redirect('/admin');
}

export async function logout() {
  cookies().set('session', '', { expires: new Date(0) });
  redirect('/login');
}

export async function getSession() {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) return null;
  try {
    const { payload } = await jwtVerify(sessionCookie, secretKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}
