import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Mangy Dog Coffee database...');

  // Clear existing data (order matters for foreign keys)
  await prisma.transcript.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.intentLog.deleteMany({});
  await prisma.citationsLog.deleteMany({});
  await prisma.callLog.deleteMany({});
  await prisma.knowledgeChunk.deleteMany({});
  await prisma.knowledgeDoc.deleteMany({});
  await prisma.supportedLanguage.deleteMany({});
  await prisma.aiTool.deleteMany({});
  await prisma.aiAgent.deleteMany({});

  // Create supported languages (all 24 languages, all enabled - matching SellMeAPenExt exactly)
  const languages = [
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', enabled: true },
    { code: 'zh', name: 'Chinese (Mandarin)', nativeName: '中文', enabled: true },
    { code: 'cs', name: 'Czech', nativeName: 'Čeština', enabled: true },
    { code: 'da', name: 'Danish', nativeName: 'Dansk', enabled: true },
    { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', enabled: true },
    { code: 'en', name: 'English', nativeName: 'English', enabled: true },
    { code: 'fi', name: 'Finnish', nativeName: 'Suomi', enabled: true },
    { code: 'fr', name: 'French', nativeName: 'Français', enabled: true },
    { code: 'de', name: 'German', nativeName: 'Deutsch', enabled: true },
    { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', enabled: true },
    { code: 'he', name: 'Hebrew', nativeName: 'עברית', enabled: true },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', enabled: true },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', enabled: true },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', enabled: true },
    { code: 'ko', name: 'Korean', nativeName: '한국어', enabled: true },
    { code: 'no', name: 'Norwegian', nativeName: 'Norsk', enabled: true },
    { code: 'pl', name: 'Polish', nativeName: 'Polski', enabled: true },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', enabled: true },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', enabled: true },
    { code: 'es', name: 'Spanish', nativeName: 'Español', enabled: true },
    { code: 'sv', name: 'Swedish', nativeName: 'Svenska', enabled: true },
    { code: 'th', name: 'Thai', nativeName: 'ไทย', enabled: true },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', enabled: true },
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', enabled: true }
  ];

  for (const lang of languages) {
    await prisma.supportedLanguage.create({ data: lang });
  }
  console.log(`Created ${languages.length} supported languages (all enabled)`);

  // Create or update Business Config
  await prisma.businessConfig.upsert({
    where: { id: 'default' },
    update: {
      organizationName: 'Mangy Dog Coffee',
      hoursJson: '{"Mon-Fri": "7am-7pm", "Sat": "8am-6pm", "Sun": "9am-5pm"}',
      address: '456 Barker Street, Paw City, TX 75001',
      selectedVoice: 'alloy',
      greeting: 'Thank you for calling Mangy Dog Coffee. Coffee with a bite! 10% of all sales goes to the AKT Foundation for animal rescue. How can I help you today?'
    },
    create: {
      id: 'default',
      organizationName: 'Mangy Dog Coffee',
      hoursJson: '{"Mon-Fri": "7am-7pm", "Sat": "8am-6pm", "Sun": "9am-5pm"}',
      address: '456 Barker Street, Paw City, TX 75001',
      selectedVoice: 'alloy',
      greeting: 'Thank you for calling Mangy Dog Coffee. Coffee with a bite! 10% of all sales goes to the AKT Foundation for animal rescue. How can I help you today?'
    }
  });
  console.log('Created business config');

  // Create knowledge base articles for Mangy Dog Coffee
  const kbArticles = [
    {
      id: 'kb-about',
      title: 'About Mangy Dog Coffee',
      slug: 'about',
      language: 'en',
      content: `# About Mangy Dog Coffee

Mangy Dog Coffee is a specialty coffee roaster dedicated to delivering exceptional coffee while supporting animal rescue.

## Our Mission
We believe great coffee can make a difference. That's why 10% of all our sales go directly to the AKT Foundation, helping rescue and rehome animals in need.

## Our Story
Founded by coffee lovers who are also animal lovers, Mangy Dog Coffee started with a simple idea: brew amazing coffee and help our furry friends. Every bag of coffee you buy helps feed, shelter, and care for rescued animals.

## What Makes Us Different
- Fresh roasted to order
- Single origin and specialty blends
- Ethically sourced beans
- 10% of sales to animal rescue
- Small batch roasting for maximum freshness`
    },
    {
      id: 'kb-products',
      title: 'Our Coffee Products',
      slug: 'products',
      language: 'en',
      content: `# Our Coffee Products

## Coffee Blends
- **House Blend** - Smooth, clean, consistent. Perfect daily brew.
- **Breakfast Blend** - Light and bright, ideal for mornings.
- **French Roast** - Bold and rich with low acidity.
- **Italian Roast** - Extra dark for deep, heavy flavor.
- **Max Caf Blend** - High caffeine for those who need extra energy.
- **Cold Brew Coffee** - Smooth chocolate and toffee tones.

## Single Origin Coffees
- **Colombia** - Dried orange, berry, chocolate from Medellin.
- **Ethiopia Natural** - Milk chocolate, fruity, caramel.
- **Guatemala** - Dark chocolate, bright fruit, butterscotch.
- **Peru** - Salted caramel, silky sweet, citrus.
- **Kenya** - Bright acidity, orange, lemon, floral.
- **Bali Blue** - Dark chocolate, molasses, brown sugar.

## Specialty Products
- **Coffee with Mushrooms** - Infused with Lion's Mane, Cordyceps, and Reishi.
- **Whiskey Barrel Aged** - Aged 30 days in Bourbon barrel.
- **Instant Coffee** - 30 servings in a resealable pouch.

## Sizes Available
- 12oz - $19.99
- 1 LB - $28.99
- 2 LB - $49.99
- 5 LB - $89.99`
    },
    {
      id: 'kb-tea',
      title: 'Our Tea Selection',
      slug: 'tea',
      language: 'en',
      content: `# Our Tea Selection

All teas are available in 3oz tins for $20.99.

## Black Teas
- **English Breakfast** - Classic strong breakfast tea.
- **Earl Grey** - Ceylon black tea with bergamot oil.
- **Masala Chai** - Bold and spicy Indian chai.

## Green Teas
- **Jasmine Tea** - Jasmine blossoms and green tea.
- **Moroccan Mint** - Green tea with fresh mint.
- **Matcha** - Traditional matcha powder (1oz - $18.99).
- **Hojicha** - Roasted green tea with toasty notes.

## Herbal & Fruit Teas
- **Hibiscus Berry** - Organic blueberry and currant.
- **Peach Paradise** - Fruity peach with rose notes.
- **Mango Treat** - Sweet and summery.
- **Apple Cider Rooibos** - Spicy, sweet, caffeine-free.`
    },
    {
      id: 'kb-ordering',
      title: 'How to Order',
      slug: 'ordering',
      language: 'en',
      content: `# How to Order

## Online Orders
Visit mangydogcoffee.com to browse our full selection and place your order.

## Phone Orders
Call us and our AI assistant can help you place an order or answer questions about our products.

## Grind Options
- Whole Bean (recommended for freshest flavor)
- Standard Grind (drip coffee makers)
- Espresso Grind (espresso machines)
- Coarse Grind (French press, cold brew)

## Shipping
- Free shipping on orders over $50
- Standard shipping: 3-5 business days
- Express shipping available
- All coffee roasted fresh before shipping`
    },
    {
      id: 'kb-subscription',
      title: 'Coffee Subscription',
      slug: 'subscription',
      language: 'en',
      content: `# Coffee Subscription

Never run out of your favorite coffee!

## How It Works
1. Choose your coffee (any blend or single origin)
2. Select your size (12oz, 1 LB, 2 LB, or 5 LB)
3. Pick your frequency (weekly, bi-weekly, or monthly)
4. Save 15% on every order!

## Subscription Benefits
- 15% discount on all subscription orders
- Free shipping on every delivery
- Roasted fresh before each shipment
- Skip, pause, or cancel anytime
- Change your coffee selection anytime

## Sample Packs
Try before you subscribe with our sample packs:
- Best Sellers Sample Pack (6 samples) - $24.99
- Single Origin Favorites (6 samples) - $24.99
- Flavored Coffees Sample Pack (6 samples) - $24.99`
    },
    {
      id: 'kb-charity',
      title: 'AKT Foundation Partnership',
      slug: 'charity',
      language: 'en',
      content: `# Supporting the AKT Foundation

## Our Partnership
Mangy Dog Coffee proudly donates 10% of all sales to the AKT Foundation, a nonprofit organization dedicated to rescuing and rehoming animals.

## About AKT Foundation
The AKT Foundation:
- Rescues animals from shelters and dangerous situations
- Provides medical care and rehabilitation
- Finds loving forever homes
- Educates communities about animal welfare

## Your Impact
Every purchase you make helps:
- Feed rescued animals
- Provide veterinary care
- Support foster families
- Fund adoption events

## How You Help
When you buy a 1 LB bag of coffee ($28.99), nearly $3 goes directly to helping animals in need. Thank you for making a difference with every cup!`
    },
    {
      id: 'kb-wholesale',
      title: 'Wholesale Information',
      slug: 'wholesale',
      language: 'en',
      content: `# Wholesale Program

## For Businesses
We offer wholesale pricing for:
- Cafes and coffee shops
- Restaurants
- Hotels
- Offices
- Grocery stores

## Wholesale Benefits
- Competitive pricing
- Fresh roasted to order
- Custom blends available
- Private labeling options
- Dedicated account manager
- Marketing support

## How to Apply
1. Contact us by phone or email
2. Tell us about your business
3. Receive a custom quote
4. Start ordering!

## Minimum Orders
- First order: 20 lbs minimum
- Reorders: 10 lbs minimum
- Free shipping on orders over 50 lbs`
    },
    {
      id: 'kb-contact',
      title: 'Contact Information',
      slug: 'contact',
      language: 'en',
      content: `# Contact Us

## Customer Service
- Phone: Call our AI assistant anytime
- Email: hello@mangydogcoffee.com
- Hours: Mon-Fri 7am-7pm, Sat 8am-6pm, Sun 9am-5pm CT

## Visit Us
Mangy Dog Coffee Roastery
456 Barker Street
Paw City, TX 75001

## Social Media
- Instagram: @mangydogcoffee
- Facebook: /mangydogcoffee
- Twitter: @mangydogcoffee

## For Wholesale Inquiries
wholesale@mangydogcoffee.com

## For Press & Media
press@mangydogcoffee.com`
    }
  ];

  for (const article of kbArticles) {
    await prisma.knowledgeDoc.upsert({
      where: { id: article.id },
      update: { content: article.content },
      create: article
    });
  }
  console.log(`Created ${kbArticles.length} knowledge base documents`);

  // Create sample call logs for analytics
  const callLogs = [];
  const outcomes = ['completed', 'completed', 'completed', 'transferred', 'voicemail'];
  const callerNames = ['John Smith', 'Maria Garcia', 'David Kim', 'Sarah Johnson', 'Mike Brown', 'Lisa Chen', 'James Wilson', 'Emma Davis', 'Robert Taylor', 'Jennifer Lee'];

  for (let i = 0; i < 15; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const startTime = new Date();
    startTime.setDate(startTime.getDate() - daysAgo);
    startTime.setHours(Math.floor(Math.random() * 12) + 7);

    const duration = Math.floor(Math.random() * 300) + 60;
    const endTime = new Date(startTime.getTime() + duration * 1000);

    const callLog = await prisma.callLog.create({
      data: {
        callSid: `CA${Date.now()}${i}${Math.random().toString(36).substring(7)}`,
        fromNumber: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        toNumber: '+18005551234',
        callerName: callerNames[Math.floor(Math.random() * callerNames.length)],
        duration,
        startedAt: startTime,
        endedAt: endTime,
        outcome: outcomes[Math.floor(Math.random() * outcomes.length)]
      }
    });
    callLogs.push(callLog);
  }
  console.log(`Created ${callLogs.length} call logs`);

  // Create intent logs for analytics
  const intents = ['product_inquiry', 'order_status', 'pricing_question', 'store_hours', 'coffee_recommendation', 'shipping_info', 'wholesale_inquiry', 'subscription_info', 'charity_info', 'return_policy'];

  for (const callLog of callLogs) {
    const numIntents = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numIntents; i++) {
      await prisma.intentLog.create({
        data: {
          callLogId: callLog.id,
          intent: intents[Math.floor(Math.random() * intents.length)],
          meta: JSON.stringify({ confidence: Math.random() * 0.3 + 0.7 })
        }
      });
    }
  }
  console.log('Created intent logs');

  // Create sample transcripts
  const samplePhrases = [
    'Hi, I would like to order some coffee.',
    'What blends do you recommend for cold brew?',
    'Do you have decaf options?',
    'I love that you support animal rescue!',
    'Can I get the House Blend in whole bean?',
    'What is your shipping policy?',
    'I want to set up a subscription.',
    'Do you offer wholesale pricing?'
  ];

  for (const callLog of callLogs.slice(0, 8)) {
    await prisma.transcript.create({
      data: {
        callLogId: callLog.id,
        text: samplePhrases[Math.floor(Math.random() * samplePhrases.length)]
      }
    });
  }
  console.log('Created sample transcripts');

  // ========================================
  // AI TOOLS - Coffee Shop Specific
  // ========================================
  const aiTools = [
    {
      name: 'getProductInfo',
      displayName: 'Get Product Info',
      description: 'Retrieve detailed information about coffee blends, single origins, and tea products',
      category: 'info',
      enabled: true
    },
    {
      name: 'getCoffeeRecommendation',
      displayName: 'Get Coffee Recommendation',
      description: 'Recommend coffee based on customer preferences (roast level, flavor notes, brewing method)',
      category: 'info',
      enabled: true
    },
    {
      name: 'getTeaRecommendation',
      displayName: 'Get Tea Recommendation',
      description: 'Recommend tea based on customer preferences (caffeine level, flavor profile)',
      category: 'info',
      enabled: true
    },
    {
      name: 'checkInventory',
      displayName: 'Check Inventory',
      description: 'Check if a specific product is in stock and available for immediate shipping',
      category: 'info',
      enabled: true
    },
    {
      name: 'getPricing',
      displayName: 'Get Pricing',
      description: 'Retrieve current pricing for products including any active discounts',
      category: 'info',
      enabled: true
    },
    {
      name: 'createOrder',
      displayName: 'Create Order',
      description: 'Create a new order for coffee or tea products',
      category: 'payment',
      enabled: true
    },
    {
      name: 'getOrderStatus',
      displayName: 'Get Order Status',
      description: 'Check the status of an existing order including shipping tracking',
      category: 'info',
      enabled: true
    },
    {
      name: 'setupSubscription',
      displayName: 'Setup Subscription',
      description: 'Set up a recurring coffee subscription with 15% discount',
      category: 'payment',
      enabled: true
    },
    {
      name: 'modifySubscription',
      displayName: 'Modify Subscription',
      description: 'Change, pause, or cancel an existing coffee subscription',
      category: 'payment',
      enabled: true
    },
    {
      name: 'getWholesaleInfo',
      displayName: 'Get Wholesale Info',
      description: 'Provide information about wholesale pricing and requirements for businesses',
      category: 'info',
      enabled: true
    },
    {
      name: 'captureWholesaleLead',
      displayName: 'Capture Wholesale Lead',
      description: 'Collect contact information from businesses interested in wholesale',
      category: 'booking',
      enabled: true
    },
    {
      name: 'getStoreHours',
      displayName: 'Get Store Hours',
      description: 'Retrieve current business hours and holiday schedules',
      category: 'general',
      enabled: true
    },
    {
      name: 'transferToHuman',
      displayName: 'Transfer to Human',
      description: 'Transfer the call to a human customer service representative',
      category: 'general',
      enabled: true
    }
  ];

  for (const tool of aiTools) {
    await prisma.aiTool.create({ data: tool });
  }
  console.log(`Created ${aiTools.length} AI tools`);

  // ========================================
  // AI AGENTS - Coffee Shop Specific
  // ========================================
  const aiAgents = [
    {
      name: 'main',
      displayName: 'Main Coffee Concierge',
      voice: 'alloy',
      language: 'en',
      systemPrompt: 'You are a friendly coffee concierge for Mangy Dog Coffee. Help customers learn about our products, place orders, and answer questions. Remember that 10% of all sales go to the AKT Foundation for animal rescue. Be warm, knowledgeable about coffee and tea, and helpful.',
      greeting: 'Thank you for calling Mangy Dog Coffee! Coffee with a bite, where 10% of all sales support animal rescue. How can I help you today?',
      tools: JSON.stringify(['getProductInfo', 'getCoffeeRecommendation', 'getTeaRecommendation', 'getPricing', 'createOrder', 'getOrderStatus', 'getStoreHours', 'transferToHuman']),
      isDefault: true,
      enabled: true
    },
    {
      name: 'sales',
      displayName: 'Sales Specialist',
      voice: 'nova',
      language: 'en',
      systemPrompt: 'You are a coffee sales specialist for Mangy Dog Coffee. Focus on helping customers find the perfect coffee or tea, upselling subscriptions for the 15% discount, and processing orders. Be enthusiastic about our products and our charitable mission.',
      greeting: 'Hi there! Ready to find your perfect brew? I can help you discover amazing coffees and even save 15% with a subscription!',
      tools: JSON.stringify(['getProductInfo', 'getCoffeeRecommendation', 'getTeaRecommendation', 'checkInventory', 'getPricing', 'createOrder', 'setupSubscription', 'modifySubscription']),
      isDefault: false,
      enabled: true
    },
    {
      name: 'wholesale',
      displayName: 'Wholesale Account Manager',
      voice: 'echo',
      language: 'en',
      systemPrompt: 'You are the wholesale account manager for Mangy Dog Coffee. Help businesses learn about our wholesale program, pricing, and requirements. Collect contact information from interested businesses and answer questions about bulk orders and private labeling.',
      greeting: 'Thank you for your interest in Mangy Dog Coffee wholesale. I can help you learn about our wholesale program and get you set up with an account.',
      tools: JSON.stringify(['getWholesaleInfo', 'captureWholesaleLead', 'getProductInfo', 'getPricing', 'transferToHuman']),
      isDefault: false,
      enabled: true
    },
    {
      name: 'spanish',
      displayName: 'Asistente en Español',
      voice: 'nova',
      language: 'es',
      systemPrompt: 'Eres un asistente amable para Mangy Dog Coffee. Ayuda a los clientes en español con información sobre productos, pedidos y preguntas. Recuerda que el 10% de todas las ventas van a la Fundación AKT para rescate de animales.',
      greeting: '¡Gracias por llamar a Mangy Dog Coffee! ¿En qué puedo ayudarle hoy?',
      tools: JSON.stringify(['getProductInfo', 'getCoffeeRecommendation', 'getPricing', 'createOrder', 'getStoreHours', 'transferToHuman']),
      isDefault: false,
      enabled: true
    }
  ];

  for (const agent of aiAgents) {
    await prisma.aiAgent.create({ data: agent });
  }
  console.log(`Created ${aiAgents.length} AI agents`);

  // ========================================
  // BRANDING - Brown Theme for Coffee Shop
  // ========================================
  await prisma.branding.upsert({
    where: { id: 'default' },
    update: {
      logoUrl: '',
      faviconUrl: '',
      primaryColor: '#92400e',   // Brown
      secondaryColor: '#78350f', // Dark Brown
      accentColor: '#b45309',    // Amber
      headingFont: 'Inter',
      bodyFont: 'Inter'
    },
    create: {
      id: 'default',
      logoUrl: '',
      faviconUrl: '',
      primaryColor: '#92400e',
      secondaryColor: '#78350f',
      accentColor: '#b45309',
      headingFont: 'Inter',
      bodyFont: 'Inter'
    }
  });
  console.log('Created branding configuration');

  // ========================================
  // STORE INFO
  // ========================================
  await prisma.storeInfo.upsert({
    where: { id: 'default' },
    update: {
      businessName: 'Mangy Dog Coffee',
      tagline: 'Coffee with a bite!',
      description: 'Specialty coffee roaster dedicated to delivering exceptional coffee while supporting animal rescue. 10% of all sales go to the AKT Foundation.',
      address: '456 Barker Street, Paw City, TX 75001',
      phone: '(555) 123-4567',
      email: 'hello@mangydogcoffee.com',
      website: 'https://www.mangydogcoffee.com',
      businessHours: 'Mon-Fri 7AM-7PM, Sat 8AM-6PM, Sun 9AM-5PM',
      timezone: 'America/Chicago'
    },
    create: {
      id: 'default',
      businessName: 'Mangy Dog Coffee',
      tagline: 'Coffee with a bite!',
      description: 'Specialty coffee roaster dedicated to delivering exceptional coffee while supporting animal rescue. 10% of all sales go to the AKT Foundation.',
      address: '456 Barker Street, Paw City, TX 75001',
      phone: '(555) 123-4567',
      email: 'hello@mangydogcoffee.com',
      website: 'https://www.mangydogcoffee.com',
      businessHours: 'Mon-Fri 7AM-7PM, Sat 8AM-6PM, Sun 9AM-5PM',
      timezone: 'America/Chicago'
    }
  });
  console.log('Created store info configuration');

  // ========================================
  // FEATURES
  // ========================================
  await prisma.features.upsert({
    where: { id: 'default' },
    update: {
      faqEnabled: true,
      stickyBarEnabled: true,
      stickyBarText: '10% of all sales supports the AKT Foundation for animal rescue!',
      stickyBarBgColor: '#92400e',
      stickyBarLink: '',
      stickyBarLinkText: '',
      liveChatEnabled: true,
      chatProvider: 'builtin',
      chatWelcomeMessage: 'Hi! Welcome to Mangy Dog Coffee. How can we help you today?',
      chatAgentName: 'Barista Support',
      chatWidgetColor: '#92400e',
      chatPosition: 'bottom-right',
      chatShowOnMobile: true,
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: false,
      orderConfirmations: true,
      marketingEmails: false,
      appointmentReminders: true,
      facebookUrl: 'https://facebook.com/mangydogcoffee',
      twitterUrl: 'https://twitter.com/mangydogcoffee',
      instagramUrl: 'https://instagram.com/mangydogcoffee',
      shareOnFacebook: true,
      shareOnTwitter: true,
      shareOnWhatsapp: true,
      shareOnEmail: true,
      copyLinkButton: true
    },
    create: {
      id: 'default',
      faqEnabled: true,
      stickyBarEnabled: true,
      stickyBarText: '10% of all sales supports the AKT Foundation for animal rescue!',
      stickyBarBgColor: '#92400e',
      stickyBarLink: '',
      stickyBarLinkText: '',
      liveChatEnabled: true,
      chatProvider: 'builtin',
      chatWelcomeMessage: 'Hi! Welcome to Mangy Dog Coffee. How can we help you today?',
      chatAgentName: 'Barista Support',
      chatWidgetColor: '#92400e',
      chatPosition: 'bottom-right',
      chatShowOnMobile: true,
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: false,
      orderConfirmations: true,
      marketingEmails: false,
      appointmentReminders: true,
      facebookUrl: 'https://facebook.com/mangydogcoffee',
      twitterUrl: 'https://twitter.com/mangydogcoffee',
      instagramUrl: 'https://instagram.com/mangydogcoffee',
      shareOnFacebook: true,
      shareOnTwitter: true,
      shareOnWhatsapp: true,
      shareOnEmail: true,
      copyLinkButton: true
    }
  });
  console.log('Created features configuration');

  // ========================================
  // PAYMENT SETTINGS
  // ========================================
  await prisma.paymentSettings.upsert({
    where: { id: 'default' },
    update: {
      enabled: false,
      stripeEnabled: false,
      stripePublishableKey: '',
      stripeTestMode: true,
      paypalEnabled: false,
      paypalClientId: '',
      paypalSandbox: true,
      squareEnabled: false,
      squareAppId: '',
      squareSandbox: true
    },
    create: {
      id: 'default',
      enabled: false,
      stripeEnabled: false,
      stripePublishableKey: '',
      stripeTestMode: true,
      paypalEnabled: false,
      paypalClientId: '',
      paypalSandbox: true,
      squareEnabled: false,
      squareAppId: '',
      squareSandbox: true
    }
  });
  console.log('Created payment settings configuration');

  console.log('');
  console.log('Mangy Dog Coffee seed data complete!');
  console.log('========================================');
  console.log('Admin URL: http://localhost:3001/admin?token=local-dev-token');
  console.log('========================================');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
