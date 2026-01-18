import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// All unique Mangy Dog Coffee products from CSV
const products = [
  // BLENDS
  {
    title: "Asian Plateau Blend",
    slug: "asian-plateau-blend",
    content: `Asian Plateau Blend - A medium roast containing blended coffees of Southeast Asia offering herbal flavor notes and a heavy body. This coffee offers consistent flavor, a strong aroma and is best as a hot coffee drink. Grown under the full sun with washed processing that is environmentally friendly.

Type: Blend
Vendor: Mangy Dog Coffee

Available Grinds: Espresso, Standard, Whole Bean
Available Sizes: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99)`
  },
  {
    title: "African Kahawa Blend",
    slug: "african-kahawa-blend",
    content: `African Kahawa Blend - A very complex medium-dark roast of bright full flavor African grown coffees. Enjoy hints of toffee, caramel, chocolate, raisins, green apples, red fruits and even hints of cherries and black currant with a soft floral finish. Coffee cherries are often processed by hand at the home of the farmers after being hand picked. Quality standards are high and farmers adhere to these strict standards with environmentally friendly processing, washing the beans and leaving in the sun to dry, then hand sorting and packaging.

Type: Blend
Vendor: Mangy Dog Coffee

Available Grinds: Espresso, Standard, Whole Bean
Available Sizes: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99)`
  },
  {
    title: "House Blend",
    slug: "house-blend",
    content: `House Blend - A medium roast blend of select coffees from Central and South America that is smooth, clean and consistent for a flavorful cup every time. Features a medium body with tasting notes that include nutty, sweet chocolate, mild citrus and a clean bright finish. These blended coffees are both natural/dry processed and wet mill washed/sun dried. These techniques are friendly to the environment, the rain forests and the living creatures of the high elevation mountains where these coffees are grown.

Type: Blend
Vendor: Mangy Dog Coffee

Available Grinds: Espresso, Standard, Whole Bean
Available Sizes: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99)`
  },
  {
    title: "Breakfast Blend",
    slug: "breakfast-blend",
    content: `Breakfast Blend - A lightly roasted blend of South American coffees that are perfect as an early sunrise roast. Tasting notes include walnuts, mild apple, slight raisin and toffee. Environmentally friendly washed processing and sun dried. This coffee is both partial sun and full sun grown at high mountain elevations.

Type: Blend
Vendor: Mangy Dog Coffee

Available Grinds: Espresso, Standard, Whole Bean
Available Sizes: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99)`
  },
  {
    title: "Gourmet Donut Shop",
    slug: "gourmet-donut-shop",
    content: `Gourmet Donut Shop - A light-medium roast coffee blend featuring coffees with tasting notes that include cocoa, caramel, toffee and mild fruits. A perfectly balanced morning coffee that offers a stronger flavor when compared to the lighter breakfast blends.

Type: Blend
Vendor: Mangy Dog Coffee

Available Grinds: Espresso, Standard, Whole Bean
Available Sizes: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99)`
  },
  {
    title: "French Roast",
    slug: "french-roast",
    content: `French Roast - A deep dark roast of our highest scoring African coffees offering a bold, rich coffee flavor. The beans are shiny with an oil sheen and offer a bittersweet flavor with low acidity.

Type: Blend
Vendor: Mangy Dog Coffee

Available Grinds: Espresso, Standard, Whole Bean
Available Sizes: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99)`
  },
  {
    title: "Italian Roast",
    slug: "italian-roast",
    content: `Italian Roast - An extra dark oily roast made from Central American coffees for deep, heavy coffee flavor. Origin characteristics are diminished and acidity is non-existent.

Type: Blend
Vendor: Mangy Dog Coffee

Available Grinds: Espresso, Standard, Whole Bean
Available Sizes: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99)`
  },
  {
    title: "Holiday Blend",
    slug: "holiday-blend",
    content: `Holiday Blend - Festive holiday blend from Brazil, Peru and India.

Type: Blend
Vendor: Mangy Dog Coffee

Available Grinds: Coarse, Espresso, Standard, Whole Bean
Available Sizes: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)`
  },
  {
    title: "Cold Brew Coffee",
    slug: "cold-brew-coffee",
    content: `Cold Brew Coffee - Medium roast with smooth chocolate, toffee and floral tones. Great for cold brew or nitro.

Type: Blend
Vendor: Mangy Dog Coffee

Available Grinds: Coarse, Espresso, Standard, Whole Bean
Available Sizes: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)`
  },
  {
    title: "Whiskey Barrel Aged",
    slug: "whiskey-barrel-aged",
    content: `Whiskey Barrel Aged - Single origin Guatemala aged 30 days in a Bourbon barrel and then roasted to order.

Type: Blend
Vendor: Mangy Dog Coffee

Available Grinds: Coarse, Espresso, Standard, Whole Bean
Available Sizes: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)`
  },
  {
    title: "Max Caf Blend",
    slug: "max-caf-blend",
    content: `Max Caf Blend - High caffeine blend of coffee. Tanzania and India Robusta.

Type: Blend
Vendor: Mangy Dog Coffee

Available Grinds: Coarse, Espresso, Standard, Whole Bean
Available Sizes: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)`
  },
  {
    title: "Kopi Safari",
    slug: "kopi-safari",
    content: `Kopi Safari - Post roast blend. Lively and grounding, a perfect harmony of brightness and depth.

Type: Blend
Vendor: Mangy Dog Coffee

Available Grinds: Coarse, Espresso, Standard, Whole Bean
Available Sizes: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99)`
  },
  {
    title: "Instant Coffee",
    slug: "instant-coffee",
    content: `Instant Coffee - 30 servings of instant coffee in a resealable pouch.

Type: Blend
Vendor: Mangy Dog Coffee

Available Size: 3oz ($20.99)
Grind: Standard`
  },
  {
    title: "Coffee with Mushrooms Dark Roast",
    slug: "coffee-with-mushrooms-dark-roast",
    content: `Coffee with Mushrooms Dark Roast - Specialty-grade coffee infused with Lion's Mane, Cordyceps, and Reishi mushrooms.

Type: Blend
Vendor: Mangy Dog Coffee

Available Size: 8oz ($20.99)
Grind: Standard`
  },
  {
    title: "Coffee with Mushrooms Medium Roast",
    slug: "coffee-with-mushrooms-medium-roast",
    content: `Coffee with Mushrooms Medium Roast - Specialty-grade coffee infused with Lion's Mane, Cordyceps, and Reishi mushrooms.

Type: Blend
Vendor: Mangy Dog Coffee

Available Size: 8oz ($20.99)
Grind: Standard`
  },

  // SINGLE ORIGIN COFFEES
  {
    title: "Bali Blue",
    slug: "bali-blue",
    content: `Bali Blue - Single Origin Coffee

Roast: Med-dark
Tasting Profile: Dark chocolate, molasses, brown sugar
Grower: Smallholder farmers from Kintamani
Variety: Bourbon, Typica, Catimor
Region: Kintamani, Bali, Indonesia
Altitude: 1200-1600 M
Soil Type: Volcanic Loam
Process: Hand picked, wet-hulled and dried on raised beds.

Type: Single Origin
Vendor: Mangy Dog Coffee

Available Grinds: Coarse, Espresso, Standard, Whole Bean
Available Sizes: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)`
  },
  {
    title: "Brazil Santos",
    slug: "brazil-santos",
    content: `Brazil Santos - Single Origin Coffee

Roast: Medium
Tasting Profile: Elegant, smooth cup with cocoa notes.
Grower: Fazenda Santa Barbara, Sao Francisco, Santo Antonio
Variety: Catuai and Mundo Novo
Region: Parana and Sao Paulo Brazil
Altitude: 750-1050 M
Soil Type: Volcanic Loam
Process: Pulped natural and dried in the Sun

Type: Single Origin
Vendor: Mangy Dog Coffee

Available Grinds: Coarse, Espresso, Standard, Whole Bean
Available Sizes: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)`
  },
  {
    title: "Colombia",
    slug: "colombia",
    content: `Colombia - Single Origin Coffee

Roast: Medium
Tasting Profile: Dried orange, berry, chocolate
Grower: Smallholder farmers from Medellin
Variety: Castillo, Caturra, Colombia, & Typica
Region: Medellin, Antioquia, Colombia
Altitude: 1300-1500 M
Soil Type: Volcanic Loam
Process: Fully washed and dried in solar dryers to protect the coffee from rain.

Type: Single Origin
Vendor: Mangy Dog Coffee

Available Grinds: Coarse, Espresso, Standard, Whole Bean
Available Sizes: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)`
  },
  {
    title: "Costa Rica",
    slug: "costa-rica",
    content: `Costa Rica - Single Origin Coffee

Roast: Medium
Tasting Profile: Sweet apple, raisin, honey
Grower: Micro farms in Alajuela
Variety: Caturra & Catuai
Region: Alajuela, Costa Rica
Altitude: 1300-1445 M
Soil Type: Volcanic Loam
Process: Eco-pulped and dried in the sun.

Type: Single Origin
Vendor: Mangy Dog Coffee

Available Grinds: Coarse, Espresso, Standard, Whole Bean
Available Sizes: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)`
  },
  {
    title: "Ethiopia Natural",
    slug: "ethiopia-natural",
    content: `Ethiopia Natural - Single Origin Coffee

Roast: Med-light
Tasting Profile: Milk chocolate, fruity, caramel
Grower: Smallholder farmers from the Sidama zone.
Variety: Indigenous Heirloom Cultivars
Region: Sidama Zone, Ethiopia
Altitude: 1700-1900 M
Soil Type: Nitisols
Process: Full natural, sorted by hand. Dried on raised beds.

Type: Single Origin
Vendor: Mangy Dog Coffee

Available Grinds: Coarse, Espresso, Standard, Whole Bean
Available Sizes: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)`
  },
  {
    title: "Guatemala",
    slug: "guatemala",
    content: `Guatemala - Single Origin Coffee

Roast: Medium
Tasting Profile: Dark chocolate, bright fruit, butterscotch.
Grower: Smallholder farmers from Antigua
Variety: Bourbon, Catuai, Caturra, & Typica
Region: Antigua Guatemala
Altitude: 1200-1616 M
Soil Type: Volcanic Loam
Process: Fully washed and sun dried.

Type: Single Origin
Vendor: Mangy Dog Coffee

Available Grinds: Coarse, Espresso, Standard, Whole Bean
Available Sizes: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)`
  },
  {
    title: "Honduras",
    slug: "honduras",
    content: `Honduras - Single Origin Coffee

Roast: Medium-dark
Tasting Profile: Caramel, spice, brown sugar.
Grower: 1500 grower/members from Cafe Organics Marcala
Variety: Bourbon, Catuai, Caturra, Lempira, & Typica
Region: Marcala, La Paz, Honduras
Altitude: 1300-1700 M
Soil Type: Clay Minerals
Process: Fully washed and sun dried.

Type: Single Origin
Vendor: Mangy Dog Coffee

Available Grinds: Coarse, Espresso, Standard, Whole Bean
Available Sizes: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)`
  },
  {
    title: "Mexico",
    slug: "mexico",
    content: `Mexico - Single Origin Coffee

Roast: Medium
Tasting Profile: Chocolate, cinnamon, green apple.
Grower: Coffee growers from Chiapas and Oaxaca
Variety: Typica, Criollo, Bourbon, Mundo Novo, Caturra
Region: Chiapas and Oaxaca, Mexico
Altitude: 900-1000 M
Soil Type: Clay Minerals
Process: Fully washed and sun dried.

Type: Single Origin
Vendor: Mangy Dog Coffee

Available Grinds: Coarse, Espresso, Standard, Whole Bean
Available Sizes: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)`
  },
  {
    title: "Nicaragua",
    slug: "nicaragua",
    content: `Nicaragua - Single Origin Coffee

Roast: Medium
Tasting Profile: Cocoa, floral and citrus tones.
Grower: Smallholder farmers from Molino Norte
Variety: Yellow and Red Catuai, Catimor & Parainema
Region: Molino Norte, Matagalpa, Nicaragua
Altitude: 900-1590 M
Soil Type: Clay Minerals
Process: Fully washed, fermented for 12-14 hours and then dried on patios and raised beds

Type: Single Origin
Vendor: Mangy Dog Coffee

Available Grinds: Coarse, Espresso, Standard, Whole Bean
Available Sizes: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)`
  },
  {
    title: "Papua New Guinea",
    slug: "papua-new-guinea",
    content: `Papua New Guinea - Single Origin Coffee

Roast: Medium
Tasting Profile: Caramel, honey and fruit.
Grower: Small agricultural cooperatives in Chimbu.
Variety: Bourbon & Typica
Region: Chimbu Province, Papua New Guinea
Altitude: 1350 M
Soil Type: Volcanic Loam
Process: Fully washed and dried in the sun.

Type: Single Origin
Vendor: Mangy Dog Coffee

Available Grinds: Coarse, Espresso, Standard, Whole Bean
Available Sizes: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)`
  },
  {
    title: "Peru",
    slug: "peru",
    content: `Peru - Single Origin Coffee

Roast: Medium
Tasting Profile: Salted caramel, silky sweet, citrus
Grower: Cooperativa Agricola de Servicisios Norandino
Variety: Caturra, Bourbon, Catuai, Pache, & Catimor
Region: Piura, Amazonas, Peru
Altitude: 1100-1700 M
Soil Type: Clay Minerals
Process: Fully washed and dried in the sun.

Type: Single Origin
Vendor: Mangy Dog Coffee

Available Grinds: Coarse, Espresso, Standard, Whole Bean
Available Sizes: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)`
  },
  {
    title: "Peru Decaf",
    slug: "peru-decaf",
    content: `Peru Decaf - Single Origin Decaffeinated Coffee

Roast: Medium
Tasting Profile: Caramel, smooth, citrus
Grower: Cooperativa Agricola de Servicisios Norandino
Variety: Caturra, Bourbon, Catuai, Pache, & Catimor
Region: Piura, Amazonas, Peru
Altitude: 1100-1700 M
Soil Type: Clay Minerals
Process: Fully washed and dried in the sun and decaffeinated using the Swiss Water Process.

Type: Single Origin (Decaf)
Vendor: Mangy Dog Coffee

Available Grinds: Coarse, Espresso, Standard, Whole Bean
Available Sizes: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 Pack ($19.99), 12 LB ($189.99)`
  },
  {
    title: "Tanzania",
    slug: "tanzania",
    content: `Tanzania - Single Origin Coffee

Roast: Medium-light
Tasting Profile: Pear, floral, jasmine, strawberry.
Grower: Small cooperative farmers in the Mbeya area
Variety: Bourbon & Kent
Region: Mbeya Region of Tanzania
Altitude: 1200-1900 M
Soil Type: Clay Minerals
Process: Fully washed and dried on raised beds

Type: Single Origin
Vendor: Mangy Dog Coffee

Available Grinds: Coarse, Espresso, Standard, Whole Bean
Available Sizes: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99), 12 LB ($189.99)`
  },
  {
    title: "Sumatra",
    slug: "sumatra",
    content: `Sumatra - Single Origin Coffee

Cupping Notes: Medium Acidity, Syrupy Body, Dark Chocolate, Dried Fruit, Earthy, Long Lingering Body
Region: Aceh, Takengon
Coop: Koperasi Baitul Qiradh Baburrayyan (KBQB)
Altitude: 1100 - 1600 M
Processing: Giling Basha (Also known as Wet-Hulling)
Varietal: Tim Tim, Typica, Ateng, Onan Ganjang, Jember

Type: Single Origin
Vendor: Mangy Dog Coffee

Available Grinds: Coarse, Espresso, Standard, Whole Bean
Available Sizes: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99)`
  },
  {
    title: "Kenya",
    slug: "kenya",
    content: `Kenya - Single Origin Coffee

Tasting Notes: Bright Acidity, Orange, Lemon, Floral, Effervescent
Region: Othaya, Nyeri County
Altitude: 1,700-1,890 M
Process: Fully Washed and Dried on Raised Beds
Variety: SL28, SL34, Ruiru 11, and Batian

Type: Single Origin
Vendor: Mangy Dog Coffee

Available Grinds: Coarse, Espresso, Standard, Whole Bean
Available Sizes: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99)`
  },
  {
    title: "Uganda",
    slug: "uganda",
    content: `Uganda - Single Origin Coffee

Cupping Notes: Mild Acidity, Light Body, Floral, Chocolate, Dark Fruits
Region: Sipi, Kapchorwa District, Uganda
Altitude: 1,500-2,500 M
Process: Fully Washed and Sun Dried
Varietals: Bourbon: SL14, SL28, and Blue Mountain

Type: Single Origin
Vendor: Mangy Dog Coffee

Available Grinds: Coarse, Espresso, Standard, Whole Bean
Available Sizes: 12oz ($19.99), 1 LB ($28.99), 2 LB ($49.99), 5 LB ($89.99)`
  },

  // COFFEE PODS
  {
    title: "Mexico Coffee Pods",
    slug: "mexico-coffee-pods",
    content: `Mexico Coffee Pods - Single Serve Coffee Pods

Tasting Notes: Medium Acidity, Creamy Body, Lemon, Brown Sugar, Dark Chocolate
Region: Chiapas
Altitude: 1,400-1,900 M
Process: Washed
Variety: Typical, Catimor, and Bourbon

Type: Single Origin (Pods)
Vendor: Mangy Dog Coffee

Available Size: 12 Pack ($19.99)
Grind: Standard`
  },
  {
    title: "Peru Coffee Pods",
    slug: "peru-coffee-pods",
    content: `Peru Coffee Pods - Single Serve Coffee Pods

Roast: Medium
Tasting Profile: Salted caramel, silky sweet, citrus
Grower: Cooperativa Agricola de Servicisios Norandino
Variety: Caturra, Bourbon, Catuai, Pache, & Catimor
Region: Piura, Amazonas, Peru
Altitude: 1100-1700 M
Soil Type: Clay Minerals
Process: Fully washed and dried in the sun.

Type: Single Origin (Pods)
Vendor: Mangy Dog Coffee

Available Size: 12 Pack ($19.99)
Grind: Standard`
  },
  {
    title: "Bali Coffee Pods",
    slug: "bali-coffee-pods",
    content: `Bali Coffee Pods - Single Serve Coffee Pods

Roast: Med-dark
Tasting Profile: Dark chocolate, molasses, brown sugar
Grower: Smallholder farmers from Kintamani
Variety: Bourbon, Typica, Catimor
Region: Kintamani, Bali, Indonesia
Altitude: 1200-1600 M
Soil Type: Volcanic Loam
Process: Hand picked, wet-hulled and dried on raised beds.

Type: Single Origin (Pods)
Vendor: Mangy Dog Coffee

Available Size: 12 Pack ($19.99)
Grind: Standard`
  },

  // SAMPLE PACKS
  {
    title: "Best Sellers Sample Pack",
    slug: "best-sellers-sample-pack",
    content: `Best Sellers Sample Pack - Sample our best selling coffees in 2oz packs.

Includes 6 sample packs:
- 6Bean Blend (Dark Roast) - House Blend, great for Espresso
- Cowboy Blend (Dark & Medium Blend) - Cocoa, caramel, & vanilla tones
- Breakfast Blend (Medium) - Smooth blend from South America
- Peru Single Origin (Medium) - Salted caramel, silky sweet, citrus
- Mexico Single Origin (Medium) - Chocolate, cinnamon, green apple
- Bali Single Origin (Med-dark) - Dark chocolate, molasses, brown sugar

Type: Sample Pack
Vendor: Mangy Dog Coffee

Available Size: 6-count 2oz sample packs ($24.99)
Grind: Standard`
  },
  {
    title: "Flavored Coffees Sample Pack",
    slug: "flavored-coffees-sample-pack",
    content: `Flavored Coffees Sample Pack - Sample our flavored coffees in 2oz packs. 6 packs total.

Includes:
- French Vanilla - Rich and creamy vanilla, well rounded and smooth
- Hazelnut - Nutty flavors blended with Brazilian coffee
- Cinnabun - All the cinnamon roll flavor without the calories
- Caramel - Sweet buttery caramel on medium roast
- Mocha - Rich chocolate decadence on medium roast
- Cinnamon Hazelnut - Perfect pairing of cinnamon and hazelnut

All flavored coffees start as specialty grade single origin coffee roasted in small batches to a smooth medium, then carefully flavored with high quality natural flavoring oils while still warm.

Type: Sample Pack
Vendor: Mangy Dog Coffee

Available Size: 6-count 2oz sample packs ($24.99)
Grind: Standard`
  },
  {
    title: "Single Origin Favorites Sample Pack",
    slug: "single-origin-favorites-sample-pack",
    content: `Single Origin Favorites Sample Pack - Sample our most popular single origin coffees in 2oz packs. 6 packs total.

Includes:
- Brazil Santos (Medium) - Elegant, smooth cup with cocoa notes
- Colombia (Medium) - Dried orange, berry, chocolate
- Costa Rica (Medium) - Sweet apple, raisin, honey
- Ethiopia (Med-light) - Milk chocolate, fruity, caramel
- Honduras (Medium-dark) - Caramel, spice, brown sugar
- Tanzania (Medium-light) - Pear, floral, jasmine, strawberry

Type: Sample Pack
Vendor: Mangy Dog Coffee

Available Size: 6-count 2oz sample packs ($24.99)
Grind: Standard`
  },

  // TEAS
  {
    title: "Jasmine Tea",
    slug: "jasmine-tea",
    content: `Jasmine Tea - A fine blend of freshly plucked jasmine blossoms and green tea, this is medium-bodied, sweet, smooth, and silky. Good for multiple steepings. The green tea is picked by hand and prepared then set aside until the Jasmine blossoms are ready. The two are paired at just the right time to create this harmony of fruity flavors on a medium bodied green tea base.

Type: Tea (Loose Leaf)
Vendor: Mangy Dog Coffee

Available Size: 3oz tin ($20.99)`
  },
  {
    title: "Masala Chai",
    slug: "masala-chai",
    content: `Masala Chai - The bold and spicy character of Indian Masala Chai - full-bodied, aromatic, and intense. Great as a traditional chai served with milk and sugar but is also an invigorating drink on its own.

Type: Tea (Loose Leaf)
Vendor: Mangy Dog Coffee

Available Size: 3oz tin ($20.99)`
  },
  {
    title: "English Breakfast Tea",
    slug: "english-breakfast-tea",
    content: `English Breakfast Tea - Breakfast Tea as it should be. Not too complicated but strong enough to stand up to milk and sugar. A rustic, sweet cup that brings good news all day long. A blend of African and Indian Tea.

Type: Tea (Loose Leaf)
Vendor: Mangy Dog Coffee

Available Size: 3oz tin ($20.99)`
  },
  {
    title: "Peach Paradise Tea",
    slug: "peach-paradise-tea",
    content: `Peach Paradise Tea - This herbal blend is fruity, smooth, aromatic, and sweet. Fruity peach, sour cranberry and smooth notes of rose, creates paradise in a cup. A fantastic and refreshing cup both hot and cold.

Type: Tea (Loose Leaf - Herbal)
Vendor: Mangy Dog Coffee

Available Size: 3oz tin ($20.99)`
  },
  {
    title: "Mango Treat Tea",
    slug: "mango-treat-tea",
    content: `Mango Treat Tea - Sweet, smooth, and summery. Wonderful as a hot tea and incredible iced. The hint of mango on the already fruity tea means you can have a great cup of hot tea or very refreshing iced tea any time.

Type: Tea (Loose Leaf)
Vendor: Mangy Dog Coffee

Available Size: 3oz tin ($20.99)`
  },
  {
    title: "Apple Cider Rooibos Tea",
    slug: "apple-cider-rooibos-tea",
    content: `Apple Cider Rooibos Tea - This herbal blend is spicy, sweet, and naturally caffeine free. Rooibos (pronounced ROY-bos) is a popular tea alternative grown in South Africa. It is called Red Bush Tea and known for its health benefits. This blend elevates the great Rooibos flavors by adding in cinnamon, orange peel and natural spices for an unforgettable premium cup. Great fall flavor that you can enjoy year round.

Type: Tea (Loose Leaf - Herbal, Caffeine Free)
Vendor: Mangy Dog Coffee

Available Size: 3oz tin ($20.99)`
  },
  {
    title: "Hibiscus Berry Tea",
    slug: "hibiscus-berry-tea",
    content: `Hibiscus Berry Tea - Flavored Herbal Tea

Ingredients: Organic Hibiscus Flowers, Organic Rosehips, Organic Orange Peel, Organic Rooibos, Organic Blueberry Flavor, Organic Passionfruit Flavor, Organic Mango Flavor
Notes: Blueberry, Currant
Scoring: Low Astringency, High Body, High Sweetness

Talk about refreshing! This Sweet Hibiscus based beverage is sure to quench your longing thirst of berry goodness, perfect as a cold brew or western style brew for any occasion.

Brewing Method: 5 - 10 Min, 212 F, 3g / 12oz

Type: Tea (Loose Leaf - Herbal)
Vendor: Mangy Dog Coffee

Available Size: 3oz tin ($20.99)`
  },
  {
    title: "Earl Grey Tea",
    slug: "earl-grey-tea",
    content: `Earl Grey Tea - Loose Leaf Flavored Tea

Ingredients: Ceylon OP, Bergamot Essential Oil, Cornflowers
Notes: Orange, Floral, Malt
Scoring: High Astringency, High Body, Medium Sweetness

Earl grey is a timeless blend. We mix our Ceylon black tea with blue cornflowers and a touch of bergamot oil. While it is typically consumed alone, it can be combined with milk and sugar for a different experience.

Brewing Method: 5 - 10 Min, 195 F, 2.5g / 12oz

Type: Tea (Loose Leaf)
Vendor: Mangy Dog Coffee

Available Size: 3oz tin ($20.99)`
  },
  {
    title: "Moroccan Mint Tea",
    slug: "moroccan-mint-tea",
    content: `Moroccan Mint Tea - Old green tea meets fresh mint - a smooth, vibrant blend that's refreshing hot and next-level iced.

Type: Tea (Loose Leaf)
Vendor: Mangy Dog Coffee

Available Size: 3oz tin ($20.99)`
  },
  {
    title: "Hojicha Tea",
    slug: "hojicha-tea",
    content: `Hojicha Tea - This roasted green tea powder is crafted from carefully selected tea leaves and stems. Stone-milled into a fine powder, it brews into a smooth cup with comforting notes of toasted cereal and balanced umami.

Type: Tea (Loose Leaf - Roasted Green Tea)
Vendor: Mangy Dog Coffee

Available Size: 3oz tin ($20.99)`
  },
  {
    title: "Matcha Tea",
    slug: "matcha-tea",
    content: `Matcha Tea - Refined and lingering, this matcha is crafted for traditional preparation and mindful daily rituals.

Type: Tea (Powder - Green Tea)
Vendor: Mangy Dog Coffee

Available Size: 1oz tin ($18.99)`
  },

  // GENERAL BUSINESS INFO
  {
    title: "About Mangy Dog Coffee",
    slug: "about-mangy-dog-coffee",
    content: `About Mangy Dog Coffee

Mangy Dog Coffee - Coffee with a bite! 10% of all sales goes to AKT Foundation.

We offer a wide selection of specialty grade coffees and premium teas:

COFFEE BLENDS:
- Asian Plateau Blend, African Kahawa Blend, House Blend, Breakfast Blend
- Gourmet Donut Shop, French Roast, Italian Roast, Holiday Blend
- Cold Brew Coffee, Whiskey Barrel Aged, Max Caf Blend, Kopi Safari
- Instant Coffee, Coffee with Mushrooms (Dark & Medium Roast)

SINGLE ORIGIN COFFEES:
- Bali Blue, Brazil Santos, Colombia, Costa Rica, Ethiopia Natural
- Guatemala, Honduras, Mexico, Nicaragua, Papua New Guinea
- Peru, Peru Decaf, Tanzania, Sumatra, Kenya, Uganda

COFFEE PODS:
- Mexico, Peru, and Bali single-serve pods

SAMPLE PACKS:
- Best Sellers Sample Pack, Flavored Coffees Sample Pack, Single Origin Favorites

PREMIUM TEAS:
- Jasmine, Masala Chai, English Breakfast, Peach Paradise, Mango Treat
- Apple Cider Rooibos, Hibiscus Berry, Earl Grey, Moroccan Mint
- Hojicha, Matcha

Coffee Pricing:
- 12oz bags: $19.99
- 1 LB bags: $28.99
- 2 LB bags: $49.99
- 5 LB bags: $89.99
- 12 LB bags: $189.99 (select varieties)
- Coffee Pods (12 pack): $19.99
- Sample Packs: $24.99

Tea Pricing:
- 3oz tins: $20.99
- Matcha 1oz: $18.99

Available Grinds: Whole Bean, Standard, Espresso, Coarse (varies by product)

Visit mangydogcoffee.com for more information and to place orders.`
  },
  {
    title: "Coffee Pricing and Sizes",
    slug: "coffee-pricing-sizes",
    content: `Mangy Dog Coffee - Pricing and Sizes

STANDARD COFFEE PRICING:
- 12oz bag: $19.99
- 1 LB (16oz) bag: $28.99
- 2 LB bag: $49.99
- 5 LB bag: $89.99
- 12 LB bag: $189.99 (available for select varieties)

SPECIALTY ITEMS:
- Instant Coffee (3oz, 30 servings): $20.99
- Coffee with Mushrooms (8oz): $20.99
- Coffee Pods (12 pack): $19.99
- Sample Packs (6 x 2oz): $24.99

TEA PRICING:
- Most teas (3oz loose leaf tin): $20.99
- Matcha (1oz): $18.99

GRIND OPTIONS:
- Whole Bean: For those who grind at home
- Standard: All-purpose grind for drip coffee makers
- Espresso: Fine grind for espresso machines
- Coarse: For French press and cold brew (select varieties)

All coffee is roasted fresh to order. Visit mangydogcoffee.com to shop.`
  },
  {
    title: "AKT Foundation Charity Partnership",
    slug: "akt-foundation-charity",
    content: `Mangy Dog Coffee - AKT Foundation Partnership

10% of all Mangy Dog Coffee sales goes to AKT Foundation!

When you purchase coffee or tea from Mangy Dog Coffee, you're not just getting premium quality beverages - you're also supporting a great cause. A portion of every sale is donated to the AKT Foundation.

"Coffee with a bite!" - Our slogan reflects both our bold coffee flavors and our commitment to making a positive impact in the community.

Shop at mangydogcoffee.com and enjoy great coffee while supporting charity.`
  }
];

async function rebuildKnowledgeBase() {
  console.log('Starting Knowledge Base rebuild...\n');

  // Step 1: Delete ALL existing KB entries
  console.log('Step 1: Removing all existing Knowledge Base entries...');

  // Delete chunks first (foreign key constraint)
  const deletedChunks = await prisma.knowledgeChunk.deleteMany({});
  console.log(`  Deleted ${deletedChunks.count} chunks`);

  // Delete documents
  const deletedDocs = await prisma.knowledgeDoc.deleteMany({});
  console.log(`  Deleted ${deletedDocs.count} documents`);

  console.log('  All existing KB entries removed.\n');

  // Step 2: Add all Mangy Dog Coffee products
  console.log('Step 2: Adding Mangy Dog Coffee products...\n');

  for (const product of products) {
    try {
      await prisma.knowledgeDoc.create({
        data: {
          title: product.title,
          slug: product.slug,
          language: 'en',
          content: product.content
        }
      });
      console.log(`  + ${product.title}`);
    } catch (error: any) {
      if (error.code === 'P2002') {
        // Duplicate slug - update instead
        await prisma.knowledgeDoc.update({
          where: { slug: product.slug },
          data: {
            title: product.title,
            content: product.content
          }
        });
        console.log(`  ~ ${product.title} (updated)`);
      } else {
        console.error(`  ! Error adding ${product.title}:`, error.message);
      }
    }
  }

  // Step 3: Verify
  console.log('\n\nStep 3: Verifying Knowledge Base...');
  const finalCount = await prisma.knowledgeDoc.count();
  const docs = await prisma.knowledgeDoc.findMany({
    select: { title: true },
    orderBy: { title: 'asc' }
  });

  console.log(`\nKnowledge Base now contains ${finalCount} documents:\n`);

  // Group by category
  const coffeeBlends = docs.filter(d =>
    d.title.includes('Blend') ||
    d.title.includes('Roast') ||
    d.title.includes('Donut Shop') ||
    d.title.includes('Cold Brew') ||
    d.title.includes('Whiskey Barrel') ||
    d.title.includes('Kopi Safari') ||
    d.title.includes('Instant Coffee') ||
    d.title.includes('Mushrooms')
  );

  const singleOrigins = docs.filter(d =>
    ['Bali Blue', 'Brazil Santos', 'Colombia', 'Costa Rica', 'Ethiopia Natural',
     'Guatemala', 'Honduras', 'Mexico', 'Nicaragua', 'Papua New Guinea',
     'Peru', 'Peru Decaf', 'Tanzania', 'Sumatra', 'Kenya', 'Uganda'].some(name => d.title === name)
  );

  const pods = docs.filter(d => d.title.includes('Pods'));
  const samplePacks = docs.filter(d => d.title.includes('Sample Pack'));
  const teas = docs.filter(d => d.title.includes('Tea') || d.title === 'Matcha' || d.title === 'Hojicha');
  const info = docs.filter(d =>
    d.title.includes('About') ||
    d.title.includes('Pricing') ||
    d.title.includes('AKT Foundation')
  );

  console.log(`Coffee Blends (${coffeeBlends.length}):`);
  coffeeBlends.forEach(d => console.log(`  - ${d.title}`));

  console.log(`\nSingle Origin Coffees (${singleOrigins.length}):`);
  singleOrigins.forEach(d => console.log(`  - ${d.title}`));

  console.log(`\nCoffee Pods (${pods.length}):`);
  pods.forEach(d => console.log(`  - ${d.title}`));

  console.log(`\nSample Packs (${samplePacks.length}):`);
  samplePacks.forEach(d => console.log(`  - ${d.title}`));

  console.log(`\nTeas (${teas.length}):`);
  teas.forEach(d => console.log(`  - ${d.title}`));

  console.log(`\nBusiness Info (${info.length}):`);
  info.forEach(d => console.log(`  - ${d.title}`));

  console.log('\n✓ Knowledge Base rebuild complete!');
}

rebuildKnowledgeBase()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
