
'use server';

import { revalidatePath } from 'next/cache';
import clientPromise from '@/lib/db';
import type { DeliveryLocation, FoodItem, FoodCategory, Order, OrderStatus, StoreSetting, User, InventoryItem } from '@/lib/types';
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

async function getInventoryCollection(): Promise<Collection<Omit<InventoryItem, 'id'>>> {
    const client = await clientPromise;
    const db = client.db('meenos');
    return db.collection<Omit<InventoryItem, 'id'>>('inventory_items');
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
  const orderWithId = { ...orderData, createdAt: now };
  const result = await collection.insertOne(orderWithId);
  
  // Generate order ID for notifications
  const orderId = result.insertedId.toString();
  const order: Order = { ...orderWithId, id: orderId };
  
  // Send notifications asynchronously (don't block the order creation)
  setImmediate(async () => {
    try {
      const { sendOrderNotifications, getNotificationConfig } = await import('@/lib/notifications');
      const config = getNotificationConfig();
      
      // Add customer phone to config if available
      const notificationConfig = {
        ...config,
        customerPhone: orderData.customer.phone
      };
      
      const results = await sendOrderNotifications(order, notificationConfig);
      
      // Log notification results
      console.log('Order notification results:', {
        orderId: order.id,
        email: results.email.success ? 'sent' : `failed: ${results.email.error}`,
        whatsapp: results.whatsapp.success ? 'sent' : `failed: ${results.whatsapp.error}`,
        customerEmail: results.customerEmail.success ? 'sent' : `failed: ${results.customerEmail.error}`,
        customerWhatsApp: results.customerWhatsApp.success ? 'sent' : `failed: ${results.customerWhatsApp.error}`
      });
    } catch (error) {
      console.error('Error sending order notifications:', error);
    }
  });
  
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

// Inventory Actions
export async function getInventoryItems(): Promise<InventoryItem[]> {
    const collection = await getInventoryCollection();
    const items = await collection.find({}).sort({ name: 1 }).toArray();
    return items.map(item => {
        const { _id, ...rest } = item;
        return { ...rest, id: _id!.toString() };
    });
}

export async function addInventoryItem(itemData: Omit<InventoryItem, 'id' | '_id'>): Promise<void> {
    const collection = await getInventoryCollection();
    const result = await collection.insertOne(itemData);
    
    // Check if newly added item is low stock
    const newItem = await collection.findOne({ _id: result.insertedId });
    if (newItem && isLowStock(newItem)) {
        // Send notification asynchronously (don't block the insert)
        setImmediate(async () => {
            try {
                const { sendLowStockEmailNotification } = await import('@/lib/email');
                const { getNotificationConfig } = await import('@/lib/notifications');
                const config = getNotificationConfig();
                
                if (config.enableEmail) {
                    const inventoryItem: InventoryItem = {
                        ...newItem,
                        id: newItem._id!.toString(),
                        quantity: newItem.quantity || 0,
                    };
                    
                    await sendLowStockEmailNotification(inventoryItem, config.adminEmail);
                    
                    // Update last notification timestamp
                    await collection.updateOne(
                        { _id: result.insertedId },
                        { $set: { lastLowStockNotification: new Date() } }
                    );
                    
                    console.log(`Low stock notification sent for newly added item: ${newItem.name}`);
                }
            } catch (error) {
                console.error('Error sending low stock notification:', error);
            }
        });
    }
    
    revalidatePath('/admin/inventory');
}

export async function updateInventoryItem(item: InventoryItem): Promise<void> {
    const { id, ...itemData } = item;
    if (!id || !ObjectId.isValid(id)) {
        throw new Error('Invalid ID for updating inventory item.');
    }
    const collection = await getInventoryCollection();
    
    // Get previous item state to check if quantity changed
    const previousItem = await collection.findOne({ _id: new ObjectId(id) });
    const previousQuantity = previousItem?.quantity || 0;
    
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: itemData });
    
    // Check for low stock after update
    const updatedItem = await collection.findOne({ _id: new ObjectId(id) });
    if (updatedItem && shouldSendNotification(updatedItem, previousQuantity)) {
        // Send notification asynchronously (don't block the update)
        setImmediate(async () => {
            try {
                const { sendLowStockEmailNotification } = await import('@/lib/email');
                const { getNotificationConfig } = await import('@/lib/notifications');
                const config = getNotificationConfig();
                
                if (config.enableEmail) {
                    const inventoryItem: InventoryItem = {
                        ...updatedItem,
                        id: updatedItem._id!.toString(),
                        quantity: updatedItem.quantity || 0,
                    };
                    
                    await sendLowStockEmailNotification(inventoryItem, config.adminEmail);
                    
                    // Update last notification timestamp
                    await collection.updateOne(
                        { _id: new ObjectId(id) },
                        { $set: { lastLowStockNotification: new Date() } }
                    );
                    
                    console.log(`Low stock notification sent for: ${updatedItem.name}`);
                }
            } catch (error) {
                console.error('Error sending low stock notification:', error);
            }
        });
    }
    
    revalidatePath('/admin/inventory');
}

export async function deleteInventoryItem(itemId: string): Promise<void> {
    if (!ObjectId.isValid(itemId)) {
        throw new Error('Invalid ID for deleting inventory item.');
    }
    const collection = await getInventoryCollection();
    await collection.deleteOne({ _id: new ObjectId(itemId) });
    revalidatePath('/admin/inventory');
}

// Helper function to check if item is low stock and should trigger notification
function isLowStock(item: { quantity: number; minQuantity?: number }): boolean {
    // If quantity is 0, always trigger
    if (item.quantity === 0) return true;
    // If minQuantity is set and current quantity is at or below it
    if (item.minQuantity !== undefined && item.quantity <= item.minQuantity) return true;
    return false;
}

// Helper function to check if we should send a notification (prevent duplicates)
function shouldSendNotification(
    item: { quantity: number; minQuantity?: number; lastLowStockNotification?: Date },
    previousQuantity: number
): boolean {
    // Only send if item is currently low stock
    if (!isLowStock(item)) return false;
    
    // Check if item was already low stock before this change
    const wasLowStock = previousQuantity === 0 || 
        (item.minQuantity !== undefined && previousQuantity <= item.minQuantity);
    
    // If item just crossed the threshold (was NOT low stock, now IS low stock), always notify
    if (!wasLowStock) {
        return true;
    }
    
    // If item was already low stock and still is, only notify if it's been 24+ hours since last notification
    // This prevents spam for items that stay low stock for extended periods
    if (wasLowStock && item.lastLowStockNotification) {
        const hoursSinceLastNotification = (Date.now() - item.lastLowStockNotification.getTime()) / (1000 * 60 * 60);
        // Only send if it's been more than 24 hours since last notification
        return hoursSinceLastNotification >= 24;
    }
    
    // If was low stock but no previous notification timestamp, send it
    return true;
}

export async function adjustInventoryQuantity(itemId: string, adjustment: number): Promise<void> {
    if (!ObjectId.isValid(itemId)) {
        throw new Error('Invalid ID for adjusting inventory quantity.');
    }
    const collection = await getInventoryCollection();
    
    // Get current item to check quantity before adjustment
    const currentItem = await collection.findOne({ _id: new ObjectId(itemId) });
    if (!currentItem) {
        throw new Error('Inventory item not found.');
    }
    
    const previousQuantity = currentItem.quantity || 0;
    
    // Prevent negative quantities
    const newQuantity = previousQuantity + adjustment;
    if (newQuantity < 0) {
        throw new Error(`Cannot decrease quantity below zero. Current quantity: ${previousQuantity}, attempted adjustment: ${adjustment}`);
    }
    
    await collection.updateOne(
        { _id: new ObjectId(itemId) },
        { $inc: { quantity: adjustment } }
    );
    
    // Check for low stock after adjustment
    const updatedItem = await collection.findOne({ _id: new ObjectId(itemId) });
    if (updatedItem && shouldSendNotification(updatedItem, previousQuantity)) {
        // Send notification asynchronously (don't block the adjustment)
        setImmediate(async () => {
            try {
                const { sendLowStockEmailNotification } = await import('@/lib/email');
                const { getNotificationConfig } = await import('@/lib/notifications');
                const config = getNotificationConfig();
                
                if (config.enableEmail) {
                    const inventoryItem: InventoryItem = {
                        ...updatedItem,
                        id: updatedItem._id!.toString(),
                        quantity: updatedItem.quantity || 0,
                    };
                    
                    await sendLowStockEmailNotification(inventoryItem, config.adminEmail);
                    
                    // Update last notification timestamp
                    await collection.updateOne(
                        { _id: new ObjectId(itemId) },
                        { $set: { lastLowStockNotification: new Date() } }
                    );
                    
                    console.log(`Low stock notification sent for: ${updatedItem.name}`);
                }
            } catch (error) {
                console.error('Error sending low stock notification:', error);
            }
        });
    }
    
    revalidatePath('/admin/inventory');
}
