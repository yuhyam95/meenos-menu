export interface FoodItem {
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
  id: string;
  name: string;
  price: number;
}
