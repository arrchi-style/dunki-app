import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Імпортуємо
import { firstValueFrom } from 'rxjs'; // Для зручної роботи з Promise
import { CartService } from '../../restaurant-detail/data-access/cart.service';
import { Order, OrderForm } from './order.model';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private cartService = inject(CartService);
  private http = inject(HttpClient);

  readonly cartItems = this.cartService.cartItems;
  readonly subtotal = this.cartService.totalPrice;
  readonly deliveryFee = computed(() => this.subtotal() > 500 ? 0 : 50);
  readonly total = computed(() => this.subtotal() + this.deliveryFee());
  readonly isCartEmpty = computed(() => this.cartItems().length === 0);

  private isProcessingOrder = signal(false);
  readonly isProcessing = this.isProcessingOrder.asReadonly();

  private lastOrderResult = signal<{ success: boolean; order?: Order; error?: string } | null>(null);
  readonly lastOrder = this.lastOrderResult.asReadonly();

  async processOrder(orderForm: OrderForm): Promise<{ success: boolean; order?: Order; error?: string }> {
    if (this.isCartEmpty()) {
      return { success: false, error: 'Cart is empty' };
    }

    this.isProcessingOrder.set(true);

    const orderPayload = {
      ...orderForm,
      items: this.cartItems().map(item => ({
        dishId: item.dish.id,
        name: item.dish.name,
        price: item.dish.price,
        quantity: item.quantity
      })),
      total: this.total(),
      subtotal: this.subtotal(),
      deliveryFee: this.deliveryFee()
    };

    try {
      const response = await firstValueFrom(
        this.http.post<Order>('http://localhost:3000/api/orders', orderPayload)
      );

      this.cartService.clearCart();
      
      const result = { success: true, order: response };
      this.lastOrderResult.set(result);
      return result;

    } catch (error) {
      console.error('Backend error:', error);
      const result = { success: false, error: 'Server connection failed' };
      this.lastOrderResult.set(result);
      return result;
    } finally {
      this.isProcessingOrder.set(false);
    }
  }

  clearLastOrderResult(): void {
    this.lastOrderResult.set(null);
  }
}