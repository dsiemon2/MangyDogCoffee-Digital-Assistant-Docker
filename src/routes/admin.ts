import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../db/prisma.js';

const router = Router();
const basePath = '/MangyDogCoffee';

// Helper function to get branding
async function getBranding() {
  let branding = await prisma.branding.findFirst();
  if (!branding) {
    branding = await prisma.branding.create({
      data: {
        id: 'default',
        primaryColor: '#92400e',
        secondaryColor: '#78350f',
        accentColor: '#b45309'
      }
    });
  }
  return branding;
}

// Auth middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.query.token || req.headers['x-admin-token'];
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(401).render('admin/error', { message: 'Unauthorized' });
  }
  next();
}

// Dashboard
router.get('/admin', requireAuth, async (req, res) => {
  const [
    callCount,
    recentCalls,
    branding
  ] = await Promise.all([
    prisma.callLog.count(),
    prisma.callLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    }),
    getBranding()
  ]);

  res.render('admin/dashboard', {
    token: req.query.token,
    stats: { callCount },
    recentCalls,
    branding,
    basePath
  });
});

// Call Logs
router.get('/admin/calls', requireAuth, async (req, res) => {
  const [calls, branding] = await Promise.all([
    prisma.callLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        messages: true
      }
    }),
    getBranding()
  ]);

  res.render('admin/calls', { token: req.query.token, calls, branding, basePath });
});

// Coffee Sales - query real orders, with sample data fallback
router.get('/admin/coffee-sales', requireAuth, async (req, res) => {
  const branding = await getBranding();

  // Try to get real orders from database
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { items: true }
    });

    // Filter for coffee items (not tea)
    const teaProducts = ['english-breakfast', 'earl-grey', 'masala-chai', 'jasmine', 'moroccan-mint', 'matcha', 'hibiscus', 'hojicha'];
    const coffeeSales = orders.flatMap(order =>
      order.items
        .filter(item => !teaProducts.some(t => item.productSku?.includes(t)))
        .map(item => ({
          id: item.id,
          orderNumber: order.orderNumber,
          product: item.productName,
          size: item.size || 'N/A',
          grind: item.grind || 'N/A',
          quantity: item.quantity,
          price: item.unitPrice,
          total: item.totalPrice,
          customer: order.customerName || 'Anonymous',
          date: order.createdAt,
          status: order.status
        }))
    );

    if (coffeeSales.length > 0) {
      const stats = {
        totalSales: coffeeSales.reduce((sum, s) => sum + s.total, 0),
        totalOrders: new Set(coffeeSales.map(s => s.orderNumber)).size,
        avgOrderValue: coffeeSales.reduce((sum, s) => sum + s.total, 0) / Math.max(coffeeSales.length, 1)
      };
      return res.render('admin/coffee-sales', { token: req.query.token, sales: coffeeSales, stats, branding, basePath });
    }
  } catch (err) {
    // Order table may not exist yet - fall through to sample data
    console.log('Order table not available, using sample data');
  }

  // Sample data fallback
  const coffeeSales = [
    { id: 1, product: 'House Blend', size: '1 LB', grind: 'Standard', quantity: 3, price: 28.99, total: 86.97, customer: 'John Smith', date: new Date('2025-12-10'), status: 'shipped' },
    { id: 2, product: 'Colombia', size: '12oz', grind: 'Whole Bean', quantity: 2, price: 19.99, total: 39.98, customer: 'Sarah Johnson', date: new Date('2025-12-10'), status: 'processing' },
    { id: 3, product: 'Ethiopia Natural', size: '2 LB', grind: 'Espresso', quantity: 1, price: 49.99, total: 49.99, customer: 'Mike Davis', date: new Date('2025-12-09'), status: 'shipped' },
    { id: 4, product: 'French Roast', size: '5 LB', grind: 'Coarse', quantity: 1, price: 89.99, total: 89.99, customer: 'Emily Brown', date: new Date('2025-12-09'), status: 'delivered' },
    { id: 5, product: 'Bali Blue', size: '1 LB', grind: 'Standard', quantity: 2, price: 28.99, total: 57.98, customer: 'Chris Wilson', date: new Date('2025-12-08'), status: 'delivered' },
    { id: 6, product: 'Best Sellers Sample Pack', size: '6-count 2oz', grind: 'Standard', quantity: 1, price: 24.99, total: 24.99, customer: 'Amanda Lee', date: new Date('2025-12-08'), status: 'shipped' },
    { id: 7, product: 'Max Caf Blend', size: '12oz', grind: 'Standard', quantity: 4, price: 19.99, total: 79.96, customer: 'David Martinez', date: new Date('2025-12-07'), status: 'delivered' },
    { id: 8, product: 'Peru Decaf', size: '1 LB', grind: 'Whole Bean', quantity: 2, price: 28.99, total: 57.98, customer: 'Lisa Anderson', date: new Date('2025-12-07'), status: 'delivered' }
  ];

  const stats = {
    totalSales: coffeeSales.reduce((sum, s) => sum + s.total, 0),
    totalOrders: coffeeSales.length,
    avgOrderValue: coffeeSales.reduce((sum, s) => sum + s.total, 0) / coffeeSales.length
  };

  res.render('admin/coffee-sales', { token: req.query.token, sales: coffeeSales, stats, branding, basePath });
});

// Tea Sales - query real orders, with sample data fallback
router.get('/admin/tea-sales', requireAuth, async (req, res) => {
  const branding = await getBranding();

  // Try to get real orders from database
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: { items: true }
    });

    // Filter for tea items only
    const teaProducts = ['english-breakfast', 'earl-grey', 'masala-chai', 'jasmine', 'moroccan-mint', 'matcha', 'hibiscus', 'hojicha', 'tea'];
    const teaSales = orders.flatMap(order =>
      order.items
        .filter(item => teaProducts.some(t => item.productSku?.toLowerCase().includes(t) || item.productName?.toLowerCase().includes('tea')))
        .map(item => ({
          id: item.id,
          orderNumber: order.orderNumber,
          product: item.productName,
          size: item.size || '3oz tin',
          quantity: item.quantity,
          price: item.unitPrice,
          total: item.totalPrice,
          customer: order.customerName || 'Anonymous',
          date: order.createdAt,
          status: order.status
        }))
    );

    if (teaSales.length > 0) {
      const stats = {
        totalSales: teaSales.reduce((sum, s) => sum + s.total, 0),
        totalOrders: new Set(teaSales.map(s => s.orderNumber)).size,
        avgOrderValue: teaSales.reduce((sum, s) => sum + s.total, 0) / Math.max(teaSales.length, 1)
      };
      return res.render('admin/tea-sales', { token: req.query.token, sales: teaSales, stats, branding, basePath });
    }
  } catch (err) {
    // Order table may not exist yet - fall through to sample data
    console.log('Order table not available, using sample data');
  }

  // Sample data fallback
  const teaSales = [
    { id: 1, product: 'Masala Chai', size: '3oz tin', quantity: 2, price: 20.99, total: 41.98, customer: 'Jennifer White', date: new Date('2025-12-10'), status: 'shipped' },
    { id: 2, product: 'Matcha', size: '1oz', quantity: 1, price: 18.99, total: 18.99, customer: 'Robert Clark', date: new Date('2025-12-10'), status: 'processing' },
    { id: 3, product: 'Earl Grey Tea', size: '3oz tin', quantity: 3, price: 20.99, total: 62.97, customer: 'Nancy Taylor', date: new Date('2025-12-09'), status: 'shipped' },
    { id: 4, product: 'English Breakfast Tea', size: '3oz tin', quantity: 2, price: 20.99, total: 41.98, customer: 'James Robinson', date: new Date('2025-12-09'), status: 'delivered' },
    { id: 5, product: 'Moroccan Mint Tea', size: '3oz tin', quantity: 1, price: 20.99, total: 20.99, customer: 'Patricia Hall', date: new Date('2025-12-08'), status: 'delivered' },
    { id: 6, product: 'Jasmine Tea', size: '3oz tin', quantity: 2, price: 20.99, total: 41.98, customer: 'Linda King', date: new Date('2025-12-07'), status: 'delivered' }
  ];

  const stats = {
    totalSales: teaSales.reduce((sum, s) => sum + s.total, 0),
    totalOrders: teaSales.length,
    avgOrderValue: teaSales.reduce((sum, s) => sum + s.total, 0) / teaSales.length
  };

  res.render('admin/tea-sales', { token: req.query.token, sales: teaSales, stats, branding, basePath });
});




// Knowledge Base
router.get('/admin/kb', requireAuth, async (req, res) => {
  const [docs, branding] = await Promise.all([
    prisma.knowledgeDoc.findMany({
      orderBy: { createdAt: 'desc' }
    }),
    getBranding()
  ]);

  res.render('admin/kb', { token: req.query.token, docs, branding, basePath });
});

// Products Page - Full product catalog from CSV
router.get('/admin/products', requireAuth, async (req, res) => {
  // Complete product data from CSV - unique products with all variants
  const products = [
    // BLENDS
    { handle: 'asian-plateau-blend', title: 'Asian Plateau Blend', type: 'blend', vendor: 'Mangy Dog Coffee', description: 'A medium roast containing blended coffees of Southeast Asia offering herbal flavor notes and a heavy body.', grinds: ['Espresso', 'Standard', 'Whole Bean'], sizes: ['12oz', '1 LB', '2 LB', '5 LB'], prices: { '12oz': 19.99, '1 LB': 28.99, '2 LB': 49.99, '5 LB': 89.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/LABEL2_12oz_on_bag_80c90f77-4b77-4067-b85b-d70cfc355993.jpg' },
    { handle: 'african-kahawa-blend', title: 'African Kahawa Blend', type: 'blend', vendor: 'Mangy Dog Coffee', description: 'A very complex medium-dark roast of bright full flavor African grown coffees. Hints of toffee, caramel, chocolate.', grinds: ['Espresso', 'Standard', 'Whole Bean'], sizes: ['12oz', '1 LB', '2 LB', '5 LB'], prices: { '12oz': 19.99, '1 LB': 28.99, '2 LB': 49.99, '5 LB': 89.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/LABEL2_12oz_on_bag_eb5be362-9a51-4942-8965-31eb2b37645a.jpg' },
    { handle: 'house-blend', title: 'House Blend', type: 'blend', vendor: 'Mangy Dog Coffee', description: 'A medium roast blend of select coffees from Central and South America. Smooth, clean and consistent.', grinds: ['Espresso', 'Standard', 'Whole Bean'], sizes: ['12oz', '1 LB', '2 LB', '5 LB'], prices: { '12oz': 19.99, '1 LB': 28.99, '2 LB': 49.99, '5 LB': 89.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/LABEL2_12oz_on_bag_93512972-dcdd-498a-aab2-fd5f32bd991c.jpg' },
    { handle: 'breakfast-blend', title: 'Breakfast Blend', type: 'blend', vendor: 'Mangy Dog Coffee', description: 'A lightly roasted blend of South American coffees perfect as an early sunrise roast.', grinds: ['Espresso', 'Standard', 'Whole Bean'], sizes: ['12oz', '1 LB', '2 LB', '5 LB'], prices: { '12oz': 19.99, '1 LB': 28.99, '2 LB': 49.99, '5 LB': 89.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/LABEL2_12oz_on_bag_b3cdc89d-3563-47f5-8518-faafd0ae64a8.jpg' },
    { handle: 'gourmet-donut-shop', title: 'Gourmet Donut Shop', type: 'blend', vendor: 'Mangy Dog Coffee', description: 'A light-medium roast with tasting notes of cocoa, caramel, toffee and mild fruits.', grinds: ['Espresso', 'Standard', 'Whole Bean'], sizes: ['12oz', '1 LB', '2 LB', '5 LB'], prices: { '12oz': 19.99, '1 LB': 28.99, '2 LB': 49.99, '5 LB': 89.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/LABEL2_12oz_on_bag_a9ccaad1-ad56-4fde-bef8-f6330bf79eb4.jpg' },
    { handle: 'french-roast', title: 'French Roast', type: 'blend', vendor: 'Mangy Dog Coffee', description: 'A deep dark roast offering a bold, rich coffee flavor with low acidity.', grinds: ['Espresso', 'Standard', 'Whole Bean'], sizes: ['12oz', '1 LB', '2 LB', '5 LB'], prices: { '12oz': 19.99, '1 LB': 28.99, '2 LB': 49.99, '5 LB': 89.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/LABEL2_12oz_on_bag_ab45b4a7-01ae-4be2-8ae2-e208e7d65583.jpg' },
    { handle: 'italian-roast', title: 'Italian Roast', type: 'blend', vendor: 'Mangy Dog Coffee', description: 'An extra dark oily roast for deep, heavy coffee flavor. Acidity is non-existent.', grinds: ['Espresso', 'Standard', 'Whole Bean'], sizes: ['12oz', '1 LB', '2 LB', '5 LB'], prices: { '12oz': 19.99, '1 LB': 28.99, '2 LB': 49.99, '5 LB': 89.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/LABEL2_12oz_on_bag_4f14ffd4-13ef-42df-a619-796fe474f5e0.jpg' },
    { handle: 'holiday-blend', title: 'Holiday Blend', type: 'blend', vendor: 'Mangy Dog Coffee', description: 'Festive holiday blend from Brazil, Peru and India.', grinds: ['Coarse', 'Espresso', 'Standard', 'Whole Bean'], sizes: ['12oz', '1 LB', '2 LB', '5 LB', '12 LB'], prices: { '12oz': 19.99, '1 LB': 28.99, '2 LB': 49.99, '5 LB': 89.99, '12 LB': 189.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/label2_on_bag_03f58e76-d513-4327-b8ff-03c6b880aa17.jpg' },
    { handle: 'cold-brew-coffee', title: 'Cold Brew Coffee', type: 'blend', vendor: 'Mangy Dog Coffee', description: 'Medium with smooth chocolate, toffee and floral tones. Great for cold brew or nitro.', grinds: ['Coarse', 'Espresso', 'Standard', 'Whole Bean'], sizes: ['12oz', '1 LB', '2 LB', '5 LB', '12 LB'], prices: { '12oz': 19.99, '1 LB': 28.99, '2 LB': 49.99, '5 LB': 89.99, '12 LB': 189.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/label2_on_bag_01ceb848-4e91-4ccb-bdcc-cb5a9c742df1.jpg' },
    { handle: 'whiskey-barrel-aged', title: 'Whiskey Barrel Aged', type: 'blend', vendor: 'Mangy Dog Coffee', description: 'Single origin Guatemala aged 30 days in a Bourbon barrel and roasted to order.', grinds: ['Coarse', 'Espresso', 'Standard', 'Whole Bean'], sizes: ['12oz', '1 LB', '2 LB', '5 LB', '12 LB'], prices: { '12oz': 19.99, '1 LB': 28.99, '2 LB': 49.99, '5 LB': 89.99, '12 LB': 189.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/label2_on_bag_a1ff5ebf-7088-4ccc-8380-ce812067e6a1.jpg' },
    { handle: 'max-caf-blend', title: 'Max Caf Blend', type: 'blend', vendor: 'Mangy Dog Coffee', description: 'High caffeine blend of coffee. Tanzania and India Robusta.', grinds: ['Coarse', 'Espresso', 'Standard', 'Whole Bean'], sizes: ['12oz', '1 LB', '2 LB', '5 LB', '12 LB'], prices: { '12oz': 19.99, '1 LB': 28.99, '2 LB': 49.99, '5 LB': 89.99, '12 LB': 189.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/label2_on_bag_fd439a8f-491e-4ab7-ab2a-22396c67437f.jpg' },
    { handle: 'kopi-safari', title: 'Kopi Safari', type: 'blend', vendor: 'Mangy Dog Coffee', description: 'Post roast blend. Lively and grounding, a perfect harmony of brightness and depth.', grinds: ['Coarse', 'Espresso', 'Standard', 'Whole Bean'], sizes: ['12oz', '1 LB', '2 LB', '5 LB'], prices: { '12oz': 19.99, '1 LB': 28.99, '2 LB': 49.99, '5 LB': 89.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/label2_on_bag_9c2a1c35-e698-4781-9e36-a459e234cb2a.jpg' },
    { handle: 'instant-coffee', title: 'Instant Coffee', type: 'blend', vendor: 'Mangy Dog Coffee', description: '30 servings of instant coffee in a resealable pouch.', grinds: ['Standard'], sizes: ['3oz'], prices: { '3oz': 20.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/label2_on_bag_d2eb572f-945f-4565-8856-2e57c3f38f3c.jpg' },
    { handle: 'coffee-with-mushrooms-dark-roast', title: 'Coffee with Mushrooms Dark Roast', type: 'blend', vendor: 'Mangy Dog Coffee', description: 'Specialty-grade coffee infused with Lion\'s Mane, Cordyceps, and Reishi mushrooms.', grinds: ['Standard'], sizes: ['8oz'], prices: { '8oz': 20.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/label2_on_bag_1d261d11-292e-42d8-a206-34f36c96b6f7.jpg' },
    { handle: 'coffee-with-mushrooms-medium-roast', title: 'Coffee with Mushrooms Medium Roast', type: 'blend', vendor: 'Mangy Dog Coffee', description: 'Specialty-grade coffee infused with Lion\'s Mane, Cordyceps, and Reishi mushrooms.', grinds: ['Standard'], sizes: ['8oz'], prices: { '8oz': 20.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/label2_on_bag_e2097472-e094-4b51-9ac9-d1e7d29d49f5.jpg' },
    // SINGLE ORIGIN
    { handle: 'bali-blue', title: 'Bali Blue', type: 'single origin', vendor: 'Mangy Dog Coffee', description: 'Med-dark roast. Dark chocolate, molasses, brown sugar. From Kintamani, Bali.', grinds: ['Coarse', 'Espresso', 'Standard', 'Whole Bean'], sizes: ['12oz', '1 LB', '2 LB', '5 LB', '12 LB'], prices: { '12oz': 19.99, '1 LB': 28.99, '2 LB': 49.99, '5 LB': 89.99, '12 LB': 189.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/label2_on_bag_40c5908d-566b-4f3e-b8c9-f6a07a73025f.jpg' },
    { handle: 'brazil-santos', title: 'Brazil Santos', type: 'single origin', vendor: 'Mangy Dog Coffee', description: 'Medium roast. Elegant, smooth cup with cocoa notes.', grinds: ['Coarse', 'Espresso', 'Standard', 'Whole Bean'], sizes: ['12oz', '1 LB', '2 LB', '5 LB', '12 LB'], prices: { '12oz': 19.99, '1 LB': 28.99, '2 LB': 49.99, '5 LB': 89.99, '12 LB': 189.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/label2_on_bag_483d5708-c42e-43ff-b236-7ce40a262519.jpg' },
    { handle: 'colombia', title: 'Colombia', type: 'single origin', vendor: 'Mangy Dog Coffee', description: 'Medium roast. Dried orange, berry, chocolate. From Medellin.', grinds: ['Coarse', 'Espresso', 'Standard', 'Whole Bean'], sizes: ['12oz', '1 LB', '2 LB', '5 LB', '12 LB'], prices: { '12oz': 19.99, '1 LB': 28.99, '2 LB': 49.99, '5 LB': 89.99, '12 LB': 189.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/label2_on_bag_0c9f3ffc-2b4c-4c77-871f-00af5ae4f2bc.jpg' },
    { handle: 'costa-rica', title: 'Costa Rica', type: 'single origin', vendor: 'Mangy Dog Coffee', description: 'Medium roast. Sweet apple, raisin, honey. From Alajuela.', grinds: ['Coarse', 'Espresso', 'Standard', 'Whole Bean'], sizes: ['12oz', '1 LB', '2 LB', '5 LB', '12 LB'], prices: { '12oz': 19.99, '1 LB': 28.99, '2 LB': 49.99, '5 LB': 89.99, '12 LB': 189.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/label2_on_bag_fb4d822b-d427-4f8e-8755-5c74bd7ab45b.jpg' },
    { handle: 'ethiopia-natural', title: 'Ethiopia Natural', type: 'single origin', vendor: 'Mangy Dog Coffee', description: 'Med-light roast. Milk chocolate, fruity, caramel. From Sidama Zone.', grinds: ['Coarse', 'Espresso', 'Standard', 'Whole Bean'], sizes: ['12oz', '1 LB', '2 LB', '5 LB', '12 LB'], prices: { '12oz': 19.99, '1 LB': 28.99, '2 LB': 49.99, '5 LB': 89.99, '12 LB': 189.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/label2_on_bag_4c7f1281-cbb7-464a-bfe1-5088c9a71425.jpg' },
    { handle: 'guatemala', title: 'Guatemala', type: 'single origin', vendor: 'Mangy Dog Coffee', description: 'Medium roast. Dark chocolate, bright fruit, butterscotch. From Antigua.', grinds: ['Coarse', 'Espresso', 'Standard', 'Whole Bean'], sizes: ['12oz', '1 LB', '2 LB', '5 LB', '12 LB'], prices: { '12oz': 19.99, '1 LB': 28.99, '2 LB': 49.99, '5 LB': 89.99, '12 LB': 189.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/label2_on_bag_6c1d38db-05c9-471b-9d5e-94ac057f1e39.jpg' },
    { handle: 'honduras', title: 'Honduras', type: 'single origin', vendor: 'Mangy Dog Coffee', description: 'Medium-dark roast. Caramel, spice, brown sugar. From Marcala.', grinds: ['Coarse', 'Espresso', 'Standard', 'Whole Bean'], sizes: ['12oz', '1 LB', '2 LB', '5 LB', '12 LB'], prices: { '12oz': 19.99, '1 LB': 28.99, '2 LB': 49.99, '5 LB': 89.99, '12 LB': 189.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/label2_on_bag_09885778-f7e0-4ff3-bfe3-2573ecb7d200.jpg' },
    { handle: 'mexico', title: 'Mexico', type: 'single origin', vendor: 'Mangy Dog Coffee', description: 'Medium roast. Chocolate, cinnamon, green apple. From Chiapas and Oaxaca.', grinds: ['Coarse', 'Espresso', 'Standard', 'Whole Bean'], sizes: ['12oz', '1 LB', '2 LB', '5 LB', '12 LB'], prices: { '12oz': 19.99, '1 LB': 28.99, '2 LB': 49.99, '5 LB': 89.99, '12 LB': 189.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/label2_on_bag_7fec6c67-9bfb-4edc-b808-6a7d968c073b.jpg' },
    { handle: 'nicaragua', title: 'Nicaragua', type: 'single origin', vendor: 'Mangy Dog Coffee', description: 'Medium roast. Cocoa, floral and citrus tones. From Matagalpa.', grinds: ['Coarse', 'Espresso', 'Standard', 'Whole Bean'], sizes: ['12oz', '1 LB', '2 LB', '5 LB', '12 LB'], prices: { '12oz': 19.99, '1 LB': 28.99, '2 LB': 49.99, '5 LB': 89.99, '12 LB': 189.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/label2_on_bag_64816cf6-da62-4827-8c24-62320fac5c6b.jpg' },
    { handle: 'papua-new-guinea', title: 'Papua New Guinea', type: 'single origin', vendor: 'Mangy Dog Coffee', description: 'Medium roast. Caramel, honey and fruit. From Chimbu Province.', grinds: ['Coarse', 'Espresso', 'Standard', 'Whole Bean'], sizes: ['12oz', '1 LB', '2 LB', '5 LB', '12 LB'], prices: { '12oz': 19.99, '1 LB': 28.99, '2 LB': 49.99, '5 LB': 89.99, '12 LB': 189.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/label2_on_bag_afe2501d-6972-47be-b3d7-01034ff899e1.jpg' },
    { handle: 'peru', title: 'Peru', type: 'single origin', vendor: 'Mangy Dog Coffee', description: 'Medium roast. Salted caramel, silky sweet, citrus. From Piura, Amazonas.', grinds: ['Coarse', 'Espresso', 'Standard', 'Whole Bean'], sizes: ['12oz', '1 LB', '2 LB', '5 LB', '12 LB'], prices: { '12oz': 19.99, '1 LB': 28.99, '2 LB': 49.99, '5 LB': 89.99, '12 LB': 189.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/label2_on_bag_e22b565f-b897-4d76-acfb-1503f9f313d2.jpg' },
    { handle: 'peru-decaf', title: 'Peru Decaf', type: 'single origin', vendor: 'Mangy Dog Coffee', description: 'Medium roast decaf. Caramel, smooth, citrus. Swiss Water Process.', grinds: ['Coarse', 'Espresso', 'Standard', 'Whole Bean'], sizes: ['12oz', '1 LB', '2 LB', '5 LB', '12 Pack', '12 LB'], prices: { '12oz': 19.99, '1 LB': 28.99, '2 LB': 49.99, '5 LB': 89.99, '12 Pack': 19.99, '12 LB': 189.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/label2_on_bag_b0d6eeeb-c79a-482d-9709-d53c416c4b16.jpg' },
    { handle: 'tanzania', title: 'Tanzania', type: 'single origin', vendor: 'Mangy Dog Coffee', description: 'Medium-light roast. Pear, floral, jasmine, strawberry. From Mbeya Region.', grinds: ['Coarse', 'Espresso', 'Standard', 'Whole Bean'], sizes: ['12oz', '1 LB', '2 LB', '5 LB', '12 LB'], prices: { '12oz': 19.99, '1 LB': 28.99, '2 LB': 49.99, '5 LB': 89.99, '12 LB': 189.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/label2_on_bag_2ff38551-bedb-4bbf-ab6c-5f45df7d9351.jpg' },
    { handle: 'sumatra', title: 'Sumatra', type: 'single origin', vendor: 'Mangy Dog Coffee', description: 'Medium roast. Dark Chocolate, Dried Fruit, Earthy. From Aceh, Takengon.', grinds: ['Coarse', 'Espresso', 'Standard', 'Whole Bean'], sizes: ['12oz', '1 LB', '2 LB', '5 LB'], prices: { '12oz': 19.99, '1 LB': 28.99, '2 LB': 49.99, '5 LB': 89.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/label2_on_bag_0c5cbd38-5487-4695-aebd-b7dcd8f726e4.jpg' },
    { handle: 'kenya', title: 'Kenya', type: 'single origin', vendor: 'Mangy Dog Coffee', description: 'Medium roast. Bright Acidity, Orange, Lemon, Floral. From Nyeri County.', grinds: ['Coarse', 'Espresso', 'Standard', 'Whole Bean'], sizes: ['12oz', '1 LB', '2 LB', '5 LB'], prices: { '12oz': 19.99, '1 LB': 28.99, '2 LB': 49.99, '5 LB': 89.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/label2_on_bag_ad8e747b-b6df-4cd0-9b1a-04b7e2acab69.jpg' },
    { handle: 'uganda', title: 'Uganda', type: 'single origin', vendor: 'Mangy Dog Coffee', description: 'Medium roast. Floral, Chocolate, Dark Fruits. From Kapchorwa District.', grinds: ['Coarse', 'Espresso', 'Standard', 'Whole Bean'], sizes: ['12oz', '1 LB', '2 LB', '5 LB'], prices: { '12oz': 19.99, '1 LB': 28.99, '2 LB': 49.99, '5 LB': 89.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/label2_on_bag_bbdb25f3-7f07-418b-8a28-0cb6a21e0c8f.jpg' },
    // COFFEE PODS
    { handle: 'mexico-coffee-pods', title: 'Mexico Coffee Pods', type: 'pods', vendor: 'Mangy Dog Coffee', description: 'Single serve pods. Lemon, Brown Sugar, Dark Chocolate. From Chiapas.', grinds: ['Standard'], sizes: ['12 Pack'], prices: { '12 Pack': 19.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/label2_on_bag_8515fbb3-8758-4639-b4d9-a36ce3841d6c.jpg' },
    { handle: 'peru-coffee-pods', title: 'Peru Coffee Pods', type: 'pods', vendor: 'Mangy Dog Coffee', description: 'Single serve pods. Salted caramel, silky sweet, citrus.', grinds: ['Standard'], sizes: ['12 Pack'], prices: { '12 Pack': 19.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/label2_on_bag_2151a2a9-d37e-4c9b-ae5d-b4bce7a19ea0.jpg' },
    { handle: 'bali-coffee-pods', title: 'Bali Coffee Pods', type: 'pods', vendor: 'Mangy Dog Coffee', description: 'Single serve pods. Dark chocolate, molasses, brown sugar.', grinds: ['Standard'], sizes: ['12 Pack'], prices: { '12 Pack': 19.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/label2_on_bag_7efe19e8-7292-4c2a-bf75-2006e12aa1ed.jpg' },
    // SAMPLE PACKS
    { handle: 'best-sellers-sample-pack', title: 'Best Sellers Sample Pack', type: 'sample pack', vendor: 'Mangy Dog Coffee', description: '6 sample packs: 6Bean, Cowboy, Breakfast, Peru, Mexico, Bali.', grinds: ['Standard'], sizes: ['6-count 2oz'], prices: { '6-count 2oz': 24.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/label2_on_bag_6445cf66-7b5c-4106-be1b-9bb9cb12c3c1.jpg' },
    { handle: 'flavored-coffees-sample-pack', title: 'Flavored Coffees Sample Pack', type: 'sample pack', vendor: 'Mangy Dog Coffee', description: '6 flavored coffee samples: French Vanilla, Hazelnut, Cinnabun, Caramel, Mocha, Cinnamon Hazelnut.', grinds: ['Standard'], sizes: ['6-count 2oz'], prices: { '6-count 2oz': 24.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/label2_on_bag_85cdff22-2673-49cc-8bf5-5f54064a8c9b.jpg' },
    { handle: 'single-origin-favorites-sample-pack', title: 'Single Origin Favorites Sample Pack', type: 'sample pack', vendor: 'Mangy Dog Coffee', description: '6 single origin samples: Brazil Santos, Colombia, Costa Rica, Ethiopia, Honduras, Tanzania.', grinds: ['Standard'], sizes: ['6-count 2oz'], prices: { '6-count 2oz': 24.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/label2_on_bag_c95043af-6149-4942-ae38-461c4be4f2f7.jpg' },
    // TEAS
    { handle: 'jasmine-tea', title: 'Jasmine Tea', type: 'tea', vendor: 'Mangy Dog Coffee', description: 'Fine blend of jasmine blossoms and green tea. Medium-bodied, sweet, smooth, silky.', grinds: ['Loose leaf'], sizes: ['3oz'], prices: { '3oz': 20.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/kraft_blank_final_latest.jpg' },
    { handle: 'masala-chai', title: 'Masala Chai', type: 'tea', vendor: 'Mangy Dog Coffee', description: 'Bold and spicy Indian Masala Chai. Full-bodied, aromatic, and intense.', grinds: ['Loose leaf'], sizes: ['3oz'], prices: { '3oz': 20.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/kraft_blank_final_latest_6d3c99e9-4c00-40d1-b675-b320c16e2044.jpg' },
    { handle: 'english-breakfast', title: 'English Breakfast Tea', type: 'tea', vendor: 'Mangy Dog Coffee', description: 'Classic breakfast tea. Strong enough for milk and sugar. Blend of African and Indian Tea.', grinds: ['Loose leaf'], sizes: ['3oz'], prices: { '3oz': 20.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/kraft_blank_final_latest_249a88da-b936-4068-99e8-83271d0d74f9.jpg' },
    { handle: 'peach-paradise', title: 'Peach Paradise Tea', type: 'tea', vendor: 'Mangy Dog Coffee', description: 'Herbal blend. Fruity peach, sour cranberry and smooth notes of rose.', grinds: ['Loose leaf'], sizes: ['3oz'], prices: { '3oz': 20.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/kraft_blank_final_latest_6be92efa-04da-43d7-818d-43081f3ff489.jpg' },
    { handle: 'mango-treat', title: 'Mango Treat Tea', type: 'tea', vendor: 'Mangy Dog Coffee', description: 'Sweet, smooth, and summery. Wonderful hot and incredible iced.', grinds: ['Loose leaf'], sizes: ['3oz'], prices: { '3oz': 20.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/kraft_blank_final_latest_e90b7fdf-353b-4af5-9736-523e73898a60.jpg' },
    { handle: 'apple-cider-rooibos', title: 'Apple Cider Rooibos Tea', type: 'tea', vendor: 'Mangy Dog Coffee', description: 'Herbal blend. Spicy, sweet, naturally caffeine free. Red Bush Tea from South Africa.', grinds: ['Loose leaf'], sizes: ['3oz'], prices: { '3oz': 20.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/kraft_blank_final_latest_d2706573-a97f-408a-bcbc-e6eed922efe0.jpg' },
    { handle: 'hibiscus-berry', title: 'Hibiscus Berry Tea', type: 'tea', vendor: 'Mangy Dog Coffee', description: 'Organic herbal tea. Blueberry, Currant. Low Astringency, High Body.', grinds: ['Loose leaf'], sizes: ['3oz'], prices: { '3oz': 20.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/kraft_blank_final_latest_a25dfc8f-b432-47bc-8ccc-8fb723096170.jpg' },
    { handle: 'earl-grey', title: 'Earl Grey Tea', type: 'tea', vendor: 'Mangy Dog Coffee', description: 'Timeless blend. Ceylon black tea with cornflowers and bergamot oil.', grinds: ['Loose leaf'], sizes: ['3oz'], prices: { '3oz': 20.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/kraft_blank_final_latest_a3a6cf81-16f8-42ab-9734-96110ba0f41c.jpg' },
    { handle: 'moroccan-mint', title: 'Moroccan Mint Tea', type: 'tea', vendor: 'Mangy Dog Coffee', description: 'Green tea meets fresh mint. Smooth, vibrant, refreshing hot and iced.', grinds: ['Loose leaf'], sizes: ['3oz'], prices: { '3oz': 20.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/kraft_blank_final_latest_d852411e-123c-4786-90a8-87cf48027bc5.jpg' },
    { handle: 'hojicha', title: 'Hojicha Tea', type: 'tea', vendor: 'Mangy Dog Coffee', description: 'Roasted green tea powder. Toasted cereal notes and balanced umami.', grinds: ['Loose leaf'], sizes: ['3oz'], prices: { '3oz': 20.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/kraft_blank_final_latest_076e730b-49d6-4770-bdad-bb429ba06ec9.jpg' },
    { handle: 'matcha', title: 'Matcha Tea', type: 'tea', vendor: 'Mangy Dog Coffee', description: 'Refined matcha for traditional preparation and mindful daily rituals.', grinds: ['Loose leaf'], sizes: ['1oz'], prices: { '1oz': 18.99 }, status: 'active', image: 'https://cdn.shopify.com/s/files/1/0687/4116/9339/files/kraft_blank_final_latest_4613a222-de79-4df1-9125-43cbacf430ad.jpg' }
  ];

  // Get filter from query
  const typeFilter = req.query.type as string || 'all';
  const filteredProducts = typeFilter === 'all'
    ? products
    : products.filter(p => p.type === typeFilter);

  // Get unique types for filter dropdown
  const types = [...new Set(products.map(p => p.type))];

  // Calculate stats
  const stats = {
    total: products.length,
    blends: products.filter(p => p.type === 'blend').length,
    singleOrigin: products.filter(p => p.type === 'single origin').length,
    teas: products.filter(p => p.type === 'tea').length,
    pods: products.filter(p => p.type === 'pods').length,
    samplePacks: products.filter(p => p.type === 'sample pack').length
  };

  const branding = await getBranding();
  res.render('admin/products', {
    token: req.query.token,
    products: filteredProducts,
    allProducts: products,
    types,
    typeFilter,
    stats,
    branding,
    basePath
  });
});



// About
router.get('/admin/about', requireAuth, async (req, res) => {
  const branding = await getBranding();
  res.render('admin/about', { token: req.query.token, branding, basePath });
});

// ============================================
// HELP & SUPPORT
// ============================================

router.get('/admin/help', requireAuth, async (req, res) => {
  const branding = await getBranding();
  res.render('admin/help', { token: req.query.token, branding, basePath });
});

// ============================================
// ACCOUNT
// ============================================

router.get('/admin/account', requireAuth, async (req, res) => {
  // Get business config for organization info
  const config = await prisma.businessConfig.findFirst();
  const branding = await getBranding();

  // Calculate usage stats (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [totalCalls, smsSent] = await Promise.all([
    prisma.callLog.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    0 // SMS count would come from SMS logs if implemented
  ]);

  // Calculate approximate minutes from calls
  const calls = await prisma.callLog.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { duration: true }
  });
  const totalMinutes = Math.round(calls.reduce((sum, c) => sum + (c.duration || 0), 0) / 60);

  res.render('admin/account', {
    token: req.query.token,
    account: {
      organizationName: config?.organizationName || 'Mangy Dog Coffee',
      email: 'admin@mangydogcoffee.com',
      phone: '',
      plan: 'starter',
      planPrice: 0,
      paymentMethod: null,
      apiToken: process.env.ADMIN_TOKEN || 'sk-xxxx-xxxx-xxxx-xxxx'
    },
    usage: {
      totalCalls,
      callLimit: 500,
      totalMinutes,
      minuteLimit: 1000,
      smsSent,
      smsLimit: 200,
      tokensUsed: 0,
      tokenLimit: 100000
    },
    billing: [],
    branding,
    basePath
  });
});

router.post('/admin/account/profile', requireAuth, async (req, res) => {
  const { organizationName, email, phone } = req.body;

  let config = await prisma.businessConfig.findFirst();
  if (config) {
    await prisma.businessConfig.update({
      where: { id: config.id },
      data: { organizationName }
    });
  }

  res.json({ success: true });
});

router.post('/admin/account/password', requireAuth, async (req, res) => {
  // Password change would be implemented with proper auth system
  res.json({ success: true });
});

router.post('/admin/account/regenerate-token', requireAuth, async (req, res) => {
  // Token regeneration would be implemented with proper auth system
  const newToken = 'sk-' + Math.random().toString(36).substring(2, 10) + '-' +
                   Math.random().toString(36).substring(2, 10);
  res.json({ success: true, newToken });
});

// Analytics
router.get('/admin/analytics', requireAuth, async (req, res) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalCalls,
    completedCalls,
    kbQueries,
    transfers,
    topIntents
  ] = await Promise.all([
    prisma.callLog.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.callLog.count({
      where: { createdAt: { gte: thirtyDaysAgo }, outcome: 'completed' }
    }),
    prisma.citationsLog.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.callLog.count({
      where: { createdAt: { gte: thirtyDaysAgo }, outcome: 'transferred' }
    }),
    prisma.intentLog.groupBy({
      by: ['intent'],
      where: { createdAt: { gte: thirtyDaysAgo } },
      _count: true,
      orderBy: { _count: { intent: 'desc' } },
      take: 10
    })
  ]);

  // Use sample data for demonstration if no real data exists
  const useSampleData = totalCalls === 0;

  const sampleStats = {
    totalCalls: 147,
    completedCalls: 128,
    kbQueries: 312,
    transfers: 19
  };

  const sampleIntents = [
    { intent: 'product_inquiry', _count: 89 },
    { intent: 'order_status', _count: 67 },
    { intent: 'pricing_question', _count: 54 },
    { intent: 'store_hours', _count: 41 },
    { intent: 'coffee_recommendation', _count: 38 },
    { intent: 'shipping_info', _count: 29 },
    { intent: 'wholesale_inquiry', _count: 22 },
    { intent: 'return_policy', _count: 18 },
    { intent: 'subscription_info', _count: 15 },
    { intent: 'gift_card_inquiry', _count: 12 }
  ];

  const branding = await getBranding();
  res.render('admin/analytics', {
    token: req.query.token,
    stats: useSampleData ? sampleStats : {
      totalCalls,
      completedCalls,
      kbQueries,
      transfers
    },
    topIntents: useSampleData ? sampleIntents : topIntents,
    useSampleData,
    branding,
    basePath
  });
});

// Settings
router.get('/admin/settings', requireAuth, async (req, res) => {
  // Get all settings data
  const [storeInfo, branding, paymentSettings] = await Promise.all([
    prisma.storeInfo.findFirst(),
    getBranding(),
    prisma.paymentSettings.findFirst()
  ]);

  // Create combined settings object for the view
  const settings = {
    // Store Info
    businessName: storeInfo?.businessName || 'Mangy Dog Coffee',
    tagline: storeInfo?.tagline || '',
    description: storeInfo?.description || '',
    address: storeInfo?.address || '',
    phone: storeInfo?.phone || '',
    email: storeInfo?.email || '',
    website: storeInfo?.website || '',
    businessHours: storeInfo?.businessHours || '',
    timezone: storeInfo?.timezone || 'America/New_York',
    // Branding
    logoUrl: branding?.logoUrl || '',
    faviconUrl: branding?.faviconUrl || '',
    primaryColor: branding?.primaryColor || '#92400e',
    secondaryColor: branding?.secondaryColor || '#78350f',
    accentColor: branding?.accentColor || '#b45309',
    headingFont: branding?.headingFont || 'Inter',
    bodyFont: branding?.bodyFont || 'Inter',
    // Payment Settings
    paymentsEnabled: paymentSettings?.enabled || false,
    stripeEnabled: paymentSettings?.stripeEnabled || false,
    stripePublishableKey: paymentSettings?.stripePublishableKey || '',
    stripeTestMode: paymentSettings?.stripeTestMode || true,
    paypalEnabled: paymentSettings?.paypalEnabled || false,
    paypalClientId: paymentSettings?.paypalClientId || '',
    paypalSandbox: paymentSettings?.paypalSandbox || true,
    squareEnabled: paymentSettings?.squareEnabled || false,
    squareAppId: paymentSettings?.squareAppId || '',
    squareSandbox: paymentSettings?.squareSandbox || true
  };

  res.render('admin/settings', { token: req.query.token, settings, branding, basePath });
});

router.post('/admin/settings', requireAuth, async (req, res) => {
  const data = req.body;

  // Update StoreInfo
  await prisma.storeInfo.upsert({
    where: { id: 'default' },
    update: {
      businessName: data.businessName || 'Mangy Dog Coffee',
      tagline: data.tagline || '',
      description: data.description || '',
      address: data.address || '',
      phone: data.phone || '',
      email: data.email || '',
      website: data.website || '',
      businessHours: data.businessHours || '',
      timezone: data.timezone || 'America/New_York'
    },
    create: {
      id: 'default',
      businessName: data.businessName || 'Mangy Dog Coffee',
      tagline: data.tagline || '',
      description: data.description || '',
      address: data.address || '',
      phone: data.phone || '',
      email: data.email || '',
      website: data.website || '',
      businessHours: data.businessHours || '',
      timezone: data.timezone || 'America/New_York'
    }
  });

  // Update Branding
  await prisma.branding.upsert({
    where: { id: 'default' },
    update: {
      logoUrl: data.logoUrl || '',
      faviconUrl: data.faviconUrl || '',
      primaryColor: data.primaryColor || '#92400e',
      secondaryColor: data.secondaryColor || '#78350f',
      accentColor: data.accentColor || '#b45309',
      headingFont: data.headingFont || 'Inter',
      bodyFont: data.bodyFont || 'Inter'
    },
    create: {
      id: 'default',
      logoUrl: data.logoUrl || '',
      faviconUrl: data.faviconUrl || '',
      primaryColor: data.primaryColor || '#92400e',
      secondaryColor: data.secondaryColor || '#78350f',
      accentColor: data.accentColor || '#b45309',
      headingFont: data.headingFont || 'Inter',
      bodyFont: data.bodyFont || 'Inter'
    }
  });

  // Update PaymentSettings
  await prisma.paymentSettings.upsert({
    where: { id: 'default' },
    update: {
      enabled: data.paymentsEnabled === true || data.paymentsEnabled === 'true',
      stripeEnabled: data.stripeEnabled === true || data.stripeEnabled === 'true',
      stripePublishableKey: data.stripePublishableKey || '',
      stripeTestMode: data.stripeTestMode === true || data.stripeTestMode === 'true',
      paypalEnabled: data.paypalEnabled === true || data.paypalEnabled === 'true',
      paypalClientId: data.paypalClientId || '',
      paypalSandbox: data.paypalSandbox === true || data.paypalSandbox === 'true',
      squareEnabled: data.squareEnabled === true || data.squareEnabled === 'true',
      squareAppId: data.squareAppId || '',
      squareSandbox: data.squareSandbox === true || data.squareSandbox === 'true'
    },
    create: {
      id: 'default',
      enabled: data.paymentsEnabled === true || data.paymentsEnabled === 'true',
      stripeEnabled: data.stripeEnabled === true || data.stripeEnabled === 'true',
      stripePublishableKey: data.stripePublishableKey || '',
      stripeTestMode: data.stripeTestMode === true || data.stripeTestMode === 'true',
      paypalEnabled: data.paypalEnabled === true || data.paypalEnabled === 'true',
      paypalClientId: data.paypalClientId || '',
      paypalSandbox: data.paypalSandbox === true || data.paypalSandbox === 'true',
      squareEnabled: data.squareEnabled === true || data.squareEnabled === 'true',
      squareAppId: data.squareAppId || '',
      squareSandbox: data.squareSandbox === true || data.squareSandbox === 'true'
    }
  });

  res.json({ success: true });
});

// Voices & Languages
router.get('/admin/voices', requireAuth, async (req, res) => {
  const config = await prisma.businessConfig.findFirst();
  const selectedVoice = config?.selectedVoice || 'alloy';

  // Get or create default languages
  let languages = await prisma.supportedLanguage.findMany({
    orderBy: { name: 'asc' }
  });

  // Seed all languages that have KB content if none exist
  if (languages.length === 0) {
    const defaultLangs = [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'es', name: 'Spanish', nativeName: 'Español' },
      { code: 'de', name: 'German', nativeName: 'Deutsch' },
      { code: 'zh', name: 'Chinese (Mandarin)', nativeName: '中文' },
      { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
      { code: 'fr', name: 'French', nativeName: 'Français' },
      { code: 'it', name: 'Italian', nativeName: 'Italiano' },
      { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
      { code: 'ja', name: 'Japanese', nativeName: '日本語' },
      { code: 'ko', name: 'Korean', nativeName: '한국어' },
      { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
      { code: 'ru', name: 'Russian', nativeName: 'Русский' },
      { code: 'pl', name: 'Polish', nativeName: 'Polski' },
      { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' }
    ];

    for (const lang of defaultLangs) {
      await prisma.supportedLanguage.create({ data: lang });
    }
    languages = await prisma.supportedLanguage.findMany({ orderBy: { name: 'asc' } });
  }

  // Count KB docs per language
  const docCounts = await prisma.knowledgeDoc.groupBy({
    by: ['language'],
    _count: true
  });

  const langsWithCounts = languages.map(lang => ({
    ...lang,
    flag: lang.code === 'en' ? '🇺🇸' : lang.code === 'es' ? '🇪🇸' : lang.code === 'de' ? '🇩🇪' :
          lang.code === 'zh' ? '🇨🇳' : lang.code === 'vi' ? '🇻🇳' : lang.code === 'fr' ? '🇫🇷' :
          lang.code === 'it' ? '🇮🇹' : lang.code === 'pt' ? '🇧🇷' : lang.code === 'ja' ? '🇯🇵' :
          lang.code === 'ko' ? '🇰🇷' : lang.code === 'ar' ? '🇸🇦' : lang.code === 'hi' ? '🇮🇳' :
          lang.code === 'ru' ? '🇷🇺' : lang.code === 'pl' ? '🇵🇱' : lang.code === 'nl' ? '🇳🇱' :
          lang.code === 'uk' ? '🇺🇦' : lang.code === 'fil' ? '🇵🇭' : lang.code === 'tl' ? '🇵🇭' :
          lang.code === 'ne' ? '🇳🇵' : lang.code === 'fa' ? '🇮🇷' : lang.code === 'gl' ? '🇪🇸' :
          lang.code === 'he' ? '🇮🇱' : lang.code === 'sr' ? '🇷🇸' : lang.code === 'nl-be' ? '🇧🇪' : '🌐',
    docCount: docCounts.find(d => d.language === lang.code)?._count || 0
  }));

  const totalDocs = await prisma.knowledgeDoc.count();

  const branding = await getBranding();
  res.render('admin/voices', {
    token: req.query.token,
    selectedVoice,
    languages: langsWithCounts,
    totalDocs,
    branding,
    basePath
  });
});

// Select voice
router.post('/admin/voices/select', requireAuth, async (req, res) => {
  const { voice } = req.body;
  const validVoices = ['alloy', 'ash', 'ballad', 'coral', 'echo', 'sage', 'shimmer', 'verse'];

  if (!validVoices.includes(voice)) {
    return res.status(400).json({ error: 'Invalid voice' });
  }

  let config = await prisma.businessConfig.findFirst();
  if (config) {
    await prisma.businessConfig.update({
      where: { id: config.id },
      data: { selectedVoice: voice }
    });
  } else {
    await prisma.businessConfig.create({
      data: { selectedVoice: voice }
    });
  }

  res.json({ success: true, voice });
});

// Toggle language
router.post('/admin/voices/language/:id', requireAuth, async (req, res) => {
  const { enabled } = req.body;

  await prisma.supportedLanguage.update({
    where: { id: req.params.id },
    data: { enabled: !!enabled }
  });

  res.json({ success: true });
});

// Add language
router.post('/admin/voices/language', requireAuth, async (req, res) => {
  const { code } = req.body;

  const langData: Record<string, { name: string; nativeName: string }> = {
    zh: { name: 'Chinese (Mandarin)', nativeName: '中文' },
    vi: { name: 'Vietnamese', nativeName: 'Tiếng Việt' },
    fr: { name: 'French', nativeName: 'Français' },
    it: { name: 'Italian', nativeName: 'Italiano' },
    pt: { name: 'Portuguese', nativeName: 'Português' },
    ja: { name: 'Japanese', nativeName: '日本語' },
    ko: { name: 'Korean', nativeName: '한국어' },
    ar: { name: 'Arabic', nativeName: 'العربية' },
    hi: { name: 'Hindi', nativeName: 'हिन्दी' },
    ru: { name: 'Russian', nativeName: 'Русский' },
    pl: { name: 'Polish', nativeName: 'Polski' },
    nl: { name: 'Dutch', nativeName: 'Nederlands' }
  };

  if (code && langData[code]) {
    try {
      await prisma.supportedLanguage.create({
        data: {
          code,
          name: langData[code].name,
          nativeName: langData[code].nativeName,
          enabled: true
        }
      });
    } catch (e) {
      // Already exists
    }
  }

  res.redirect(`/MangyDogCoffee/admin/voices?token=${req.query.token}`);
});

// Greeting Config
router.get('/admin/greeting', requireAuth, async (req, res) => {
  let config = await prisma.businessConfig.findFirst();
  if (!config) {
    config = await prisma.businessConfig.create({ data: {} });
  }
  const branding = await getBranding();

  res.render('admin/greeting', {
    token: req.query.token,
    greeting: config.greeting,
    branding,
    basePath
  });
});

router.post('/admin/greeting', requireAuth, async (req, res) => {
  const { greeting } = req.body;

  let config = await prisma.businessConfig.findFirst();
  if (config) {
    await prisma.businessConfig.update({
      where: { id: config.id },
      data: { greeting }
    });
  } else {
    await prisma.businessConfig.create({
      data: { greeting }
    });
  }

  res.json({ success: true });
});

// TTS Preview endpoint using OpenAI TTS API
router.post('/admin/greeting/preview', requireAuth, async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    // Get selected voice from config
    const config = await prisma.businessConfig.findFirst();
    const voice = config?.selectedVoice || 'alloy';

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: voice,
        response_format: 'mp3'
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI TTS error:', error);
      return res.status(500).json({ error: 'TTS generation failed' });
    }

    // Stream the audio back
    res.set({
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'no-cache'
    });

    const arrayBuffer = await response.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (err: any) {
    console.error('TTS preview error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// WEBHOOKS CONFIGURATION
// ============================================

router.get('/admin/webhooks', requireAuth, async (req, res) => {
  const [webhooks, branding] = await Promise.all([
    prisma.webhook.findMany({ orderBy: { name: 'asc' } }),
    getBranding()
  ]);
  res.render('admin/webhooks', { token: req.query.token, webhooks, branding, basePath });
});

router.post('/admin/webhooks', requireAuth, async (req, res) => {
  const { name, url, enabled, secret } = req.body;
  await prisma.webhook.upsert({
    where: { name },
    create: { name, url, enabled: enabled === 'true', secret: secret || null },
    update: { url, enabled: enabled === 'true', secret: secret || null }
  });
  res.json({ success: true });
});

router.delete('/admin/webhooks/:name', requireAuth, async (req, res) => {
  await prisma.webhook.delete({ where: { name: req.params.name } });
  res.json({ success: true });
});

// ============================================
// SMS CONFIGURATION
// ============================================

router.get('/admin/sms', requireAuth, async (req, res) => {
  let config = await prisma.smsConfig.findFirst();
  if (!config) {
    config = await prisma.smsConfig.create({ data: {} });
  }
  const [templates, branding] = await Promise.all([
    prisma.smsTemplate.findMany({ orderBy: { name: 'asc' } }),
    getBranding()
  ]);
  res.render('admin/sms', { token: req.query.token, config, templates, branding, basePath });
});

router.post('/admin/sms/config', requireAuth, async (req, res) => {
  const { enabled, fromNumber, ticketConfirmation, sponsorFollowUp, eventReminder, voicemailNotification, adminAlertNumber } = req.body;
  let config = await prisma.smsConfig.findFirst();
  if (config) {
    await prisma.smsConfig.update({
      where: { id: config.id },
      data: {
        enabled: enabled === 'true',
        fromNumber: fromNumber || null,
        ticketConfirmation: ticketConfirmation === 'true',
        sponsorFollowUp: sponsorFollowUp === 'true',
        eventReminder: eventReminder === 'true',
        voicemailNotification: voicemailNotification === 'true',
        adminAlertNumber: adminAlertNumber || null
      }
    });
  } else {
    await prisma.smsConfig.create({
      data: {
        enabled: enabled === 'true',
        fromNumber: fromNumber || null,
        ticketConfirmation: ticketConfirmation === 'true',
        sponsorFollowUp: sponsorFollowUp === 'true',
        eventReminder: eventReminder === 'true',
        voicemailNotification: voicemailNotification === 'true',
        adminAlertNumber: adminAlertNumber || null
      }
    });
  }
  res.json({ success: true });
});

router.post('/admin/sms/template', requireAuth, async (req, res) => {
  const { name, template, enabled } = req.body;
  await prisma.smsTemplate.upsert({
    where: { name },
    create: { name, template, enabled: enabled === 'true' },
    update: { template, enabled: enabled === 'true' }
  });
  res.json({ success: true });
});

// ============================================
// TRANSFER CONFIGURATION
// ============================================

router.get('/admin/transfer', requireAuth, async (req, res) => {
  let config = await prisma.transferConfig.findFirst();
  if (!config) {
    config = await prisma.transferConfig.create({ data: {} });
  }
  const [routes, branding] = await Promise.all([
    prisma.transferRoute.findMany({ orderBy: { name: 'asc' } }),
    getBranding()
  ]);
  res.render('admin/transfer', { token: req.query.token, config, routes, branding, basePath });
});

router.post('/admin/transfer/config', requireAuth, async (req, res) => {
  const { enabled, defaultTransferNumber, transferMessage, voicemailEnabled, voicemailNumber, voicemailGreeting, maxWaitTime } = req.body;
  let config = await prisma.transferConfig.findFirst();
  if (config) {
    await prisma.transferConfig.update({
      where: { id: config.id },
      data: {
        enabled: enabled === 'true',
        defaultTransferNumber: defaultTransferNumber || null,
        transferMessage: transferMessage || 'Please hold while I transfer you.',
        voicemailEnabled: voicemailEnabled === 'true',
        voicemailNumber: voicemailNumber || null,
        voicemailGreeting: voicemailGreeting || 'Please leave a message after the tone.',
        maxWaitTime: parseInt(maxWaitTime) || 30
      }
    });
  } else {
    await prisma.transferConfig.create({
      data: {
        enabled: enabled === 'true',
        defaultTransferNumber: defaultTransferNumber || null,
        transferMessage: transferMessage || 'Please hold while I transfer you.',
        voicemailEnabled: voicemailEnabled === 'true',
        voicemailNumber: voicemailNumber || null,
        voicemailGreeting: voicemailGreeting || 'Please leave a message after the tone.',
        maxWaitTime: parseInt(maxWaitTime) || 30
      }
    });
  }
  res.json({ success: true });
});

router.post('/admin/transfer/route', requireAuth, async (req, res) => {
  const { name, phoneNumber, description, schedule, enabled } = req.body;
  await prisma.transferRoute.upsert({
    where: { name },
    create: { name, phoneNumber, description: description || null, schedule: schedule || null, enabled: enabled === 'true' },
    update: { phoneNumber, description: description || null, schedule: schedule || null, enabled: enabled === 'true' }
  });
  res.json({ success: true });
});

router.delete('/admin/transfer/route/:name', requireAuth, async (req, res) => {
  await prisma.transferRoute.delete({ where: { name: req.params.name } });
  res.json({ success: true });
});

// ============================================
// DTMF MENU CONFIGURATION
// ============================================

router.get('/admin/dtmf', requireAuth, async (req, res) => {
  let menu = await prisma.dtmfMenu.findFirst();
  if (!menu) {
    menu = await prisma.dtmfMenu.create({ data: {} });
  }
  const [options, branding] = await Promise.all([
    prisma.dtmfOption.findMany({ orderBy: { sortOrder: 'asc' } }),
    getBranding()
  ]);
  res.render('admin/dtmf', { token: req.query.token, menu, options, branding, basePath });
});

router.post('/admin/dtmf/menu', requireAuth, async (req, res) => {
  const { enabled, greeting, timeoutSecs } = req.body;
  let menu = await prisma.dtmfMenu.findFirst();
  if (menu) {
    await prisma.dtmfMenu.update({
      where: { id: menu.id },
      data: {
        enabled: enabled === 'true',
        greeting: greeting || 'Press 1 for event info...',
        timeoutSecs: parseInt(timeoutSecs) || 5
      }
    });
  } else {
    await prisma.dtmfMenu.create({
      data: {
        enabled: enabled === 'true',
        greeting: greeting || 'Press 1 for event info...',
        timeoutSecs: parseInt(timeoutSecs) || 5
      }
    });
  }
  res.json({ success: true });
});

router.post('/admin/dtmf/option', requireAuth, async (req, res) => {
  const { digit, label, action, actionValue, enabled, sortOrder } = req.body;
  await prisma.dtmfOption.upsert({
    where: { digit },
    create: { digit, label, action, actionValue: actionValue || null, enabled: enabled === 'true', sortOrder: parseInt(sortOrder) || 0 },
    update: { label, action, actionValue: actionValue || null, enabled: enabled === 'true', sortOrder: parseInt(sortOrder) || 0 }
  });
  res.json({ success: true });
});

router.delete('/admin/dtmf/option/:digit', requireAuth, async (req, res) => {
  await prisma.dtmfOption.delete({ where: { digit: req.params.digit } });
  res.json({ success: true });
});

// ============================================
// AI TOOLS CONFIGURATION
// ============================================

router.get('/admin/tools', requireAuth, async (req, res) => {
  const [tools, branding] = await Promise.all([
    prisma.aiTool.findMany({ orderBy: { category: 'asc' } }),
    getBranding()
  ]);
  res.render('admin/tools', { token: req.query.token, tools, branding, basePath });
});

router.post('/admin/tools', requireAuth, async (req, res) => {
  const { name, displayName, description, enabled, category } = req.body;
  await prisma.aiTool.upsert({
    where: { name },
    create: { name, displayName, description, enabled: enabled === 'true', category: category || 'general' },
    update: { displayName, description, enabled: enabled === 'true', category: category || 'general' }
  });
  res.json({ success: true });
});

router.post('/admin/tools/toggle/:name', requireAuth, async (req, res) => {
  const tool = await prisma.aiTool.findUnique({ where: { name: req.params.name } });
  if (tool) {
    await prisma.aiTool.update({
      where: { name: req.params.name },
      data: { enabled: !tool.enabled }
    });
  }
  res.json({ success: true });
});

// ============================================
// AI AGENTS CONFIGURATION
// ============================================

router.get('/admin/agents', requireAuth, async (req, res) => {
  const [agents, branding] = await Promise.all([
    prisma.aiAgent.findMany({ orderBy: { name: 'asc' } }),
    getBranding()
  ]);
  res.render('admin/agents', { token: req.query.token, agents, branding, basePath });
});

router.post('/admin/agents', requireAuth, async (req, res) => {
  const { name, displayName, voice, language, systemPrompt, greeting, tools, isDefault, enabled } = req.body;

  // If setting as default, unset other defaults
  if (isDefault === 'true') {
    await prisma.aiAgent.updateMany({ data: { isDefault: false } });
  }

  await prisma.aiAgent.upsert({
    where: { name },
    create: {
      name,
      displayName,
      voice: voice || 'alloy',
      language: language || 'en',
      systemPrompt,
      greeting: greeting || null,
      tools: tools || '[]',
      isDefault: isDefault === 'true',
      enabled: enabled === 'true'
    },
    update: {
      displayName,
      voice: voice || 'alloy',
      language: language || 'en',
      systemPrompt,
      greeting: greeting || null,
      tools: tools || '[]',
      isDefault: isDefault === 'true',
      enabled: enabled === 'true'
    }
  });
  res.json({ success: true });
});

router.delete('/admin/agents/:name', requireAuth, async (req, res) => {
  await prisma.aiAgent.delete({ where: { name: req.params.name } });
  res.json({ success: true });
});

// ============================================
// LOGIC RULES CONFIGURATION
// ============================================

router.get('/admin/logic', requireAuth, async (req, res) => {
  const [rules, branding] = await Promise.all([
    prisma.logicRule.findMany({ orderBy: { priority: 'asc' } }),
    getBranding()
  ]);
  res.render('admin/logic', { token: req.query.token, rules, branding, basePath });
});

router.post('/admin/logic', requireAuth, async (req, res) => {
  const { name, description, condition, action, actionValue, priority, enabled } = req.body;
  await prisma.logicRule.upsert({
    where: { name },
    create: {
      name,
      description: description || null,
      condition,
      action,
      actionValue,
      priority: parseInt(priority) || 0,
      enabled: enabled === 'true'
    },
    update: {
      description: description || null,
      condition,
      action,
      actionValue,
      priority: parseInt(priority) || 0,
      enabled: enabled === 'true'
    }
  });
  res.json({ success: true });
});

router.delete('/admin/logic/:name', requireAuth, async (req, res) => {
  await prisma.logicRule.delete({ where: { name: req.params.name } });
  res.json({ success: true });
});

// ============================================
// CUSTOM FUNCTIONS & CALENDAR CONFIGURATION
// ============================================

router.get('/admin/functions', requireAuth, async (req, res) => {
  let calendarConfig = await prisma.calendarConfig.findFirst();
  if (!calendarConfig) {
    calendarConfig = await prisma.calendarConfig.create({ data: {} });
  }
  const [functions, branding] = await Promise.all([
    prisma.customFunction.findMany({ orderBy: { name: 'asc' } }),
    getBranding()
  ]);
  res.render('admin/functions', { token: req.query.token, calendarConfig, functions, branding, basePath });
});

router.post('/admin/functions/calendar', requireAuth, async (req, res) => {
  const {
    provider, enabled, apiKey, calendarId, clientId, clientSecret,
    refreshToken, webhookUrl, defaultDuration, bufferTime, workingHours
  } = req.body;

  let config = await prisma.calendarConfig.findFirst();
  const data = {
    provider: provider || 'google',
    enabled: enabled === 'true',
    apiKey: apiKey || null,
    calendarId: calendarId || null,
    clientId: clientId || null,
    clientSecret: clientSecret || null,
    refreshToken: refreshToken || null,
    webhookUrl: webhookUrl || null,
    defaultDuration: parseInt(defaultDuration) || 30,
    bufferTime: parseInt(bufferTime) || 15,
    workingHours: workingHours || '{"Mon-Fri": {"start": "09:00", "end": "17:00"}}'
  };

  if (config) {
    await prisma.calendarConfig.update({ where: { id: config.id }, data });
  } else {
    await prisma.calendarConfig.create({ data });
  }
  res.json({ success: true });
});

router.post('/admin/functions', requireAuth, async (req, res) => {
  const {
    name, displayName, description, type, endpoint, method, timeout,
    headers, queryParams, parameters, payloadType, customPayload, responseMapping, enabled
  } = req.body;

  await prisma.customFunction.upsert({
    where: { name },
    create: {
      name,
      displayName,
      description,
      type: type || 'custom',
      endpoint: endpoint || null,
      method: method || 'POST',
      timeout: parseInt(timeout) || 120000,
      headers: headers || '{}',
      queryParams: queryParams || '{}',
      parameters: parameters || '{}',
      payloadType: payloadType || 'args_only',
      customPayload: customPayload || null,
      responseMapping: responseMapping || null,
      enabled: enabled === 'true'
    },
    update: {
      displayName,
      description,
      type: type || 'custom',
      endpoint: endpoint || null,
      method: method || 'POST',
      timeout: parseInt(timeout) || 120000,
      headers: headers || '{}',
      queryParams: queryParams || '{}',
      parameters: parameters || '{}',
      payloadType: payloadType || 'args_only',
      customPayload: customPayload || null,
      responseMapping: responseMapping || null,
      enabled: enabled === 'true'
    }
  });
  res.json({ success: true });
});

router.post('/admin/functions/toggle/:name', requireAuth, async (req, res) => {
  const fn = await prisma.customFunction.findUnique({ where: { name: req.params.name } });
  if (fn) {
    await prisma.customFunction.update({
      where: { name: req.params.name },
      data: { enabled: !fn.enabled }
    });
  }
  res.json({ success: true });
});

router.delete('/admin/functions/:name', requireAuth, async (req, res) => {
  await prisma.customFunction.delete({ where: { name: req.params.name } });
  res.json({ success: true });
});

// Seed calendar functions
router.post('/admin/functions/seed-calendar', requireAuth, async (req, res) => {
  const calendarFunctions = [
    {
      name: 'checkCalendarAvailability',
      displayName: 'Check Calendar Availability',
      description: 'Check available time slots on the calendar for a given date range',
      type: 'calendar_check',
      endpoint: '',
      method: 'GET',
      timeout: 30000,
      headers: '{}',
      queryParams: '{}',
      parameters: JSON.stringify({
        type: 'object',
        properties: {
          startDate: { type: 'string', description: 'Start date in ISO format' },
          endDate: { type: 'string', description: 'End date in ISO format' },
          duration: { type: 'number', description: 'Appointment duration in minutes' }
        },
        required: ['startDate', 'endDate']
      }),
      payloadType: 'args_only',
      enabled: true
    },
    {
      name: 'bookCalendarAppointment',
      displayName: 'Book Calendar Appointment',
      description: 'Book an appointment on the calendar',
      type: 'calendar_book',
      endpoint: '',
      method: 'POST',
      timeout: 30000,
      headers: '{}',
      queryParams: '{}',
      parameters: JSON.stringify({
        type: 'object',
        properties: {
          dateTime: { type: 'string', description: 'Appointment date/time in ISO format' },
          duration: { type: 'number', description: 'Duration in minutes' },
          name: { type: 'string', description: 'Customer name' },
          email: { type: 'string', description: 'Customer email' },
          phone: { type: 'string', description: 'Customer phone' },
          notes: { type: 'string', description: 'Appointment notes' }
        },
        required: ['dateTime', 'name']
      }),
      payloadType: 'args_only',
      enabled: true
    }
  ];

  for (const fn of calendarFunctions) {
    await prisma.customFunction.upsert({
      where: { name: fn.name },
      create: fn,
      update: fn
    });
  }

  res.json({ success: true, count: calendarFunctions.length });
});

// ============================================
// FEATURES CONFIGURATION
// ============================================

router.get('/admin/features', requireAuth, async (req, res) => {
  const [features, branding] = await Promise.all([
    prisma.features.findFirst(),
    getBranding()
  ]);

  // Transform stickyBarBgColor to stickyBarColor for view compatibility
  const featuresForView = features ? {
    ...features,
    stickyBarColor: features.stickyBarBgColor
  } : null;

  res.render('admin/features', { token: req.query.token, features: featuresForView, branding, basePath });
});

router.post('/admin/features', requireAuth, async (req, res) => {
  const data = req.body;

  await prisma.features.upsert({
    where: { id: 'default' },
    update: {
      faqEnabled: data.faqEnabled === true || data.faqEnabled === 'true',
      stickyBarEnabled: data.stickyBarEnabled === true || data.stickyBarEnabled === 'true',
      stickyBarText: data.stickyBarText || '',
      stickyBarBgColor: data.stickyBarColor || '#92400e',
      stickyBarLink: data.stickyBarLink || '',
      stickyBarLinkText: data.stickyBarLinkText || '',
      liveChatEnabled: data.liveChatEnabled === true || data.liveChatEnabled === 'true',
      chatProvider: data.chatProvider || 'builtin',
      chatWelcomeMessage: data.chatWelcomeMessage || 'Hi! How can we help you today?',
      chatAgentName: data.chatAgentName || 'Support',
      chatWidgetColor: data.chatWidgetColor || '#92400e',
      chatPosition: data.chatPosition || 'bottom-right',
      chatShowOnMobile: data.chatShowOnMobile === true || data.chatShowOnMobile === 'true',
      chatWidgetId: data.chatWidgetId || '',
      chatEmbedCode: data.chatEmbedCode || '',
      emailNotifications: data.emailNotifications === true || data.emailNotifications === 'true',
      smsNotifications: data.smsNotifications === true || data.smsNotifications === 'true',
      pushNotifications: data.pushNotifications === true || data.pushNotifications === 'true',
      orderConfirmations: data.orderConfirmations === true || data.orderConfirmations === 'true',
      marketingEmails: data.marketingEmails === true || data.marketingEmails === 'true',
      appointmentReminders: data.appointmentReminders === true || data.appointmentReminders === 'true',
      facebookUrl: data.facebookUrl || '',
      twitterUrl: data.twitterUrl || '',
      instagramUrl: data.instagramUrl || '',
      linkedinUrl: data.linkedinUrl || '',
      youtubeUrl: data.youtubeUrl || '',
      tiktokUrl: data.tiktokUrl || '',
      shareOnFacebook: data.shareOnFacebook === true || data.shareOnFacebook === 'true',
      shareOnTwitter: data.shareOnTwitter === true || data.shareOnTwitter === 'true',
      shareOnLinkedin: data.shareOnLinkedin === true || data.shareOnLinkedin === 'true',
      shareOnWhatsapp: data.shareOnWhatsapp === true || data.shareOnWhatsapp === 'true',
      shareOnEmail: data.shareOnEmail === true || data.shareOnEmail === 'true',
      copyLinkButton: data.copyLinkButton === true || data.copyLinkButton === 'true'
    },
    create: {
      id: 'default',
      faqEnabled: data.faqEnabled === true || data.faqEnabled === 'true',
      stickyBarEnabled: data.stickyBarEnabled === true || data.stickyBarEnabled === 'true',
      stickyBarText: data.stickyBarText || '',
      stickyBarBgColor: data.stickyBarColor || '#92400e',
      stickyBarLink: data.stickyBarLink || '',
      stickyBarLinkText: data.stickyBarLinkText || '',
      liveChatEnabled: data.liveChatEnabled === true || data.liveChatEnabled === 'true',
      chatProvider: data.chatProvider || 'builtin',
      chatWelcomeMessage: data.chatWelcomeMessage || 'Hi! How can we help you today?',
      chatAgentName: data.chatAgentName || 'Support',
      chatWidgetColor: data.chatWidgetColor || '#92400e',
      chatPosition: data.chatPosition || 'bottom-right',
      chatShowOnMobile: data.chatShowOnMobile === true || data.chatShowOnMobile === 'true',
      chatWidgetId: data.chatWidgetId || '',
      chatEmbedCode: data.chatEmbedCode || '',
      emailNotifications: data.emailNotifications === true || data.emailNotifications === 'true',
      smsNotifications: data.smsNotifications === true || data.smsNotifications === 'true',
      pushNotifications: data.pushNotifications === true || data.pushNotifications === 'true',
      orderConfirmations: data.orderConfirmations === true || data.orderConfirmations === 'true',
      marketingEmails: data.marketingEmails === true || data.marketingEmails === 'true',
      appointmentReminders: data.appointmentReminders === true || data.appointmentReminders === 'true',
      facebookUrl: data.facebookUrl || '',
      twitterUrl: data.twitterUrl || '',
      instagramUrl: data.instagramUrl || '',
      linkedinUrl: data.linkedinUrl || '',
      youtubeUrl: data.youtubeUrl || '',
      tiktokUrl: data.tiktokUrl || '',
      shareOnFacebook: data.shareOnFacebook === true || data.shareOnFacebook === 'true',
      shareOnTwitter: data.shareOnTwitter === true || data.shareOnTwitter === 'true',
      shareOnLinkedin: data.shareOnLinkedin === true || data.shareOnLinkedin === 'true',
      shareOnWhatsapp: data.shareOnWhatsapp === true || data.shareOnWhatsapp === 'true',
      shareOnEmail: data.shareOnEmail === true || data.shareOnEmail === 'true',
      copyLinkButton: data.copyLinkButton === true || data.copyLinkButton === 'true'
    }
  });

  res.json({ success: true });
});

export default router;
