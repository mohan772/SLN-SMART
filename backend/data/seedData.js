const categories = [
  { 
    name: 'Fresh Fruits', 
    description: 'Nature\'s candy, harvested at the peak of ripeness for maximum flavor and nutrition.', 
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1200&q=80' 
  },
  { 
    name: 'Citrus Fruits', 
    description: 'Bright and zesty citrus fruits, perfect for refreshing juices and immunity-boosting snacks.', 
    image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=1200&q=80' 
  },
  { 
    name: 'Berries', 
    description: 'Sweet, antioxidant-rich berries for smoothies, desserts, and healthy breakfasts.', 
    image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=1200&q=80' 
  },
  { 
    name: 'Tropical Fruits', 
    description: 'Exotic tropical delights sourced for their sweetness and fragrant flavors.', 
    image: 'https://images.unsplash.com/photo-1502741126161-b048400d2a7c?auto=format&fit=crop&w=1200&q=80' 
  },
  { 
    name: 'Fresh Vegetables', 
    description: 'Crisp, vibrant, and packed with essential nutrients for your daily wellness.', 
    image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=1200&q=80' 
  },
  { 
    name: 'Leafy Vegetables', 
    description: 'Organic greens from farm to table, perfect for salads and healthy smoothies.', 
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=1200&q=80' 
  },
  { 
    name: 'Root Vegetables', 
    description: 'Earthy staples that provide the foundation for hearty, wholesome meals.', 
    image: 'https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f?auto=format&fit=crop&w=1200&q=80' 
  },
  { 
    name: 'Seasonal Vegetables', 
    description: 'Fresh seasonal vegetables for the finest local recipes all year round.', 
    image: 'https://images.unsplash.com/photo-1506802915222-1a1f5f54d106?auto=format&fit=crop&w=1200&q=80' 
  },
  { 
    name: 'Salad Greens', 
    description: 'Tender leafy salad greens, ready to make every salad crisp and delicious.', 
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80' 
  },
  { 
    name: 'Exotic Fruits', 
    description: 'A curated selection of rare and tropical flavors from around the globe.', 
    image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=1200&q=80' 
  },
  { 
    name: 'Exotic Vegetables', 
    description: 'Gourmet ingredients to elevate your culinary creations to professional standards.', 
    image: 'https://images.unsplash.com/photo-1598046937895-2a41499dc2ed?auto=format&fit=crop&w=1200&q=80' 
  },
  { 
    name: 'Herbs', 
    description: 'Aromatic and fresh herbs to add the finishing touch to every dish.', 
    image: 'https://images.unsplash.com/photo-1601314167099-232775bb5f76?auto=format&fit=crop&w=1200&q=80' 
  },
  { 
    name: 'Salads & Juices', 
    description: 'Refreshingly pure cold-pressed juices and pre-cut gourmet salad mixes.', 
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80' 
  },
  { 
    name: 'Seasonal Fruits', 
    description: 'The finest limited-time harvests, celebrating the best each season has to offer.', 
    image: 'https://images.unsplash.com/photo-1499616017701-35c2a9537aa5?auto=format&fit=crop&w=1200&q=80' 
  },
  { 
    name: 'Organic Fruits', 
    description: 'Certified organic fruits, grown naturally without synthetic pesticides or fertilizers.', 
    image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=1200&q=80' 
  },
  { 
    name: 'Organic Vegetables', 
    description: '100% Certified organic, pesticide-free produce for health-conscious living.', 
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80' 
  },
  { 
    name: 'Regional Favorites', 
    description: 'Traditional local specialties sourced from community-based heritage farms.', 
    image: 'https://images.unsplash.com/photo-1605342777353-8328c895c2c7?auto=format&fit=crop&w=1200&q=80' 
  },
  { 
    name: 'Dry Fruits', 
    description: 'Premium nuts and dried fruits, perfect for snacking or gourmet baking.', 
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80' 
  },
  { 
    name: 'Flowers', 
    description: 'Beautiful, fragrant cut flowers and artisanal floral arrangements.', 
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=1200&q=80' 
  },
  { 
    name: 'Sprouts', 
    description: 'Highly nutritious, protein-rich living foods for a vitality-packed diet.', 
    image: 'https://images.unsplash.com/photo-1597348989645-46b190ce4918?auto=format&fit=crop&w=1200&q=80' 
  },
  { 
    name: 'Mushroom Varieties', 
    description: 'A diverse range of culinary mushrooms, from classic buttons to exotic shiitakes.', 
    image: 'https://images.unsplash.com/photo-1506807156960-e22306db7c68?auto=format&fit=crop&w=1200&q=80' 
  },
];

const productImageMap = {
  'Fuji Apple': 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80',
  'Robusta Banana': 'https://images.unsplash.com/photo-1571771894821-ad990241274d?auto=format&fit=crop&w=800&q=80',
  'Nagpur Orange': 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=800&q=80',
  'Alphonso Mango': 'https://images.unsplash.com/photo-1553334820-552ee0420588?auto=format&fit=crop&w=800&q=80',
  'Semi-Ripe Papaya': 'https://images.unsplash.com/photo-1517431304441-81454b055e49?auto=format&fit=crop&w=800&q=80',
  'Hybrid Tomato': 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?auto=format&fit=crop&w=800&q=80',
  'Potato / Aloo': 'https://images.unsplash.com/photo-1518977676601-b53f02ac6d31?auto=format&fit=crop&w=800&q=80',
  'Red Onion': 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80',
  'Ooty Carrot': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80',
  'Palak / Spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80',
  'Pink Dragon Fruit': 'https://images.unsplash.com/photo-1527324688151-0e627063f2b1?auto=format&fit=crop&w=800&q=80',
  'Hass Avocado': 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80',
  'Broccoli': 'https://images.unsplash.com/photo-1452948491233-ad8a1ed01085?auto=format&fit=crop&w=800&q=80',
  'Fresh Basil': 'https://images.unsplash.com/photo-1618375531912-77ac368ff13f?auto=format&fit=crop&w=800&q=80',
  'Mixed Salad Box': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
  'California Almonds': 'https://images.unsplash.com/photo-1508029091899-599903ad9c8f?auto=format&fit=crop&w=800&q=80',
  'Red Roses': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
  'White Button Mushroom': 'https://images.unsplash.com/photo-1528513139038-ca02c84658e8?auto=format&fit=crop&w=800&q=80',
  'Lemon': 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=800&q=80',
  'Sweet Lime': 'https://images.unsplash.com/photo-1524592833360-3a9dea735a62?auto=format&fit=crop&w=800&q=80',
  'Grapefruit': 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80',
  'Blueberry': 'https://images.unsplash.com/photo-1502741126161-b048400d2a7c?auto=format&fit=crop&w=800&q=80',
  'Blackberry': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
  'Raspberry': 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80',
  'Mulberry': 'https://images.unsplash.com/photo-1502741126161-b048400d2a7c?auto=format&fit=crop&w=800&q=80',
  'Romaine Lettuce': 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80',
  'Arugula / Rocket': 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80',
  'Watercress': 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80',
  'Baby Spinach': 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80',
  'Mesclun Mix': 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80',
};

// Default image if not in map
const getDefaultImage = (category) => {
  const categoryImages = {
    'Fresh Fruits': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
    'Fresh Vegetables': 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=800&q=80',
    'Leafy Vegetables': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80',
    'Root Vegetables': 'https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f?auto=format&fit=crop&w=800&q=80',
    'Exotic Fruits': 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=800&q=80',
    'Exotic Vegetables': 'https://images.unsplash.com/photo-1598046937895-2a41499dc2ed?auto=format&fit=crop&w=800&q=80',
    'Herbs': 'https://images.unsplash.com/photo-1601314167099-232775bb5f76?auto=format&fit=crop&w=800&q=80',
    'Salads & Juices': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    'Seasonal Fruits': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
    'Organic Vegetables': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    'Regional Favorites': 'https://images.unsplash.com/photo-1605342777353-8328c895c2c7?auto=format&fit=crop&w=800&q=80',
    'Dry Fruits': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    'Flowers': 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=800&q=80',
    'Sprouts': 'https://images.unsplash.com/photo-1597348989645-46b190ce4918?auto=format&fit=crop&w=800&q=80',
    'Mushroom Varieties': 'https://images.unsplash.com/photo-1506807156960-e22306db7c68?auto=format&fit=crop&w=800&q=80',
  };
  return categoryImages[category] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80';
};

// Generate 100+ items across categories
const generateProducts = () => {
  const products = [];
  
  const addProduct = (name, category, price, discountPrice, unit, isOrganic, desc) => {
    products.push({
      name,
      description: desc || `Experience the premium quality of our ${name.toLowerCase()}. Sourced daily from sustainable farms, these are selected for their superior taste, texture, and nutritional profile. Perfect for health-conscious families who refuse to compromise on quality.`,
      price,
      discountPrice,
      unit,
      images: [productImageMap[name] || getDefaultImage(category)],
      categoryName: category,
      stock: Math.floor(Math.random() * 50) + 20,
      rating: parseFloat((Math.random() * 0.5 + 4.5).toFixed(1)), // Higher ratings for "premium" feel (4.5 to 5.0)
      numReviews: Math.floor(Math.random() * 200) + 50,
      isFeatured: Math.random() > 0.85,
      trending: Math.random() > 0.75,
      seasonal: category.includes('Seasonal') || category.includes('seasonal') || Math.random() > 0.9,
      isOrganic: isOrganic,
      visibility: true,
      isDeleted: false,
      nutritionalInfo: {
        calories: `${Math.floor(Math.random() * 60) + 20} kcal`,
        vitamins: ['Vitamin A', 'Vitamin C', 'Vitamin K'],
        minerals: ['Potassium', 'Magnesium', 'Fiber']
      },
      farmerDetails: {
        name: 'Heritage Valley Farms',
        location: 'Highland Meadows, Green Valley',
        image: 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&w=200&q=80'
      }
    });
  };

  // Fresh Fruits
  addProduct('Fuji Apple', 'Fresh Fruits', 4.99, 3.99, 'kg', true, 'Hand-picked Fuji apples, celebrated for their honey-like sweetness and exceptional crunch. These organic jewels are perfect for snacking or elevating your morning Waldorf salad.');
  addProduct('Robusta Banana', 'Fresh Fruits', 1.50, null, 'kg', false, 'Sun-ripened Robusta bananas with a creamy texture and delicate sweetness. An essential source of natural energy for your active lifestyle.');
  addProduct('Nagpur Orange', 'Fresh Fruits', 3.50, 2.99, 'kg', true, 'Zesty and incredibly juicy Nagpur oranges. Bursting with Vitamin C and a vibrant citrus aroma that refreshes the soul.');
  addProduct('Alphonso Mango', 'Fresh Fruits', 8.99, 7.50, 'kg', true, 'The "King of Mangoes." Our Alphonsos are legendary for their saffron-hued flesh, buttery texture, and a fragrance that defines the Indian summer.');
  addProduct('Semi-Ripe Papaya', 'Fresh Fruits', 2.00, null, 'piece', false, 'Precisely harvested semi-ripe papaya. A tropical powerhouse of enzymes and antioxidants, perfect for supporting digestive wellness.');
  addProduct('Kiran Watermelon', 'Fresh Fruits', 1.20, null, 'kg', false);
  addProduct('Green Seedless Grapes', 'Fresh Fruits', 5.50, 4.50, 'kg', true);
  addProduct('Pink Guava', 'Fresh Fruits', 2.50, null, 'kg', true);
  addProduct('Queen Pineapple', 'Fresh Fruits', 3.00, 2.50, 'piece', false);
  addProduct('Bhagwa Pomegranate', 'Fresh Fruits', 6.00, null, 'kg', true);
  addProduct('Muskmelon / Kharbuja', 'Fresh Fruits', 2.20, null, 'kg', false);
  addProduct('Sapota (Chikoo)', 'Fresh Fruits', 3.20, null, 'kg', true);
  addProduct('Zespri Green Kiwi', 'Fresh Fruits', 4.50, 3.99, 'pack of 3', false);
  addProduct('William Bartlett Pear', 'Fresh Fruits', 4.00, null, 'kg', true);
  addProduct('Sweet Strawberry', 'Fresh Fruits', 5.00, 4.00, 'box (200g)', false);

  // Fresh Vegetables
  addProduct('Hybrid Tomato', 'Fresh Vegetables', 1.20, 0.99, 'kg', true, 'Vine-ripened hybrid tomatoes, boasting a deep red hue and a perfect balance of acidity and sweetness. Ideal for rich sauces and fresh bruschettas.');
  addProduct('Local Tomato', 'Fresh Vegetables', 1.00, null, 'kg', false);
  addProduct('Potato / Aloo', 'Fresh Vegetables', 0.80, null, 'kg', true, 'Earth-fresh potatoes with a fluffy texture when cooked. The versatile foundation of countless gourmet and comfort dishes alike.');
  addProduct('Red Onion', 'Fresh Vegetables', 1.50, null, 'kg', false);
  addProduct('Ooty Carrot', 'Fresh Vegetables', 2.50, 2.00, 'kg', true, 'Sweet, slender carrots from the cool climates of Ooty. Their exceptional crispness makes them a favorite for both raw snacking and elegant glazed sides.');
  addProduct('Fresh Beetroot', 'Fresh Vegetables', 1.80, null, 'kg', true);
  addProduct('French Beans', 'Fresh Vegetables', 3.00, 2.50, 'kg', false);
  addProduct('Purple Brinjal', 'Fresh Vegetables', 2.20, null, 'kg', true);
  addProduct('Lady Finger / Okra', 'Fresh Vegetables', 2.50, null, 'kg', false);
  addProduct('Green Cabbage', 'Fresh Vegetables', 1.50, null, 'piece', true);
  addProduct('Cauliflower', 'Fresh Vegetables', 2.00, 1.50, 'piece', false);
  addProduct('Green Capsicum', 'Fresh Vegetables', 3.50, null, 'kg', true);
  addProduct('Yellow Pumpkin', 'Fresh Vegetables', 1.00, null, 'kg', false);
  addProduct('Bottle Gourd', 'Fresh Vegetables', 1.20, null, 'piece', true);
  addProduct('Bitter Gourd', 'Fresh Vegetables', 2.00, null, 'kg', false);
  addProduct('White Radish', 'Fresh Vegetables', 1.50, null, 'kg', true);

  // Leafy Vegetables
  addProduct('Palak / Spinach', 'Leafy Vegetables', 1.00, 0.80, 'bunch', true, 'Tender, iron-rich spinach leaves. Harvested at dawn to ensure maximum freshness and a delicate flavor that complements any dish.');
  addProduct('Coriander Leaves', 'Leafy Vegetables', 0.50, null, 'bunch', true);
  addProduct('Mint Leaves / Pudina', 'Leafy Vegetables', 0.50, null, 'bunch', true);
  addProduct('Curry Leaves', 'Leafy Vegetables', 0.30, null, 'bunch', false);
  addProduct('Iceberg Lettuce', 'Leafy Vegetables', 2.50, null, 'piece', true);
  addProduct('Red Amaranthus', 'Leafy Vegetables', 1.20, 1.00, 'bunch', false);
  addProduct('Methi / Fenugreek Leaves', 'Leafy Vegetables', 1.00, null, 'bunch', true);
  addProduct('Spring Onion', 'Leafy Vegetables', 1.50, null, 'bunch', false);
  addProduct('Mustard Leaves / Sarson', 'Leafy Vegetables', 1.20, null, 'bunch', true);
  addProduct('Gongura Leaves', 'Leafy Vegetables', 1.00, null, 'bunch', false);

  // Exotic Fruits
  addProduct('Pink Dragon Fruit', 'Exotic Fruits', 5.00, 4.50, 'piece', true, 'Strikingly beautiful pink dragon fruit with a speckled interior. A visually stunning superfood that adds a refreshing, mild sweetness to your morning bowls.');
  addProduct('Hass Avocado', 'Exotic Fruits', 6.00, 5.00, 'piece', true, 'Premium Hass avocados, renowned for their high oil content and buttery consistency. The gold standard for artisanal toast and authentic guacamole.');
  addProduct('Imported Blueberry', 'Exotic Fruits', 8.00, 7.00, 'box (125g)', false);
  addProduct('Red Raspberry', 'Exotic Fruits', 9.00, null, 'box (125g)', true);
  addProduct('Dark Red Cherry', 'Exotic Fruits', 12.00, 10.00, 'box (250g)', false);
  addProduct('Passion Fruit', 'Exotic Fruits', 4.00, null, 'kg', true);
  addProduct('Mangosteen', 'Exotic Fruits', 15.00, null, 'kg', false);
  addProduct('Rambutan', 'Exotic Fruits', 10.00, 8.50, 'box (250g)', true);

  // Exotic Vegetables
  addProduct('Broccoli', 'Exotic Vegetables', 4.00, 3.50, 'piece', true, 'Tight-headed, vibrant green broccoli. A nutritional powerhouse that brings a sophisticated crunch to stir-fries and roasted vegetable medleys.');
  addProduct('Zucchini Green', 'Exotic Vegetables', 3.00, null, 'kg', false);
  addProduct('Zucchini Yellow', 'Exotic Vegetables', 3.50, 3.00, 'kg', true);
  addProduct('Red Bell Pepper', 'Exotic Vegetables', 4.50, 4.00, 'kg', false);
  addProduct('Yellow Bell Pepper', 'Exotic Vegetables', 4.50, null, 'kg', true);
  addProduct('Cherry Tomato', 'Exotic Vegetables', 2.50, null, 'box (250g)', true);
  addProduct('Asparagus', 'Exotic Vegetables', 8.00, 7.00, 'bunch', false);
  addProduct('Celery', 'Exotic Vegetables', 3.00, null, 'bunch', true);
  addProduct('Parsley', 'Exotic Vegetables', 2.00, null, 'bunch', false);
  addProduct('Baby Corn', 'Exotic Vegetables', 1.50, 1.20, 'box', true);

  // Citrus Fruits
  addProduct('Lemon', 'Citrus Fruits', 2.50, 2.00, 'kg', true, 'Fresh lemons with bright zest and a tart flavor, perfect for refreshing drinks and zesty recipes.');
  addProduct('Sweet Lime', 'Citrus Fruits', 2.20, null, 'kg', true, 'Juicy sweet limes with a mellow citrus flavor, excellent for juices and cooling summer drinks.');
  addProduct('Grapefruit', 'Citrus Fruits', 3.50, 3.00, 'kg', false, 'Large, ruby-fleshed grapefruits with tangy sweetness for a revitalizing breakfast boost.');
  addProduct('Kinnow Mandarin', 'Citrus Fruits', 4.00, 3.50, 'kg', true, 'Easy-peel kinnow mandarins with a rich citrus aroma and vibrant sweetness.');
  addProduct('Lime', 'Citrus Fruits', 1.80, null, 'kg', false, 'Fresh garden limes, perfect for brightening salads, marinades, and cocktails.');

  // Berries
  addProduct('Blueberry', 'Berries', 8.00, 7.20, 'box (125g)', false, 'Sweet and tart blueberries packed with antioxidants, ideal for breakfast bowls and desserts.');
  addProduct('Raspberry', 'Berries', 9.00, 8.00, 'box (125g)', true, 'Delicate raspberries with rich berry flavor, perfect for smoothies and gourmet desserts.');
  addProduct('Blackberry', 'Berries', 9.50, null, 'box (125g)', true, 'Luscious blackberries with a juicy burst of flavor, excellent in jams and salads.');
  addProduct('Strawberry Basket', 'Berries', 6.00, 5.00, 'box (250g)', false, 'Sweet ripe strawberries with fragrant aroma and bright red color for every indulgent bite.');
  addProduct('Mulberry', 'Berries', 7.00, null, 'box (250g)', true, 'Soft, juicy mulberries with a rich, sweet flavor that elevates smoothies and baked treats.');

  // Tropical Fruits
  addProduct('King Coconut', 'Tropical Fruits', 5.00, 4.50, 'piece', true, 'Refreshing king coconut water with natural electrolytes, perfect for hydration on warm days.');
  addProduct('Custard Apple', 'Tropical Fruits', 5.50, 4.90, 'kg', true, 'Creamy custard apples with sweet pulp and exotic flavor, a tropical dessert favorite.');
  addProduct('Jamun', 'Tropical Fruits', 4.20, null, 'kg', false, 'Tangy jamun fruit with rich color and healthful nutrients from the tropics.');
  addProduct('Sapodilla', 'Tropical Fruits', 4.00, null, 'kg', true, 'Sweet sapodilla with a caramel-like taste, perfect for snacking and natural smoothies.');
  addProduct('Pineapple Queen', 'Tropical Fruits', 3.50, 2.90, 'piece', false, 'Sweet, golden pineapple with juicy flesh and a refreshing tropical aroma.');

  // Salad Greens
  addProduct('Romaine Lettuce', 'Salad Greens', 2.80, 2.40, 'piece', true, 'Crisp romaine lettuce with firm ribs and a crunchy texture, perfect for classic salads.');
  addProduct('Arugula / Rocket', 'Salad Greens', 3.20, 2.80, 'box', true, 'Peppery arugula leaves that add a bold, gourmet note to salads and sandwiches.');
  addProduct('Watercress', 'Salad Greens', 3.00, null, 'bunch', true, 'Tender watercress with a fresh, peppery bite, ideal for salads and soups.');
  addProduct('Baby Spinach', 'Salad Greens', 3.50, 3.00, 'box', true, 'Mild baby spinach leaves for smoothies, salads, and light sautés.');
  addProduct('Mesclun Mix', 'Salad Greens', 4.00, 3.50, 'box', true, 'Premium mixed salad greens for effortless gourmet salads with vibrant texture.');

  // Organic Fruits
  addProduct('Organic Apple', 'Organic Fruits', 5.00, 4.20, 'kg', true, 'Certified organic apples grown without chemical sprays for naturally sweet, crisp fruit.');
  addProduct('Organic Banana', 'Organic Fruits', 2.50, 2.20, 'kg', true, 'Naturally ripened organic bananas with creamy texture and gentle sweetness.');
  addProduct('Organic Orange', 'Organic Fruits', 4.50, 4.00, 'kg', true, 'Fresh organic oranges with juicy segments and bright citrus flavor.');
  addProduct('Organic Pear', 'Organic Fruits', 5.50, null, 'kg', true, 'Soft, fragrant organic pears that offer a smooth, honeyed sweetness.');
  addProduct('Organic Strawberry', 'Organic Fruits', 8.50, 7.50, 'box (250g)', true, 'Hand-picked organic strawberries, intensely sweet and perfect for guilt-free treats.');

  // Root Vegetables
  addProduct('Sweet Potato', 'Root Vegetables', 2.00, null, 'kg', true);
  addProduct('Tapioca / Cassava', 'Root Vegetables', 1.50, null, 'kg', false);
  addProduct('Turnip', 'Root Vegetables', 1.80, null, 'kg', true);
  addProduct('Elephant Yam / Suran', 'Root Vegetables', 2.50, 2.00, 'kg', false);
  addProduct('Fresh Ginger', 'Root Vegetables', 4.00, null, 'kg', true);
  addProduct('Garlic', 'Root Vegetables', 5.00, 4.50, 'kg', false);
  addProduct('Colocasia / Arbi', 'Root Vegetables', 2.20, null, 'kg', true);

  // Herbs
  addProduct('Fresh Basil', 'Herbs', 1.50, null, 'bunch', true, 'Highly aromatic sweet basil. The soul of Italian cuisine, providing that unmistakable fresh fragrance to your pestos and Margherita pizzas.');
  addProduct('Rosemary', 'Herbs', 2.00, 1.50, 'bunch', false);
  addProduct('Thyme', 'Herbs', 2.00, null, 'bunch', true);
  addProduct('Lemongrass', 'Herbs', 1.00, null, 'bunch', false);
  addProduct('Oregano Fresh', 'Herbs', 2.50, null, 'bunch', true);

  // Salads & Juices
  addProduct('Mixed Salad Box', 'Salads & Juices', 3.50, 3.00, 'box', true, 'A gourmet blend of seasonal baby leaves and microgreens. Pre-washed and ready to be drizzled with your favorite vinaigrette for a quick, healthy meal.');
  addProduct('Caesar Salad Kit', 'Salads & Juices', 4.50, null, 'box', false);
  addProduct('Fresh Orange Juice', 'Salads & Juices', 3.00, null, 'bottle (250ml)', true);
  addProduct('Cold Pressed Detox Juice', 'Salads & Juices', 4.00, 3.50, 'bottle (250ml)', true);

  // Seasonal Fruits
  addProduct('Lychee', 'Seasonal Fruits', 6.00, 5.00, 'box (500g)', false);
  addProduct('Alphonso Mango', 'Seasonal Fruits', 8.99, null, 'kg', true);
  addProduct('Indian Plum', 'Seasonal Fruits', 4.00, null, 'kg', false);
  addProduct('Sitaphal / Custard Apple', 'Seasonal Fruits', 5.50, 4.50, 'kg', true);

  // Organic Vegetables
  addProduct('Organic Tomato', 'Organic Vegetables', 2.00, null, 'kg', true);
  addProduct('Organic Onion', 'Organic Vegetables', 2.50, null, 'kg', true);
  addProduct('Organic Potato', 'Organic Vegetables', 1.50, 1.20, 'kg', true);
  addProduct('Organic Cucumber', 'Organic Vegetables', 1.80, null, 'kg', true);
  addProduct('Organic Carrots', 'Organic Vegetables', 3.00, null, 'kg', true);
  addProduct('Organic Beetroot', 'Organic Vegetables', 2.50, null, 'kg', true);
  
  // Regional Favorites
  addProduct('Madras Cucumber', 'Regional Favorites', 1.50, null, 'kg', false);
  addProduct('Snake Gourd', 'Regional Favorites', 1.80, null, 'kg', true);
  addProduct('Ridge Gourd', 'Regional Favorites', 2.00, 1.50, 'kg', false);
  addProduct('Ash Gourd', 'Regional Favorites', 1.20, null, 'kg', true);
  addProduct('Tinda', 'Regional Favorites', 2.50, null, 'kg', false);
  addProduct('Banana Stem', 'Regional Favorites', 1.00, null, 'piece', true);
  addProduct('Banana Flower', 'Regional Favorites', 1.50, null, 'piece', false);

  // Dry Fruits
  addProduct('California Almonds', 'Dry Fruits', 15.00, 14.00, 'kg', false, 'Select California almonds, lightly toasted to perfection. A crunchy, nutrient-dense snack that provides essential healthy fats and proteins.');
  addProduct('Cashew Nuts W320', 'Dry Fruits', 18.00, 16.50, 'kg', true);
  addProduct('Indian Raisins', 'Dry Fruits', 8.00, null, 'kg', false);
  addProduct('Walnut Kernels', 'Dry Fruits', 22.00, 20.00, 'kg', true);
  addProduct('Pistachios Roasted', 'Dry Fruits', 25.00, null, 'kg', false);
  addProduct('Dried Figs / Anjeer', 'Dry Fruits', 16.00, 14.50, 'kg', true);
  
  // Flowers
  addProduct('Marigold Flowers', 'Flowers', 2.00, null, 'kg', true);
  addProduct('Jasmine String', 'Flowers', 1.50, null, 'meter', false);
  addProduct('Red Roses', 'Flowers', 3.00, 2.50, 'bunch (10 stems)', true, 'Artisanal long-stemmed red roses. Each bloom is selected for its vibrant color and velvety texture, perfect for adding a touch of elegance to any space.');
  addProduct('Lotus', 'Flowers', 1.00, null, 'piece', false);

  // Sprouts
  addProduct('Moong Sprouts', 'Sprouts', 1.50, 1.20, 'pack (200g)', true);
  addProduct('Mixed Bean Sprouts', 'Sprouts', 2.00, null, 'pack (200g)', false);
  addProduct('Alfalfa Sprouts', 'Sprouts', 3.00, 2.50, 'pack (100g)', true);

  // Mushroom Varieties
  addProduct('White Button Mushroom', 'Mushroom Varieties', 2.50, null, 'pack (200g)', false, 'Pristine white button mushrooms, cultivated in climate-controlled environments for consistent quality and a mild, versatile flavor.');
  addProduct('Oyster Mushroom', 'Mushroom Varieties', 3.50, 3.00, 'pack (200g)', true);
  addProduct('Milky Mushroom', 'Mushroom Varieties', 3.00, null, 'pack (200g)', false);
  addProduct('Shiitake Mushroom Fresh', 'Mushroom Varieties', 6.00, 5.00, 'pack (200g)', true);

  return products;
};

module.exports = {
  categories,
  products: generateProducts(),
};
