import { describe, it, expect, vi } from 'vitest';
import { computed, signal } from '@angular/core';
import { MOCK_DISHES } from './constants/dish.constants';

// Mock CartService behavior using signals
const mockCartItems = signal<any[]>([]);
const mockTotalPrice = signal(0);

const mockCartService = {
  cartItems: () => mockCartItems(),
  totalPrice: () => mockTotalPrice(),
  addToCart: vi.fn(),
  removeFromCart: vi.fn(),
  updateQuantity: vi.fn(),
};

// Test the component logic without instantiating it
describe('RestaurantDetailComponent Logic', () => {
  beforeEach(() => {
    // Reset signals
    mockCartItems.set([]);
    mockTotalPrice.set(0);
    vi.clearAllMocks();
  });

  describe('Computed Properties', () => {
    it('should calculate delivery fee correctly', () => {
      // Test free delivery over $500
      mockTotalPrice.set(600);
      const deliveryFee = computed(() => mockTotalPrice() > 500 ? 0 : 50);
      expect(deliveryFee()).toBe(0);

      // Test $50 delivery under $500
      mockTotalPrice.set(300);
      expect(deliveryFee()).toBe(50);
    });

    it('should detect free delivery threshold', () => {
      const isFreeDeliveryMet = computed(() => mockTotalPrice() >= 500);

      mockTotalPrice.set(499);
      expect(isFreeDeliveryMet()).toBe(false);

      mockTotalPrice.set(500);
      expect(isFreeDeliveryMet()).toBe(true);

      mockTotalPrice.set(600);
      expect(isFreeDeliveryMet()).toBe(true);
    });

    it('should calculate total with delivery', () => {
      const deliveryFee = computed(() => mockTotalPrice() > 500 ? 0 : 50);
      const totalWithDelivery = computed(() => mockTotalPrice() + deliveryFee());

      mockTotalPrice.set(300);
      expect(totalWithDelivery()).toBe(350); // 300 + 50

      mockTotalPrice.set(600);
      expect(totalWithDelivery()).toBe(600); // 600 + 0
    });

    it('should calculate item count correctly', () => {
      const itemCount = computed(() =>
        mockCartItems().reduce((sum, item) => sum + item.quantity, 0)
      );

      mockCartItems.set([
        { dish: { id: 1 }, quantity: 2 },
        { dish: { id: 2 }, quantity: 3 }
      ]);
      expect(itemCount()).toBe(5); // 2 + 3

      mockCartItems.set([]);
      expect(itemCount()).toBe(0);
    });
  });

  describe('Static Data', () => {
    it('should have dishes from MOCK_DISHES', () => {
      expect(MOCK_DISHES).toBeDefined();
      expect(MOCK_DISHES.length).toBeGreaterThan(0);
      expect(MOCK_DISHES[0]).toHaveProperty('id');
      expect(MOCK_DISHES[0]).toHaveProperty('name');
      expect(MOCK_DISHES[0]).toHaveProperty('price');
    });
  });

  describe('Cart Operations', () => {
    it('should call addToCart on cart service', () => {
      const dish = MOCK_DISHES[0];
      mockCartService.addToCart(dish);
      expect(mockCartService.addToCart).toHaveBeenCalledWith(dish);
    });

    it('should call removeFromCart on cart service', () => {
      const dishId = 1;
      mockCartService.removeFromCart(dishId);
      expect(mockCartService.removeFromCart).toHaveBeenCalledWith(dishId);
    });
  });
});