import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { CheckoutService } from './checkout.service';
import { CartService } from '../../restaurant-detail/data-access/cart.service';
import { OrderForm } from './order.model';

// Mock CartService
const mockCartService = {
  cartItems: vi.fn(),
  totalPrice: vi.fn(),
  addToCart: vi.fn(),
  removeFromCart: vi.fn(),
  updateQuantity: vi.fn(),
};

// Mock the inject function to return our mock
vi.mock('@angular/core', async () => {
  const actual = await vi.importActual('@angular/core');
  return {
    ...actual,
    inject: vi.fn(() => mockCartService),
  };
});

describe('CheckoutService', () => {
  let service: CheckoutService;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Setup default mock returns
    mockCartService.cartItems.mockReturnValue([]);
    mockCartService.totalPrice.mockReturnValue(0);

    service = new CheckoutService();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Initial State', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have empty cart initially', () => {
      expect(service.isCartEmpty()).toBe(true);
      expect(service.cartItems()).toEqual([]);
      expect(service.subtotal()).toBe(0);
      expect(service.deliveryFee()).toBe(50);
      expect(service.total()).toBe(50);
    });

    it('should not be processing initially', () => {
      expect(service.isProcessing()).toBe(false);
    });

    it('should have no last order result initially', () => {
      expect(service.lastOrder()).toBe(null);
    });

    it('should have empty order history initially', () => {
      expect(service.orderHistory()).toEqual([]);
    });
  });

  describe('Cart State Changes', () => {
    it('should reflect cart items from CartService', () => {
      const mockItems = [
        { dish: { id: 1, name: 'Pizza', price: 20 }, quantity: 2 },
        { dish: { id: 2, name: 'Burger', price: 15 }, quantity: 1 }
      ];

      mockCartService.cartItems.mockReturnValue(mockItems);

      // Create new service instance to get fresh computed values
      const testService = new CheckoutService();

      expect(testService.cartItems()).toEqual(mockItems);
      expect(testService.isCartEmpty()).toBe(false);
    });

    it('should calculate delivery fee correctly', () => {
      // Under $500 - $50 delivery fee
      mockCartService.totalPrice.mockReturnValue(300);
      let testService = new CheckoutService();
      expect(testService.deliveryFee()).toBe(50);
      expect(testService.total()).toBe(350);

      // Over $500 - free delivery
      mockCartService.totalPrice.mockReturnValue(600);
      testService = new CheckoutService();
      expect(testService.deliveryFee()).toBe(0);
      expect(testService.total()).toBe(600);
    });

    it('should update total when subtotal changes', () => {
      mockCartService.totalPrice.mockReturnValue(100);
      let testService = new CheckoutService();
      expect(testService.subtotal()).toBe(100);
      expect(testService.total()).toBe(150); // 100 + 50 delivery

      mockCartService.totalPrice.mockReturnValue(550);
      testService = new CheckoutService();
      expect(testService.subtotal()).toBe(550);
      expect(testService.total()).toBe(550); // 550 + 0 delivery
    });
  });

  describe('Order Processing', () => {
    const validOrderForm: OrderForm = {
      name: 'John Doe',
      phone: '+1234567890',
      address: '123 Main St, City, State',
      paymentMethod: 'cash'
    };

    it('should reject order when cart is empty', async () => {
      mockCartService.cartItems.mockReturnValue([]);

      const result = await service.processOrder(validOrderForm);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Cart is empty');
      expect(service.lastOrder()).toEqual(result);
    });

    it('should process order successfully with cart items', async () => {
      const mockItems = [
        { dish: { id: 1, name: 'Pizza', price: 20 }, quantity: 2 },
        { dish: { id: 2, name: 'Burger', price: 15 }, quantity: 1 }
      ];

      mockCartService.cartItems.mockReturnValue(mockItems);
      mockCartService.totalPrice.mockReturnValue(55); // 40 + 15

      const result = await service.processOrder(validOrderForm);

      expect(result.success).toBe(true);
      expect(result.order).toBeDefined();
      expect(result.order?.name).toBe('John Doe');
      expect(result.order?.phone).toBe('+1234567890');
      expect(result.order?.address).toBe('123 Main St, City, State');
      expect(result.order?.paymentMethod).toBe('cash');
      expect(result.order?.subtotal).toBe(55);
      expect(result.order?.deliveryFee).toBe(50);
      expect(result.order?.total).toBe(105);
      expect(result.order?.status).toBe('pending');
      expect(result.order?.items).toEqual([
        { dish: { id: 1, name: 'Pizza', price: 20 }, quantity: 2 },
        { dish: { id: 2, name: 'Burger', price: 15 }, quantity: 1 }
      ]);
      expect(result.order?.id).toMatch(/^ORD-\d+-[A-Z0-9]+$/);
      expect(result.order?.createdAt).toBeInstanceOf(Date);
    });

    it('should set processing state during order processing', async () => {
      const mockItems = [{ dish: { id: 1, name: 'Pizza', price: 20 }, quantity: 1 }];
      mockCartService.cartItems.mockReturnValue(mockItems);
      mockCartService.totalPrice.mockReturnValue(20);

      // Start processing
      const processPromise = service.processOrder(validOrderForm);

      // Should be processing
      expect(service.isProcessing()).toBe(true);

      // Wait for completion
      await processPromise;

      // Should not be processing anymore
      expect(service.isProcessing()).toBe(false);
    });

    it('should add successful orders to history', async () => {
      const mockItems = [{ dish: { id: 1, name: 'Pizza', price: 20 }, quantity: 1 }];
      mockCartService.cartItems.mockReturnValue(mockItems);
      mockCartService.totalPrice.mockReturnValue(20);

      await service.processOrder(validOrderForm);

      expect(service.orderHistory()).toHaveLength(1);
      expect(service.orderHistory()[0].name).toBe('John Doe');
    });

    it('should clear cart after successful order', async () => {
      const mockItems = [{ dish: { id: 1, name: 'Pizza', price: 20 }, quantity: 1 }];
      mockCartService.cartItems.mockReturnValue(mockItems);
      mockCartService.totalPrice.mockReturnValue(20);

      await service.processOrder(validOrderForm);

      expect(mockCartService.removeFromCart).toHaveBeenCalledWith(1);
    });

    it('should handle processing errors', async () => {
      const mockItems = [{ dish: { id: 1, name: 'Pizza', price: 20 }, quantity: 1 }];
      mockCartService.cartItems.mockReturnValue(mockItems);
      mockCartService.totalPrice.mockReturnValue(20);

      // Mock a processing error by making removeFromCart throw
      mockCartService.removeFromCart.mockImplementation(() => {
        throw new Error('Cart clear failed');
      });

      const result = await service.processOrder(validOrderForm);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to process order');
      expect(service.isProcessing()).toBe(false);
    });
  });

  describe('Utility Methods', () => {
    it('should clear last order result', async () => {
      const mockItems = [{ dish: { id: 1, name: 'Pizza', price: 20 }, quantity: 1 }];
      mockCartService.cartItems.mockReturnValue(mockItems);
      mockCartService.totalPrice.mockReturnValue(20);

      await service.processOrder({
        name: 'Test',
        phone: '+1234567890',
        address: 'Test Address',
        paymentMethod: 'cash'
      });

      expect(service.lastOrder()).not.toBe(null);

      service.clearLastOrderResult();

      expect(service.lastOrder()).toBe(null);
    });
  });
});
