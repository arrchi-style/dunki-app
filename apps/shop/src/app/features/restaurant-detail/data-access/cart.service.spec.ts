import { describe, it, expect, beforeEach } from 'vitest';
import { CartService } from './cart.service';
import { MOCK_DISHES } from '../constants/dish.constants';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    service = new CartService();
  });

  it('should start with an empty cart', () => {
    expect(service.cartItems()).toEqual([]);
    expect(service.totalPrice()).toBe(0);
  });

  it('should add a dish to the cart', () => {
    const dish = MOCK_DISHES[0];
    service.addToCart(dish);

    expect(service.cartItems()).toEqual([{ dish, quantity: 1 }]);
    expect(service.totalPrice()).toBe(dish.price);
  });

  it('should increment quantity for the same dish', () => {
    const dish = MOCK_DISHES[0];
    service.addToCart(dish);
    service.addToCart(dish);

    expect(service.cartItems()).toEqual([{ dish, quantity: 2 }]);
    expect(service.totalPrice()).toBe(dish.price * 2);
  });

  it('should update quantity for an existing dish', () => {
    const dish = MOCK_DISHES[0];
    service.addToCart(dish);
    service.updateQuantity(dish.id, 3);

    expect(service.cartItems()).toEqual([{ dish, quantity: 3 }]);
    expect(service.totalPrice()).toBe(dish.price * 3);
  });

  it('should remove a dish from the cart', () => {
    const dish = MOCK_DISHES[0];
    service.addToCart(dish);
    service.removeFromCart(dish.id);

    expect(service.cartItems()).toEqual([]);
    expect(service.totalPrice()).toBe(0);
  });

  it('should remove an item when quantity is set to zero', () => {
    const dish = MOCK_DISHES[0];
    service.addToCart(dish);
    service.updateQuantity(dish.id, 0);

    expect(service.cartItems()).toEqual([]);
    expect(service.totalPrice()).toBe(0);
  });
});
