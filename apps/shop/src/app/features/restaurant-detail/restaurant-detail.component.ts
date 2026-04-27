import { Component, computed, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Dish } from './models/dish.model';
import { MOCK_DISHES } from './constants/dish.constants';
import { CartService } from './data-access/cart.service';

@Component({
  selector: 'app-restaurant-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './restaurant-detail.component.html',
  styleUrl: './restaurant-detail.component.scss',
})
export class RestaurantDetailComponent {
  private cartService = this.resolveCartService();
  private router = inject(Router);

  cartItems = this.cartService.cartItems;
  subtotal = this.cartService.totalPrice;
  totalPrice = this.subtotal;
  deliveryFee = computed(() => this.subtotal() > 500 ? 0 : 50);
  isFreeDeliveryMet = computed(() => this.subtotal() >= 500);
  totalWithDelivery = computed(() => this.subtotal() + this.deliveryFee());
  itemCount = computed(() => this.cartItems().reduce((sum, item) => sum + item.quantity, 0));

  dishes = MOCK_DISHES;
  restaurant = { name: 'Sample Restaurant', description: 'Best food in town' };

  addToCart(dish: Dish) {
    this.cartService.addToCart(dish);
  }

  removeFromCart(dishId: number) {
    this.cartService.removeFromCart(dishId);
  }

  proceedToCheckout() {
    this.router.navigate(['/checkout']);
  }

  private resolveCartService(): CartService {
    try {
      return inject(CartService, { optional: true }) ?? new CartService();
    } catch {
      return new CartService();
    }
  }
}