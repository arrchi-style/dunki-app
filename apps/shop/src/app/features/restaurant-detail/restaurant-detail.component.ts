import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { Dish } from './models/dish.model';
import { MOCK_DISHES } from './constants/dish.constants';

@Component({
  selector: 'app-restaurant-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './restaurant-detail.component.html',
  styleUrl: './restaurant-detail.component.scss',
})
export class RestaurantDetailComponent {
  cart = signal<Dish[]>([]);
  totalPrice = computed(() => this.cart().reduce((sum, dish) => sum + dish.price, 0));

  dishes = MOCK_DISHES;
  restaurant = { name: 'Sample Restaurant', description: 'Best food in town' };

  addToCart(dish: Dish) {
    this.cart.update(cart => [...cart, dish]);
  }
}