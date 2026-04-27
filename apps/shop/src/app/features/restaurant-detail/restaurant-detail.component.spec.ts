import { describe, it, expect, beforeEach } from 'vitest';
import { RestaurantDetailComponent } from './restaurant-detail.component';
import { Dish } from './models/dish.model';

describe('RestaurantDetailComponent', () => {
  let component: RestaurantDetailComponent;

  beforeEach(() => {
    component = new RestaurantDetailComponent();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty cart', () => {
    expect(component.cartItems()).toEqual([]);
    expect(component.itemCount()).toBe(0);
  });

  it('should initialize totalPrice to 0', () => {
    expect(component.totalPrice()).toBe(0);
  });

  it('should have dishes from MOCK_DISHES', () => {
    expect(component.dishes).toBeDefined();
    expect(component.dishes.length).toBeGreaterThan(0);
    expect(component.dishes[0]).toHaveProperty('id');
    expect(component.dishes[0]).toHaveProperty('name');
    expect(component.dishes[0]).toHaveProperty('price');
  });

  it('should have restaurant info', () => {
    expect(component.restaurant).toEqual({
      name: 'Sample Restaurant',
      description: 'Best food in town',
    });
  });

  it('should add a dish to the cart', () => {
    const dish: Dish = component.dishes[0];
    component.addToCart(dish);
    expect(component.cartItems()).toEqual([{ dish, quantity: 1 }]);
    expect(component.itemCount()).toBe(1);
  });

  it('should update totalPrice when adding to cart', () => {
    const dish1 = component.dishes[0];
    const dish2 = component.dishes[1];
    component.addToCart(dish1);
    expect(component.totalPrice()).toBe(dish1.price);
    component.addToCart(dish2);
    expect(component.totalPrice()).toBe(dish1.price + dish2.price);
  });

  it('should handle adding the same dish multiple times', () => {
    const dish = component.dishes[0];
    component.addToCart(dish);
    component.addToCart(dish);
    expect(component.cartItems()).toEqual([{ dish, quantity: 2 }]);
    expect(component.itemCount()).toBe(2);
    expect(component.totalPrice()).toBe(dish.price * 2);
  });
});