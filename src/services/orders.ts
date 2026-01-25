import { prisma } from '../db/prisma.js';
import pino from 'pino';

const logger = pino();

// Product catalog with pricing
const PRODUCTS: Record<string, { name: string; prices: Record<string, number>; category: string }> = {
  // Blends
  'house-blend': { name: 'House Blend', prices: { '12oz': 19.99, '1lb': 28.99, '2lb': 49.99, '5lb': 89.99 }, category: 'blend' },
  'breakfast-blend': { name: 'Breakfast Blend', prices: { '12oz': 19.99, '1lb': 28.99, '2lb': 49.99, '5lb': 89.99 }, category: 'blend' },
  'french-roast': { name: 'French Roast', prices: { '12oz': 19.99, '1lb': 28.99, '2lb': 49.99, '5lb': 89.99 }, category: 'blend' },
  'italian-roast': { name: 'Italian Roast', prices: { '12oz': 19.99, '1lb': 28.99, '2lb': 49.99, '5lb': 89.99 }, category: 'blend' },
  'max-caf': { name: 'Max Caf Blend', prices: { '12oz': 19.99, '1lb': 28.99, '2lb': 49.99, '5lb': 89.99 }, category: 'blend' },
  'cold-brew': { name: 'Cold Brew Coffee', prices: { '12oz': 19.99, '1lb': 28.99, '2lb': 49.99, '5lb': 89.99 }, category: 'blend' },

  // Single Origins
  'colombia': { name: 'Colombia', prices: { '12oz': 19.99, '1lb': 28.99, '2lb': 49.99, '5lb': 89.99 }, category: 'single-origin' },
  'ethiopia': { name: 'Ethiopia Natural', prices: { '12oz': 19.99, '1lb': 28.99, '2lb': 49.99, '5lb': 89.99 }, category: 'single-origin' },
  'guatemala': { name: 'Guatemala', prices: { '12oz': 19.99, '1lb': 28.99, '2lb': 49.99, '5lb': 89.99 }, category: 'single-origin' },
  'peru': { name: 'Peru', prices: { '12oz': 19.99, '1lb': 28.99, '2lb': 49.99, '5lb': 89.99 }, category: 'single-origin' },
  'kenya': { name: 'Kenya', prices: { '12oz': 19.99, '1lb': 28.99, '2lb': 49.99, '5lb': 89.99 }, category: 'single-origin' },
  'bali-blue': { name: 'Bali Blue', prices: { '12oz': 19.99, '1lb': 28.99, '2lb': 49.99, '5lb': 89.99 }, category: 'single-origin' },
  'sumatra': { name: 'Sumatra', prices: { '12oz': 19.99, '1lb': 28.99, '2lb': 49.99, '5lb': 89.99 }, category: 'single-origin' },

  // Specialty
  'mushroom-coffee': { name: 'Mushroom Coffee', prices: { '12oz': 24.99, '1lb': 34.99 }, category: 'specialty' },
  'whiskey-barrel': { name: 'Whiskey Barrel Aged', prices: { '12oz': 29.99, '1lb': 44.99 }, category: 'specialty' },

  // Pods
  'pods-mexico': { name: 'Mexico Pods (12-pack)', prices: { '12pack': 19.99 }, category: 'pods' },
  'pods-peru': { name: 'Peru Pods (12-pack)', prices: { '12pack': 19.99 }, category: 'pods' },
  'pods-bali': { name: 'Bali Pods (12-pack)', prices: { '12pack': 19.99 }, category: 'pods' },

  // Teas
  'english-breakfast': { name: 'English Breakfast Tea', prices: { '3oz': 20.99 }, category: 'tea' },
  'earl-grey': { name: 'Earl Grey Tea', prices: { '3oz': 20.99 }, category: 'tea' },
  'masala-chai': { name: 'Masala Chai', prices: { '3oz': 20.99 }, category: 'tea' },
  'jasmine': { name: 'Jasmine Tea', prices: { '3oz': 20.99 }, category: 'tea' },
  'moroccan-mint': { name: 'Moroccan Mint Tea', prices: { '3oz': 20.99 }, category: 'tea' },
  'matcha': { name: 'Matcha', prices: { '1oz': 18.99 }, category: 'tea' },

  // Sample Packs
  'sample-bestsellers': { name: 'Best Sellers Sample Pack', prices: { '6pack': 24.99 }, category: 'sample' },
  'sample-single-origin': { name: 'Single Origin Sample Pack', prices: { '6pack': 24.99 }, category: 'sample' },
  'sample-flavored': { name: 'Flavored Coffee Sample Pack', prices: { '6pack': 24.99 }, category: 'sample' },
};

const GRIND_OPTIONS = ['whole_bean', 'standard', 'espresso', 'coarse'];
const SIZE_OPTIONS = ['12oz', '1lb', '2lb', '5lb', '3oz', '1oz', '12pack', '6pack'];

export interface OrderItemInput {
  product: string;      // Product key or name
  quantity: number;
  size?: string;        // '12oz', '1lb', etc.
  grind?: string;       // 'whole_bean', 'standard', 'espresso', 'coarse'
}

export interface CreateOrderInput {
  customerName?: string;
  customerPhone: string;
  customerEmail?: string;
  items: OrderItemInput[];
  shippingMethod?: string;
  shippingAddress?: string;
  notes?: string;
  callSid?: string;
}

/**
 * Generate a unique order number
 */
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `MDC-${timestamp}${random}`;
}

/**
 * Find product by name or key (fuzzy match)
 */
export function findProduct(query: string): { key: string; product: typeof PRODUCTS[string] } | null {
  const normalizedQuery = query.toLowerCase().replace(/[^a-z0-9]/g, '');

  // Direct key match
  if (PRODUCTS[normalizedQuery]) {
    return { key: normalizedQuery, product: PRODUCTS[normalizedQuery] };
  }

  // Search by name
  for (const [key, product] of Object.entries(PRODUCTS)) {
    const normalizedName = product.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normalizedName.includes(normalizedQuery) || normalizedQuery.includes(normalizedName)) {
      return { key, product };
    }
  }

  // Partial match
  for (const [key, product] of Object.entries(PRODUCTS)) {
    if (key.includes(normalizedQuery) || normalizedQuery.includes(key)) {
      return { key, product };
    }
  }

  return null;
}

/**
 * Get price for a product and size
 */
export function getProductPrice(productKey: string, size: string): number | null {
  const product = PRODUCTS[productKey];
  if (!product) return null;

  const normalizedSize = size.toLowerCase().replace(/\s/g, '');
  return product.prices[normalizedSize] || null;
}

/**
 * Create a new order
 */
export async function createOrder(input: CreateOrderInput): Promise<{
  success: boolean;
  order?: any;
  orderNumber?: string;
  total?: number;
  error?: string;
}> {
  try {
    // Validate phone number
    const cleanPhone = input.customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return { success: false, error: 'Invalid phone number' };
    }
    const formattedPhone = cleanPhone.startsWith('1') ? `+${cleanPhone}` : `+1${cleanPhone}`;

    // Process items and calculate totals
    const orderItems: {
      productName: string;
      productSku: string;
      quantity: number;
      size: string;
      grind: string | null;
      unitPrice: number;
      totalPrice: number;
    }[] = [];

    let subtotal = 0;

    for (const item of input.items) {
      const found = findProduct(item.product);
      if (!found) {
        return { success: false, error: `Product not found: ${item.product}` };
      }

      // Determine size (use first available if not specified)
      const availableSizes = Object.keys(found.product.prices);
      const size = item.size
        ? item.size.toLowerCase().replace(/\s/g, '')
        : availableSizes[0];

      const unitPrice = found.product.prices[size];
      if (!unitPrice) {
        return { success: false, error: `Size "${item.size}" not available for ${found.product.name}. Available: ${availableSizes.join(', ')}` };
      }

      // Validate grind (only for coffee, not tea/pods)
      let grind: string | null = null;
      if (found.product.category !== 'tea' && found.product.category !== 'pods' && found.product.category !== 'sample') {
        grind = item.grind || 'whole_bean';
        if (!GRIND_OPTIONS.includes(grind)) {
          grind = 'whole_bean';
        }
      }

      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      orderItems.push({
        productName: found.product.name,
        productSku: found.key,
        quantity: item.quantity,
        size,
        grind,
        unitPrice,
        totalPrice,
      });
    }

    // Calculate tax (8.25% Texas sales tax)
    const tax = Math.round(subtotal * 0.0825 * 100) / 100;

    // Calculate shipping (free over $50, otherwise $5.99)
    const shipping = subtotal >= 50 ? 0 : 5.99;

    const total = Math.round((subtotal + tax + shipping) * 100) / 100;

    // Find call log if callSid provided
    let callLogId: string | null = null;
    if (input.callSid) {
      const callLog = await prisma.callLog.findUnique({ where: { callSid: input.callSid } });
      if (callLog) {
        callLogId = callLog.id;
      }
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        callLogId,
        customerName: input.customerName,
        customerPhone: formattedPhone,
        customerEmail: input.customerEmail,
        subtotal,
        tax,
        shipping,
        total,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: 'phone',
        shippingMethod: input.shippingMethod || 'standard',
        shippingAddress: input.shippingAddress,
        notes: input.notes,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    logger.info({ orderNumber: order.orderNumber, total }, 'Order created');

    return {
      success: true,
      order,
      orderNumber: order.orderNumber,
      total,
    };
  } catch (err: any) {
    logger.error({ err }, 'Failed to create order');
    return { success: false, error: err.message };
  }
}

/**
 * Get order by order number
 */
export async function getOrder(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderNumber: string, status: string) {
  return prisma.order.update({
    where: { orderNumber },
    data: { status },
  });
}

/**
 * Get all products (for listing)
 */
export function getAllProducts() {
  return Object.entries(PRODUCTS).map(([key, product]) => ({
    key,
    ...product,
  }));
}

/**
 * Get products by category
 */
export function getProductsByCategory(category: string) {
  return Object.entries(PRODUCTS)
    .filter(([_, product]) => product.category === category)
    .map(([key, product]) => ({ key, ...product }));
}

export default {
  createOrder,
  getOrder,
  updateOrderStatus,
  findProduct,
  getProductPrice,
  getAllProducts,
  getProductsByCategory,
  GRIND_OPTIONS,
  SIZE_OPTIONS,
};
