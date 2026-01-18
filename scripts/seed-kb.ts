import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface KBEntry {
  title: string;
  slug: string;
  content: string;
}

const kbEntries: KBEntry[] = [
  // ============================================
  // GENERAL INFO / FAQ
  // ============================================
  {
    title: 'About Mangy Dog Coffee',
    slug: 'about-mangy-dog-coffee',
    content: `Mangy Dog Coffee is a specialty coffee company that proudly donates 10% of all sales to the AKT Foundation.

The AKT Foundation is a 501(c)(3) nonprofit organization dedicated to providing essential household necessities to families in extreme poverty and those impacted by domestic violence.

When you purchase from Mangy Dog Coffee, you're not just getting great coffee - you're helping families in need.

Website: mangydogcoffee.com
Charity Partner: AKT Foundation (10% of all sales donated)`
  },
  {
    title: 'Pricing and Sizes',
    slug: 'pricing-and-sizes',
    content: `Mangy Dog Coffee offers coffee in multiple sizes to fit your needs:

COFFEE SIZES AND PRICES:
- 12 oz bag: $19.99
- 1 LB (16 oz) bag: $28.99
- 2 LB bag: $49.99
- 5 LB bag: $89.99
- 12 LB bulk bag: $189.99

TEA SIZES:
- 3 oz tin: $12.99

COFFEE PODS:
- 12-pack box: $17.99

SAMPLE PACKS:
- Best Sellers (3-pack): $49.99
- Flavored Coffees (5-pack): $79.99
- Single Origin Favorites (5-pack): $89.99

All prices are in USD. Visit mangydogcoffee.com to place orders.`
  },
  {
    title: 'Grind Options',
    slug: 'grind-options',
    content: `Mangy Dog Coffee offers four grind options for most coffees:

WHOLE BEAN: Best for those who grind fresh at home. Maintains freshness longest.

STANDARD GRIND: Medium grind suitable for drip coffee makers, pour-over, and most automatic brewers. This is the most popular option.

COARSE GRIND: Ideal for French press, cold brew, and percolators. Larger particles allow for longer steeping without over-extraction.

ESPRESSO GRIND: Fine grind specifically for espresso machines. Produces the concentrated, rich shots needed for espresso-based drinks.

Not sure which grind to choose? Standard grind works great for most home coffee makers.`
  },
  {
    title: 'Shipping Information',
    slug: 'shipping-information',
    content: `Mangy Dog Coffee ships throughout the United States.

For current shipping rates and delivery times, please visit mangydogcoffee.com.

Orders are typically processed within 1-2 business days. Coffee is roasted fresh to ensure maximum freshness upon arrival.

For questions about specific orders or shipping to your area, please contact us through the website.`
  },

  // ============================================
  // COFFEE BLENDS
  // ============================================
  {
    title: 'Asian Plateau Blend',
    slug: 'asian-plateau-blend',
    content: `Asian Plateau Blend - A Journey Through the East

This unique blend combines premium beans from the volcanic highlands of Indonesia with select coffees from Papua New Guinea. The result is a coffee experience that transports you to the misty mountains of Asia.

TASTING NOTES:
- Primary: Earthy, with hints of dark chocolate
- Secondary: Subtle spice notes with a smooth, full body
- Finish: Clean with lingering sweetness

ROAST LEVEL: Medium-Dark

ORIGIN: Indonesia and Papua New Guinea

BEST FOR: Those who enjoy bold, earthy coffees with complexity. Perfect for morning coffee or after dinner.

BREWING RECOMMENDATIONS: Works excellently as drip coffee, French press, or espresso.

Available in: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)
Grind options: Whole Bean, Standard, Coarse, Espresso`
  },
  {
    title: 'African Kahawa Blend',
    slug: 'african-kahawa-blend',
    content: `African Kahawa Blend - The Spirit of Africa in Every Cup

"Kahawa" means coffee in Swahili, and this blend honors the rich coffee heritage of East Africa. We've combined exceptional beans from Ethiopia, Kenya, and Tanzania to create a bright, complex cup that celebrates African coffee traditions.

TASTING NOTES:
- Primary: Bright citrus and berry notes
- Secondary: Floral aromatics with wine-like acidity
- Finish: Sweet, fruity finish with hints of cocoa

ROAST LEVEL: Medium

ORIGIN: Ethiopia, Kenya, and Tanzania

BEST FOR: Coffee enthusiasts who appreciate bright, fruity coffees. Excellent for pour-over and specialty brewing methods.

BREWING RECOMMENDATIONS: Pour-over, Chemex, or drip coffee maker to highlight the bright notes.

Available in: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)
Grind options: Whole Bean, Standard, Coarse, Espresso`
  },
  {
    title: 'House Blend',
    slug: 'house-blend',
    content: `House Blend - Our Signature Everyday Coffee

The Mangy Dog House Blend is our most popular coffee, crafted for everyday enjoyment. This balanced, approachable blend is perfect for your daily cup.

TASTING NOTES:
- Primary: Smooth, balanced with mild chocolate notes
- Secondary: Nutty undertones
- Finish: Clean, medium body with pleasant sweetness

ROAST LEVEL: Medium

BEST FOR: Daily drinking, office coffee, anyone who wants a reliable, delicious cup every time.

BREWING RECOMMENDATIONS: Versatile - great with any brewing method.

Available in: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)
Grind options: Whole Bean, Standard, Coarse, Espresso`
  },
  {
    title: 'Breakfast Blend',
    slug: 'breakfast-blend',
    content: `Breakfast Blend - Start Your Morning Right

A bright, lively blend designed to kick-start your day. Our Breakfast Blend is lighter and more vibrant than our House Blend, perfect for those who prefer a more energizing cup in the morning.

TASTING NOTES:
- Primary: Bright, crisp with citrus notes
- Secondary: Light caramel sweetness
- Finish: Clean, refreshing finish

ROAST LEVEL: Light-Medium

BEST FOR: Morning coffee lovers who want brightness without heaviness. Pairs wonderfully with breakfast foods.

BREWING RECOMMENDATIONS: Drip coffee maker, pour-over, or automatic brewer.

Available in: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)
Grind options: Whole Bean, Standard, Coarse, Espresso`
  },
  {
    title: 'Donut Shop Blend',
    slug: 'donut-shop-blend',
    content: `Donut Shop Blend - Classic American Coffee

Inspired by the classic coffee shop experience, our Donut Shop Blend delivers that familiar, comforting taste. Smooth, medium-bodied, and perfectly balanced.

TASTING NOTES:
- Primary: Smooth, mild with subtle sweetness
- Secondary: Light nutty notes
- Finish: Clean, approachable finish

ROAST LEVEL: Medium

BEST FOR: Those who love classic diner-style coffee. Perfect with donuts, pastries, or any sweet treat.

BREWING RECOMMENDATIONS: Drip coffee maker for authentic donut shop taste.

Available in: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)
Grind options: Whole Bean, Standard, Coarse, Espresso`
  },
  {
    title: 'French Roast',
    slug: 'french-roast',
    content: `French Roast - Bold and Smoky

Our darkest roast for those who love bold, intense coffee. French Roast features the signature smoky, slightly charred notes that dark roast lovers crave.

TASTING NOTES:
- Primary: Bold, smoky with dark chocolate bitterness
- Secondary: Charred, roasty notes
- Finish: Long, robust finish with low acidity

ROAST LEVEL: Dark

BEST FOR: Dark roast enthusiasts who love bold, powerful coffee. Great with cream and sugar.

BREWING RECOMMENDATIONS: French press or drip for strong, bold flavor. Excellent as espresso.

Available in: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)
Grind options: Whole Bean, Standard, Coarse, Espresso`
  },
  {
    title: 'Italian Roast',
    slug: 'italian-roast',
    content: `Italian Roast - European Sophistication

Slightly lighter than our French Roast but still bold, our Italian Roast captures the essence of European coffee culture. Rich, full-bodied, and perfect for espresso.

TASTING NOTES:
- Primary: Rich, bittersweet chocolate
- Secondary: Slight smokiness with caramel undertones
- Finish: Full-bodied, smooth finish

ROAST LEVEL: Dark

BEST FOR: Espresso lovers and those who enjoy European-style coffee. Great as a base for lattes and cappuccinos.

BREWING RECOMMENDATIONS: Espresso machine, Moka pot, or French press.

Available in: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)
Grind options: Whole Bean, Standard, Coarse, Espresso`
  },
  {
    title: 'Holiday Blend',
    slug: 'holiday-blend',
    content: `Holiday Blend - Seasonal Celebration

Our festive Holiday Blend brings warmth and cheer to your cup. Crafted with seasonal flavors that evoke cozy winter mornings and holiday gatherings.

TASTING NOTES:
- Primary: Warm spice notes
- Secondary: Rich, comforting sweetness
- Finish: Smooth, festive finish

ROAST LEVEL: Medium

BEST FOR: Holiday entertaining, gift-giving, or enjoying during the festive season.

SEASONAL AVAILABILITY: This is a limited seasonal offering.

Available in: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)
Grind options: Whole Bean, Standard, Coarse, Espresso`
  },
  {
    title: 'Cold Brew Blend',
    slug: 'cold-brew-blend',
    content: `Cold Brew Blend - Specially Crafted for Cold Brewing

This blend is specifically designed for cold brew coffee extraction. The beans are selected and roasted to produce the smoothest, most flavorful cold brew possible.

TASTING NOTES:
- Primary: Ultra-smooth with natural sweetness
- Secondary: Chocolate and caramel notes
- Finish: No bitterness, refreshingly clean

ROAST LEVEL: Medium

BEST FOR: Cold brew enthusiasts. Makes exceptional iced coffee.

BREWING RECOMMENDATIONS: Coarse grind, steep in cold water for 12-24 hours. 1 cup grounds to 4 cups water is a good starting ratio.

COLD BREW TIP: Cold brew concentrate can be diluted with water or milk to taste.

Available in: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)
Grind options: Whole Bean, Standard, Coarse, Espresso`
  },
  {
    title: 'Whiskey Barrel Aged Coffee',
    slug: 'whiskey-barrel-aged-coffee',
    content: `Whiskey Barrel Aged Coffee - A Unique Experience

Our Whiskey Barrel Aged Coffee is aged in genuine whiskey barrels, absorbing the rich, complex flavors from the wood. This is a truly unique coffee experience for adventurous coffee lovers.

TASTING NOTES:
- Primary: Rich, complex with whiskey undertones
- Secondary: Vanilla and oak notes from barrel aging
- Finish: Smooth, with a warm, spirited finish

ROAST LEVEL: Medium-Dark

IMPORTANT: This coffee is non-alcoholic. The beans absorb flavor from the barrel, not alcohol.

BEST FOR: Coffee enthusiasts looking for something unique. Great as an after-dinner coffee or special occasion treat.

BREWING RECOMMENDATIONS: French press or pour-over to appreciate the complex flavors.

Available in: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)
Grind options: Whole Bean, Standard, Coarse, Espresso`
  },
  {
    title: 'Max Caf High Caffeine Coffee',
    slug: 'max-caf-high-caffeine',
    content: `Max Caf - Maximum Caffeine for Maximum Energy

Need an extra boost? Max Caf is our high-caffeine blend, delivering significantly more caffeine than regular coffee. Perfect for early mornings, late nights, or whenever you need serious energy.

TASTING NOTES:
- Primary: Bold, robust flavor
- Secondary: Smooth despite the extra kick
- Finish: Clean energy without jitters

ROAST LEVEL: Medium

CAFFEINE CONTENT: Significantly higher than regular coffee

BEST FOR: Those who need extra caffeine, early risers, night shift workers, or anyone who wants maximum energy.

CAUTION: Contains high caffeine. Not recommended for those sensitive to caffeine.

Available in: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)
Grind options: Whole Bean, Standard, Coarse, Espresso`
  },
  {
    title: 'Kopi Safari Blend',
    slug: 'kopi-safari-blend',
    content: `Kopi Safari - An Exotic Journey

Kopi Safari takes you on a wild adventure through coffee-growing regions. This exotic blend combines beans from various origins for a complex, adventurous cup.

TASTING NOTES:
- Primary: Exotic, complex flavor profile
- Secondary: Wild, adventurous notes
- Finish: Intriguing, memorable finish

ROAST LEVEL: Medium

BEST FOR: Coffee explorers who want something different and exciting.

Available in: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)
Grind options: Whole Bean, Standard, Coarse, Espresso`
  },
  {
    title: 'Instant Coffee',
    slug: 'instant-coffee',
    content: `Mangy Dog Instant Coffee - Quality Made Convenient

For those times when you need great coffee fast, our Instant Coffee delivers Mangy Dog quality in seconds. Just add hot water.

FEATURES:
- Made from premium Mangy Dog Coffee beans
- Dissolves instantly in hot or cold water
- Perfect for travel, camping, or office use
- No equipment needed

BREWING: Add 1-2 teaspoons to 8 oz hot water. Adjust to taste. Can also be used for iced coffee with cold water.

BEST FOR: Travelers, campers, office workers, or anyone who wants quality coffee without the wait.

Available in convenient packaging. Visit mangydogcoffee.com for current sizes and pricing.`
  },

  // ============================================
  // MUSHROOM COFFEES
  // ============================================
  {
    title: 'Mushroom Coffee - Lions Mane',
    slug: 'mushroom-coffee-lions-mane',
    content: `Mushroom Coffee with Lions Mane - Focus and Clarity

Our Lions Mane Mushroom Coffee combines premium coffee with Lions Mane mushroom extract for enhanced focus and mental clarity.

BENEFITS:
- Lions Mane is known for cognitive support
- May help with focus and mental clarity
- Balanced energy without jitters

TASTING NOTES:
- Smooth coffee flavor
- Subtle earthy undertones from mushrooms
- Not "mushroomy" tasting

BEST FOR: Those seeking cognitive support, students, professionals, anyone wanting enhanced focus.

Available in: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)
Grind options: Whole Bean, Standard, Coarse, Espresso`
  },
  {
    title: 'Mushroom Coffee - Chaga',
    slug: 'mushroom-coffee-chaga',
    content: `Mushroom Coffee with Chaga - Immune Support

Our Chaga Mushroom Coffee blends premium coffee with Chaga mushroom extract, known for its immune-supporting properties.

BENEFITS:
- Chaga is traditionally used for immune support
- Rich in antioxidants
- Smooth, balanced energy

TASTING NOTES:
- Rich coffee flavor
- Mild earthy notes
- Smooth finish

BEST FOR: Those interested in immune support and overall wellness.

Available in: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)
Grind options: Whole Bean, Standard, Coarse, Espresso`
  },
  {
    title: 'Mushroom Coffee - Reishi',
    slug: 'mushroom-coffee-reishi',
    content: `Mushroom Coffee with Reishi - Calm and Relaxation

Our Reishi Mushroom Coffee combines premium coffee with Reishi mushroom extract for a calming, balanced experience.

BENEFITS:
- Reishi is known for promoting calm and relaxation
- May help with stress management
- Gentle energy without overstimulation

TASTING NOTES:
- Smooth coffee base
- Subtle earthy complexity
- Calming finish

BEST FOR: Those seeking a calming coffee experience, stress management, or a gentler caffeine effect.

Available in: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)
Grind options: Whole Bean, Standard, Coarse, Espresso`
  },
  {
    title: 'Mushroom Coffee - Cordyceps',
    slug: 'mushroom-coffee-cordyceps',
    content: `Mushroom Coffee with Cordyceps - Energy and Performance

Our Cordyceps Mushroom Coffee blends premium coffee with Cordyceps mushroom extract for enhanced energy and physical performance.

BENEFITS:
- Cordyceps is known for energy and endurance support
- May enhance physical performance
- Sustained energy throughout the day

TASTING NOTES:
- Bold coffee flavor
- Clean, energizing finish
- Subtle earthy notes

BEST FOR: Athletes, fitness enthusiasts, and anyone seeking enhanced energy and stamina.

Available in: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)
Grind options: Whole Bean, Standard, Coarse, Espresso`
  },

  // ============================================
  // SINGLE ORIGIN COFFEES
  // ============================================
  {
    title: 'Bali Blue Moon - Single Origin',
    slug: 'bali-blue-moon',
    content: `Bali Blue Moon - Indonesian Paradise

From the volcanic highlands of Bali, this exceptional single-origin coffee is grown in rich volcanic soil at high elevations. Bali Blue Moon is known for its smooth, full-bodied character.

ORIGIN: Kintamani Highlands, Bali, Indonesia
ALTITUDE: 1,200-1,600 meters
PROCESS: Wet-hulled (Semi-washed)

TASTING NOTES:
- Primary: Dark chocolate and molasses
- Secondary: Earthy undertones with hints of vanilla
- Finish: Smooth, syrupy body with low acidity

ROAST LEVEL: Medium-Dark

BEST FOR: Those who enjoy smooth, earthy Indonesian coffees. Excellent for French press and espresso.

Available in: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)
Grind options: Whole Bean, Standard, Coarse, Espresso
Also available in Coffee Pods: 12-pack ($17.99)`
  },
  {
    title: 'Brazil Santos - Single Origin',
    slug: 'brazil-santos',
    content: `Brazil Santos - South American Classic

Brazil is the world's largest coffee producer, and our Brazil Santos represents the best of what this coffee giant has to offer. Smooth, nutty, and incredibly approachable.

ORIGIN: Santos region, Brazil
ALTITUDE: 800-1,200 meters
PROCESS: Natural (Dry)

TASTING NOTES:
- Primary: Nutty with milk chocolate sweetness
- Secondary: Subtle fruit notes with caramel
- Finish: Low acidity, smooth and creamy

ROAST LEVEL: Medium

BEST FOR: Daily drinking, great base for espresso blends. Perfect for those who prefer low-acid coffee.

Available in: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)
Grind options: Whole Bean, Standard, Coarse, Espresso`
  },
  {
    title: 'Colombia Supremo - Single Origin',
    slug: 'colombia-supremo',
    content: `Colombia Supremo - The Gold Standard

Colombian coffee sets the standard for balanced, approachable coffee. Our Colombia Supremo features the largest, most premium beans (Supremo grade) for exceptional quality.

ORIGIN: Huila region, Colombia
ALTITUDE: 1,400-1,800 meters
PROCESS: Washed

TASTING NOTES:
- Primary: Bright, balanced with caramel sweetness
- Secondary: Citrus notes with nutty undertones
- Finish: Clean, medium body with pleasant acidity

ROAST LEVEL: Medium

BEST FOR: Coffee lovers who appreciate classic, balanced coffee. Versatile for any brewing method.

Available in: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)
Grind options: Whole Bean, Standard, Coarse, Espresso`
  },
  {
    title: 'Costa Rica Tarrazu - Single Origin',
    slug: 'costa-rica-tarrazu',
    content: `Costa Rica Tarrazu - Central American Excellence

The Tarrazu region of Costa Rica produces some of the world's most sought-after coffee. Grown in volcanic soil at high altitude, this coffee delivers bright, clean flavors.

ORIGIN: Tarrazu region, Costa Rica
ALTITUDE: 1,200-1,700 meters
PROCESS: Washed

TASTING NOTES:
- Primary: Bright, crisp with honey sweetness
- Secondary: Stone fruit and citrus notes
- Finish: Clean, vibrant finish with medium body

ROAST LEVEL: Medium

BEST FOR: Those who love bright, clean coffees. Excellent for pour-over and drip methods.

Available in: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)
Grind options: Whole Bean, Standard, Coarse, Espresso`
  },
  {
    title: 'Ethiopia Yirgacheffe - Single Origin',
    slug: 'ethiopia-yirgacheffe',
    content: `Ethiopia Yirgacheffe - The Birthplace of Coffee

Ethiopia is the birthplace of coffee, and Yirgacheffe is among its most celebrated regions. This is coffee at its most vibrant and floral - a must-try for coffee enthusiasts.

ORIGIN: Yirgacheffe region, Ethiopia
ALTITUDE: 1,700-2,200 meters
PROCESS: Washed

TASTING NOTES:
- Primary: Bright, floral with jasmine notes
- Secondary: Citrus, bergamot, and stone fruit
- Finish: Wine-like acidity with tea-like body

ROAST LEVEL: Light-Medium

BEST FOR: Coffee connoisseurs who appreciate complex, floral coffees. Best as pour-over to highlight nuanced flavors.

BREWING TIP: Use slightly cooler water (195-200°F) to preserve delicate flavors.

Available in: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)
Grind options: Whole Bean, Standard, Coarse, Espresso`
  },
  {
    title: 'Guatemala Antigua - Single Origin',
    slug: 'guatemala-antigua',
    content: `Guatemala Antigua - Volcanic Excellence

Grown in the shadow of volcanoes, Guatemala Antigua is known for its complex flavor profile and exceptional quality. The volcanic soil and high altitude create truly special coffee.

ORIGIN: Antigua region, Guatemala
ALTITUDE: 1,500-1,700 meters
PROCESS: Washed

TASTING NOTES:
- Primary: Rich chocolate with smoky undertones
- Secondary: Spice notes with subtle fruit
- Finish: Full body with pleasant cocoa finish

ROAST LEVEL: Medium

BEST FOR: Those who enjoy rich, complex coffees. Excellent as espresso or French press.

Available in: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)
Grind options: Whole Bean, Standard, Coarse, Espresso`
  },
  {
    title: 'Honduras - Single Origin',
    slug: 'honduras-single-origin',
    content: `Honduras - Central American Gem

Honduras has quietly become one of the top coffee producers in Central America. Our Honduran coffee offers exceptional value with bright, balanced flavors.

ORIGIN: Honduras
ALTITUDE: 1,100-1,600 meters
PROCESS: Washed

TASTING NOTES:
- Primary: Caramel sweetness with citrus brightness
- Secondary: Subtle stone fruit notes
- Finish: Clean, balanced finish

ROAST LEVEL: Medium

BEST FOR: Daily drinking, excellent value. Great for any brewing method.

Available in: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)
Grind options: Whole Bean, Standard, Coarse, Espresso`
  },
  {
    title: 'Mexico Chiapas - Single Origin',
    slug: 'mexico-chiapas',
    content: `Mexico Chiapas - Southern Border Excellence

From the Chiapas highlands near the Guatemala border, this Mexican coffee offers a smooth, balanced cup with pleasant nutty notes.

ORIGIN: Chiapas region, Mexico
ALTITUDE: 900-1,500 meters
PROCESS: Washed

TASTING NOTES:
- Primary: Nutty with light chocolate
- Secondary: Mild citrus undertones
- Finish: Smooth, light body with gentle finish

ROAST LEVEL: Medium

BEST FOR: Those who enjoy smooth, approachable coffee. Great for everyday drinking.

Available in: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)
Grind options: Whole Bean, Standard, Coarse, Espresso
Also available in Coffee Pods: 12-pack ($17.99)`
  },
  {
    title: 'Nicaragua - Single Origin',
    slug: 'nicaragua-single-origin',
    content: `Nicaragua - Central American Brightness

Nicaraguan coffee is celebrated for its bright acidity and complex fruit notes. This single origin showcases the best of Central American coffee.

ORIGIN: Nicaragua
ALTITUDE: 1,100-1,500 meters
PROCESS: Washed

TASTING NOTES:
- Primary: Bright, fruity with citrus notes
- Secondary: Honey sweetness with floral hints
- Finish: Balanced acidity with clean finish

ROAST LEVEL: Medium

BEST FOR: Those who appreciate bright, fruity coffees.

Available in: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)
Grind options: Whole Bean, Standard, Coarse, Espresso`
  },
  {
    title: 'Papua New Guinea - Single Origin',
    slug: 'papua-new-guinea',
    content: `Papua New Guinea - Pacific Island Treasure

From the remote highlands of Papua New Guinea, this exotic coffee delivers a unique flavor profile. Grown by small-holder farmers using traditional methods.

ORIGIN: Eastern Highlands, Papua New Guinea
ALTITUDE: 1,400-1,800 meters
PROCESS: Washed

TASTING NOTES:
- Primary: Tropical fruit with earthy undertones
- Secondary: Brown sugar sweetness
- Finish: Full body with complex finish

ROAST LEVEL: Medium

BEST FOR: Adventurous coffee drinkers looking for something unique.

Available in: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)
Grind options: Whole Bean, Standard, Coarse, Espresso`
  },
  {
    title: 'Peru - Single Origin',
    slug: 'peru-single-origin',
    content: `Peru - South American Smoothness

Peruvian coffee is known for its mild, smooth character and balanced sweetness. Grown in the Andes Mountains, this coffee is perfect for those who enjoy gentle, approachable flavors.

ORIGIN: Chanchamayo region, Peru
ALTITUDE: 1,200-1,800 meters
PROCESS: Washed

TASTING NOTES:
- Primary: Mild, smooth with caramel notes
- Secondary: Subtle citrus and nut
- Finish: Clean, balanced finish with light body

ROAST LEVEL: Medium

BEST FOR: Those who prefer milder, smoother coffee. Excellent for everyday drinking.

Available in: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)
Grind options: Whole Bean, Standard, Coarse, Espresso
Also available in Coffee Pods: 12-pack ($17.99)`
  },
  {
    title: 'Peru Decaf - Single Origin Decaffeinated',
    slug: 'peru-decaf',
    content: `Peru Decaf - All the Flavor, No Caffeine

Our Peru Decaf uses the Swiss Water Process for 99.9% caffeine-free coffee that retains all the delicious flavor of our regular Peruvian coffee.

ORIGIN: Peru
DECAF PROCESS: Swiss Water Process (chemical-free)
CAFFEINE: 99.9% caffeine-free

TASTING NOTES:
- Primary: Smooth, mild with chocolate notes
- Secondary: Subtle sweetness
- Finish: Clean, balanced finish

ROAST LEVEL: Medium

SWISS WATER PROCESS: This chemical-free decaffeination method uses only water to remove caffeine while preserving flavor.

BEST FOR: Those who want great coffee without caffeine. Perfect for evening drinking.

Available in: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)
Grind options: Whole Bean, Standard, Coarse, Espresso`
  },
  {
    title: 'Tanzania Peaberry - Single Origin',
    slug: 'tanzania-peaberry',
    content: `Tanzania Peaberry - African Gem

Peaberry beans are a rare treat - they're single, round beans rather than the usual flat-sided pair. This creates a more concentrated, intense flavor. Our Tanzania Peaberry is bright and complex.

ORIGIN: Mt. Kilimanjaro region, Tanzania
ALTITUDE: 1,400-1,800 meters
PROCESS: Washed

WHAT IS PEABERRY? About 5% of coffee cherries produce a single, round bean instead of two. These "peaberries" roast more evenly and have concentrated flavor.

TASTING NOTES:
- Primary: Bright wine-like acidity with berry notes
- Secondary: Black tea and citrus
- Finish: Complex, lingering finish

ROAST LEVEL: Medium

BEST FOR: Coffee enthusiasts looking for unique, complex flavors. Great for pour-over.

Available in: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)
Grind options: Whole Bean, Standard, Coarse, Espresso`
  },
  {
    title: 'Sumatra Mandheling - Single Origin',
    slug: 'sumatra-mandheling',
    content: `Sumatra Mandheling - Indonesian Bold

From the highlands of Sumatra, Mandheling is one of the world's most distinctive coffees. Known for its bold, earthy character and low acidity, this is a coffee that makes a statement.

ORIGIN: Mandheling region, Sumatra, Indonesia
ALTITUDE: 750-1,500 meters
PROCESS: Wet-hulled (Giling Basah)

TASTING NOTES:
- Primary: Bold, earthy with herbal notes
- Secondary: Dark chocolate and cedar
- Finish: Full body, low acidity, lingering earthiness

ROAST LEVEL: Medium-Dark

BEST FOR: Those who love bold, earthy coffees. Excellent for French press and espresso.

Available in: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)
Grind options: Whole Bean, Standard, Coarse, Espresso`
  },
  {
    title: 'Kenya AA - Single Origin',
    slug: 'kenya-aa',
    content: `Kenya AA - African Excellence

Kenya AA represents the highest grade of Kenyan coffee, known for its complex, wine-like character. This is coffee for those who appreciate bold, bright flavors.

ORIGIN: Central Kenya highlands
ALTITUDE: 1,400-2,000 meters
PROCESS: Washed

WHAT IS AA? "AA" is the largest grade of Kenyan coffee beans, indicating premium quality.

TASTING NOTES:
- Primary: Bright, wine-like with berry and citrus
- Secondary: Black currant and tomato-like acidity
- Finish: Complex, bold finish with juicy body

ROAST LEVEL: Medium

BEST FOR: Coffee connoisseurs who appreciate complex, bold flavors. Best as pour-over.

Available in: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)
Grind options: Whole Bean, Standard, Coarse, Espresso`
  },
  {
    title: 'Uganda Bugisu - Single Origin',
    slug: 'uganda-bugisu',
    content: `Uganda Bugisu - East African Discovery

From the slopes of Mt. Elgon in Uganda, Bugisu coffee is a hidden gem of East African coffee. Rich, complex, and increasingly recognized for its quality.

ORIGIN: Bugisu region, Mt. Elgon, Uganda
ALTITUDE: 1,500-2,000 meters
PROCESS: Washed

TASTING NOTES:
- Primary: Rich, chocolatey with wine-like notes
- Secondary: Berry and citrus undertones
- Finish: Full body with pleasant finish

ROAST LEVEL: Medium

BEST FOR: Those looking to explore lesser-known origins. Rich and rewarding.

Available in: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)
Grind options: Whole Bean, Standard, Coarse, Espresso`
  },

  // ============================================
  // FLAVORED COFFEES
  // ============================================
  {
    title: 'Flavored Coffees Overview',
    slug: 'flavored-coffees',
    content: `Mangy Dog Flavored Coffees - Delicious Variety

We offer a range of delicious flavored coffees for those who enjoy added sweetness and variety in their cup. Our flavored coffees use quality beans with natural and artificial flavorings.

AVAILABLE FLAVORS:
- Vanilla
- Hazelnut
- Caramel
- Chocolate
- French Vanilla
- Southern Pecan
- Cinnamon
- Mocha
- Butter Pecan
- Pumpkin Spice (seasonal)

BREWING TIPS FOR FLAVORED COFFEE:
- Clean your grinder between flavored and unflavored coffees
- Works great in drip machines and French press
- Add cream to enhance the flavor notes

All flavored coffees available in: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)
Grind options: Whole Bean, Standard, Coarse, Espresso`
  },

  // ============================================
  // TEAS
  // ============================================
  {
    title: 'Tea Collection Overview',
    slug: 'tea-collection',
    content: `Mangy Dog Tea Collection - Premium Loose Leaf Teas

Beyond our coffee selection, we offer a carefully curated collection of premium loose leaf teas from around the world.

TEA COLLECTION INCLUDES:
- Jasmine Green Tea - Fragrant Chinese green tea
- Masala Chai - Traditional Indian spiced tea
- English Breakfast - Classic British black tea
- Peach Paradise - Fruity black tea
- Mango Treat - Tropical fruit tea
- Apple Cider Rooibos - Caffeine-free South African
- Hibiscus Berry - Tart, fruity herbal
- Earl Grey - Bergamot-scented black tea
- Moroccan Mint - Refreshing green tea
- Hojicha - Roasted Japanese green tea
- Matcha - Premium Japanese green tea powder

All teas come in 3oz tins for $12.99.

BREWING TIP: Different teas need different water temperatures. Green teas prefer 160-180°F, while black teas can take boiling water (212°F).`
  },
  {
    title: 'Jasmine Green Tea',
    slug: 'jasmine-green-tea',
    content: `Jasmine Green Tea - Fragrant and Floral

Traditional Chinese green tea scented with fresh jasmine blossoms. The delicate floral aroma creates a soothing, elegant tea experience.

TYPE: Green Tea (Scented)
ORIGIN: China

TASTING NOTES:
- Delicate jasmine floral notes
- Light, refreshing green tea base
- Subtle sweetness

CAFFEINE: Moderate (less than coffee)

BREWING:
- Water temp: 175°F (80°C)
- Steep time: 2-3 minutes
- Can be re-steeped 2-3 times

BEST FOR: Afternoon tea, relaxation, pairing with light meals.

Available in: 3oz tin ($12.99)`
  },
  {
    title: 'Masala Chai',
    slug: 'masala-chai',
    content: `Masala Chai - Traditional Indian Spiced Tea

Authentic Indian chai blend with black tea and warming spices including cinnamon, cardamom, ginger, and cloves.

TYPE: Black Tea (Spiced)
ORIGIN: India

TASTING NOTES:
- Warming spice blend
- Rich, robust black tea base
- Sweet and aromatic

CAFFEINE: Moderate to High

BREWING:
- Water temp: 212°F (100°C)
- Steep time: 3-5 minutes
- Traditional: Simmer with milk and sweeten to taste

BEST FOR: Morning energy, cold weather comfort, making traditional chai lattes.

Available in: 3oz tin ($12.99)`
  },
  {
    title: 'English Breakfast Tea',
    slug: 'english-breakfast-tea',
    content: `English Breakfast Tea - Classic British Tradition

A robust, full-bodied black tea blend perfect for starting your day. This classic blend stands up well to milk and sugar.

TYPE: Black Tea Blend
ORIGIN: India, Ceylon, Kenya blend

TASTING NOTES:
- Bold, malty character
- Robust and full-bodied
- Slight astringency

CAFFEINE: High

BREWING:
- Water temp: 212°F (100°C)
- Steep time: 3-5 minutes
- Excellent with milk and sugar

BEST FOR: Morning tea, breakfast pairing, British tea traditions.

Available in: 3oz tin ($12.99)`
  },
  {
    title: 'Earl Grey Tea',
    slug: 'earl-grey-tea',
    content: `Earl Grey - Bergamot-Scented Classic

A sophisticated black tea scented with bergamot oil. Earl Grey's distinctive citrus aroma makes it one of the world's most beloved tea varieties.

TYPE: Black Tea (Scented)
ORIGIN: India/China blend with Italian bergamot

TASTING NOTES:
- Distinctive bergamot citrus aroma
- Smooth black tea base
- Floral and refreshing

CAFFEINE: Moderate to High

BREWING:
- Water temp: 200-212°F (93-100°C)
- Steep time: 3-4 minutes
- Can be enjoyed plain or with a splash of milk

BEST FOR: Afternoon tea, sophisticated occasions, Earl Grey lattes.

Available in: 3oz tin ($12.99)`
  },
  {
    title: 'Moroccan Mint Tea',
    slug: 'moroccan-mint-tea',
    content: `Moroccan Mint - Refreshing North African Tradition

A refreshing blend of Chinese gunpowder green tea and spearmint, inspired by traditional Moroccan hospitality.

TYPE: Green Tea with Mint
ORIGIN: Chinese green tea with spearmint

TASTING NOTES:
- Bright, refreshing mint
- Light green tea base
- Naturally sweet

CAFFEINE: Moderate

BREWING:
- Water temp: 175-185°F (80-85°C)
- Steep time: 2-3 minutes
- Traditional: Add sugar and serve in small glasses

BEST FOR: Hot or iced, after meals, digestive aid.

Available in: 3oz tin ($12.99)`
  },
  {
    title: 'Matcha Green Tea',
    slug: 'matcha-green-tea',
    content: `Matcha - Premium Japanese Green Tea Powder

High-quality Japanese matcha made from shade-grown green tea leaves ground into a fine powder. Rich in antioxidants and provides calm, sustained energy.

TYPE: Green Tea Powder
ORIGIN: Japan

TASTING NOTES:
- Vegetal, grassy notes
- Umami richness
- Subtle sweetness with mild bitterness

CAFFEINE: High (but releases slowly)

PREPARATION:
- Sift 1-2 teaspoons into a bowl
- Add 2-3 oz hot water (170°F/76°C)
- Whisk vigorously with bamboo whisk until frothy
- Can also blend into lattes and smoothies

HEALTH BENEFITS: Rich in antioxidants (EGCG), L-theanine for calm focus, metabolism support.

BEST FOR: Morning energy, pre-workout, meditation practice, matcha lattes.

Available in: 3oz tin ($12.99)`
  },
  {
    title: 'Hojicha Roasted Green Tea',
    slug: 'hojicha-tea',
    content: `Hojicha - Japanese Roasted Green Tea

Unique Japanese green tea that has been roasted, giving it a warm, toasty flavor unlike any other green tea. Lower in caffeine than other green teas.

TYPE: Roasted Green Tea
ORIGIN: Japan

TASTING NOTES:
- Warm, toasty, caramel notes
- Smooth, mellow character
- No bitterness

CAFFEINE: Low (great for evenings)

BREWING:
- Water temp: 175-195°F (80-90°C)
- Steep time: 30 seconds to 1 minute
- Can be re-steeped multiple times

BEST FOR: Evening drinking, coffee lovers transitioning to tea, unique flavor seekers.

Available in: 3oz tin ($12.99)`
  },
  {
    title: 'Apple Cider Rooibos Tea',
    slug: 'apple-cider-rooibos',
    content: `Apple Cider Rooibos - Caffeine-Free Comfort

A cozy, caffeine-free blend combining South African rooibos with apple and warm spices. Perfect for fall and winter evenings.

TYPE: Herbal (Caffeine-Free)
BASE: South African Rooibos

TASTING NOTES:
- Apple cider flavor
- Warm cinnamon and spice
- Natural sweetness from rooibos

CAFFEINE: None (100% caffeine-free)

BREWING:
- Water temp: 212°F (100°C)
- Steep time: 5-7 minutes
- Great with honey

BEST FOR: Evening drinking, children, anyone avoiding caffeine, fall/winter comfort.

Available in: 3oz tin ($12.99)`
  },
  {
    title: 'Hibiscus Berry Tea',
    slug: 'hibiscus-berry-tea',
    content: `Hibiscus Berry - Tart and Fruity

A vibrant, caffeine-free herbal blend featuring hibiscus flowers and mixed berries. Beautiful ruby-red color and refreshingly tart.

TYPE: Herbal (Caffeine-Free)
INGREDIENTS: Hibiscus, berry blend

TASTING NOTES:
- Tart, cranberry-like hibiscus
- Sweet berry notes
- Refreshingly tangy

CAFFEINE: None (100% caffeine-free)

BREWING:
- Water temp: 212°F (100°C)
- Steep time: 5-7 minutes
- Excellent iced or hot

HEALTH NOTE: Hibiscus is known for its antioxidant properties.

BEST FOR: Hot or iced, any time of day, beautiful presentation.

Available in: 3oz tin ($12.99)`
  },
  {
    title: 'Peach Paradise Tea',
    slug: 'peach-paradise-tea',
    content: `Peach Paradise - Sweet and Fruity

A delightful black tea blend with sweet peach flavor. Refreshing and aromatic, perfect for peach lovers.

TYPE: Flavored Black Tea
BASE: Ceylon black tea with peach

TASTING NOTES:
- Sweet peach aroma
- Smooth black tea base
- Juicy fruit finish

CAFFEINE: Moderate

BREWING:
- Water temp: 200-212°F (93-100°C)
- Steep time: 3-4 minutes
- Excellent iced

BEST FOR: Summer iced tea, fruit tea lovers, afternoon refreshment.

Available in: 3oz tin ($12.99)`
  },
  {
    title: 'Mango Treat Tea',
    slug: 'mango-treat-tea',
    content: `Mango Treat - Tropical Escape

Transport yourself to the tropics with this exotic mango-flavored tea blend. Sweet, fruity, and utterly delicious.

TYPE: Flavored Black/Green Tea Blend
FLAVOR: Tropical mango

TASTING NOTES:
- Sweet, ripe mango
- Tropical fruit notes
- Light, refreshing

CAFFEINE: Moderate

BREWING:
- Water temp: 195-205°F (90-96°C)
- Steep time: 3-4 minutes
- Perfect over ice

BEST FOR: Summer sipping, tropical flavor lovers, iced tea.

Available in: 3oz tin ($12.99)`
  },

  // ============================================
  // SAMPLE PACKS
  // ============================================
  {
    title: 'Best Sellers Sample Pack',
    slug: 'best-sellers-sample-pack',
    content: `Best Sellers Sample Pack - Try Our Most Popular Coffees

Can't decide? Our Best Sellers Sample Pack includes three of our most popular coffees so you can find your favorite.

INCLUDES:
- House Blend (12oz)
- Colombia Supremo (12oz)
- Peru (12oz)

Total: 3 bags / 36oz of premium coffee

PRICE: $49.99 (Save vs. buying individually!)

PERFECT FOR:
- New customers wanting to explore
- Gift giving
- Finding your perfect coffee

Each coffee comes in your choice of grind: Whole Bean, Standard, Coarse, or Espresso.`
  },
  {
    title: 'Flavored Coffees Sample Pack',
    slug: 'flavored-coffees-sample-pack',
    content: `Flavored Coffees Sample Pack - A Sweet Selection

Love flavored coffee? This pack includes five of our most popular flavored varieties.

INCLUDES:
- French Vanilla (12oz)
- Hazelnut (12oz)
- Caramel (12oz)
- Southern Pecan (12oz)
- Mocha (12oz)

Total: 5 bags / 60oz of flavored coffee

PRICE: $79.99 (Save vs. buying individually!)

PERFECT FOR:
- Flavored coffee lovers
- Variety seekers
- Gift giving

Each coffee comes in your choice of grind: Whole Bean, Standard, Coarse, or Espresso.`
  },
  {
    title: 'Single Origin Favorites Sample Pack',
    slug: 'single-origin-favorites-sample-pack',
    content: `Single Origin Favorites Sample Pack - A World Tour of Coffee

Explore the world of single origin coffee with five exceptional coffees from different regions.

INCLUDES:
- Colombia Supremo (12oz)
- Ethiopia Yirgacheffe (12oz)
- Sumatra Mandheling (12oz)
- Guatemala Antigua (12oz)
- Kenya AA (12oz)

Total: 5 bags / 60oz of single origin coffee

PRICE: $89.99 (Save vs. buying individually!)

PERFECT FOR:
- Coffee enthusiasts
- Those wanting to explore origins
- Understanding different flavor profiles
- Premium gift giving

Each coffee comes in your choice of grind: Whole Bean, Standard, Coarse, or Espresso.`
  },

  // ============================================
  // BREWING TIPS
  // ============================================
  {
    title: 'Coffee Brewing Tips and Recommendations',
    slug: 'brewing-tips',
    content: `Coffee Brewing Tips - Get the Best Cup Every Time

BASIC BREWING RATIO:
Use 2 tablespoons (10-12 grams) of ground coffee per 6 ounces of water. Adjust to taste.

WATER TEMPERATURE:
- Ideal range: 195-205°F (90-96°C)
- Too hot (boiling) can make coffee bitter
- Too cold won't extract properly

WATER QUALITY:
Use filtered water for best results. Hard water or chlorinated water can affect taste.

BREWING METHODS:

DRIP COFFEE MAKER:
- Use Standard grind
- Pre-wet filter to remove paper taste
- Don't leave coffee on hot plate too long

FRENCH PRESS:
- Use Coarse grind
- Steep 4 minutes
- Press slowly to avoid sediment

POUR-OVER (Chemex, V60):
- Use Standard to Medium-Fine grind
- Bloom coffee with small amount of water first
- Pour in slow, circular motions

ESPRESSO:
- Use Espresso (fine) grind
- Tamp evenly with consistent pressure
- Extract for 25-30 seconds

COLD BREW:
- Use Coarse grind
- Steep 12-24 hours in cold water
- Ratio: 1 cup grounds to 4 cups water
- Dilute concentrate to taste

STORAGE TIPS:
- Store in airtight container
- Keep away from light, heat, and moisture
- Don't refrigerate or freeze opened bags
- Use within 2-4 weeks of opening

FRESHNESS:
- Whole beans stay fresh longer than ground
- Grind just before brewing for best flavor
- Coffee is best 3-14 days after roasting`
  }
];

async function seedKnowledgeBase() {
  console.log('Starting Knowledge Base seeding...\n');

  for (const entry of kbEntries) {
    try {
      // Check if entry already exists
      const existing = await prisma.knowledgeDoc.findUnique({
        where: { slug: entry.slug }
      });

      if (existing) {
        console.log(`Updating: ${entry.title}`);
        await prisma.knowledgeDoc.update({
          where: { slug: entry.slug },
          data: {
            title: entry.title,
            content: entry.content
          }
        });
      } else {
        console.log(`Creating: ${entry.title}`);
        await prisma.knowledgeDoc.create({
          data: {
            title: entry.title,
            slug: entry.slug,
            language: 'en',
            content: entry.content
          }
        });
      }
    } catch (err) {
      console.error(`Failed to create/update: ${entry.title}`, err);
    }
  }

  console.log(`\nSeeding complete! ${kbEntries.length} Knowledge Base entries processed.`);
  console.log('\nNote: You may need to re-index the Knowledge Base to generate embeddings.');
  console.log('Visit the admin panel at /admin/kb to trigger re-indexing.');
}

seedKnowledgeBase()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
