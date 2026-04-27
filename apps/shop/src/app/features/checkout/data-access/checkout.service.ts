import { Injectable, signal, computed, inject } from '@angular/core';
import { CartService } from '../../restaurant-detail/data-access/cart.service';
import { Order, OrderForm } from './order.model';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private cartService = inject(CartService);

  // Reactive signals that mirror cart service data
  readonly cartItems = this.cartService.cartItems;
  readonly subtotal = this.cartService.totalPrice;
  readonly deliveryFee = computed(() => this.subtotal() > 500 ? 0 : 50);
  readonly total = computed(() => this.subtotal() + this.deliveryFee());
  readonly isCartEmpty = computed(() => this.cartItems().length === 0);

  // Order processing state
  private orders = signal<Order[]>([]);
  readonly orderHistory = this.orders.asReadonly();

  // Processing state
  private isProcessingOrder = signal(false);
  readonly isProcessing = this.isProcessingOrder.asReadonly();

  // Last order result
  private lastOrderResult = signal<{ success: boolean; order?: Order; error?: string } | null>(null);
  readonly lastOrder = this.lastOrderResult.asReadonly();

  async processOrder(orderForm: OrderForm): Promise<{ success: boolean; order?: Order; error?: string }> {
    if (this.isCartEmpty()) {
      const result = { success: false, error: 'Cart is empty' };
      this.lastOrderResult.set(result);
      return result;
    }

    this.isProcessingOrder.set(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const order: Order = {
        id: this.generateOrderId(),
        ...orderForm,
        items: this.cartItems().map(item => ({
          dish: {
            id: item.dish.id,
            name: item.dish.name,
            price: item.dish.price
          },
          quantity: item.quantity
        })),
        subtotal: this.subtotal(),
        deliveryFee: this.deliveryFee(),
        total: this.total(),
        status: 'pending',
        createdAt: new Date()
      };

      // Add to order history
      this.orders.update(orders => [...orders, order]);

      // Clear cart after successful order
      this.cartService.cartItems().forEach(item => {
        this.cartService.removeFromCart(item.dish.id);
      });

      const result = { success: true, order };
      this.lastOrderResult.set(result);
      return result;

    } catch (error) {
      const result = { success: false, error: 'Failed to process order' };
      this.lastOrderResult.set(result);
      return result;
    } finally {
      this.isProcessingOrder.set(false);
    }
  }

  clearLastOrderResult(): void {
    this.lastOrderResult.set(null);
  }

  private generateOrderId(): string {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
}