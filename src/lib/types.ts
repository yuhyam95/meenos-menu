

import type { ObjectId } from 'mongodb';

export interface FoodItem {
  _id?: ObjectId;
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  quantity: number;
  'data-ai-hint'?: string;
}

export interface CartItem extends FoodItem {
  quantity: number; // Cart quantity
  originalQuantity: number; // Original product stock quantity
}

export interface DeliveryLocation {
  _id?: ObjectId;
  id?: string;
  name: string;
  price: number;
}

export interface FoodCategory {
  _id?: ObjectId;
  id?: string;
  name: string;
}

export interface Order {
    _id?: ObjectId;
    id: string;
    customer: {
      name: string;
      phone: string;
      address?: string;
    };
    items: CartItem[];
    total: number;
    status: 'Pending' | 'In Progress' | 'Delivered' | 'Cancelled';
    orderType: 'delivery' | 'pickup';
    createdAt: Date;
  }
  
  export type OrderStatus = 'Pending' | 'In Progress' | 'Delivered' | 'Cancelled';

export interface StoreSetting {
  _id?: ObjectId;
  id?: string;
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  headerImageUrl?: string;
  address?: string;
  phone?: string;
  email?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
}

export interface User {
    _id?: ObjectId;
    id?: string;
    name: string;
    email: string;
    phone: string;
    role: 'Admin' | 'User';
    password?: string;
}
