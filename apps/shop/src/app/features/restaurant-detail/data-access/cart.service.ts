import { Injectable, computed, signal } from '@angular/core';
import { Dish } from '../models/dish.model';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart = signal<CartItem[]>([]);

  readonly cartItems = computed(() => this.cart());
  readonly totalPrice = computed(() =>
    this.cart().reduce((sum, item) => sum + item.dish.price * item.quantity, 0)
  );

  addToCart(dish: Dish): void {
    this.cart.update((items) => {
      const existingIndex = items.findIndex((item) => item.dish.id === dish.id);
      if (existingIndex >= 0) {
        const updated = [...items];
        const existing = updated[existingIndex];
        updated[existingIndex] = {
          dish,
          quantity: existing.quantity + 1,
        };
        return updated;
      }

      return [...items, { dish, quantity: 1 }];
    });
  }

  removeFromCart(dishId: number): void {
    this.cart.update((items) => items.filter((item) => item.dish.id !== dishId));
  }

  updateQuantity(dishId: number, quantity: number): void {
    this.cart.update((items) => {
      if (quantity <= 0) {
        return items.filter((item) => item.dish.id !== dishId);
      }

      return items.map((item) =>
        item.dish.id === dishId ? { ...item, quantity } : item
      );
    });
  }

  clearCart(): void {
    this.cart.set([]);
  }
}
