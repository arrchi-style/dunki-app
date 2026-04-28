export interface OrderForm {
  name: string;
  phone: string;
  address: string;
  paymentMethod: 'cash' | 'card';
}

export interface Order extends OrderForm {
  id: string;
  items: Array<{
    dish: {
      id: number;
      name: string;
      price: number;
    };
    quantity: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: Date;
}