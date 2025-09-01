
import type { ObjectId } from 'mongodb';

export interface FoodItem {
  _id?: ObjectId;
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  'data-ai-hint'?: string;
}

export interface CartItem extends FoodItem {
  quantity: number;
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
  }
  
