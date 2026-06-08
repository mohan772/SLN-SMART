const dotenv = require('dotenv');

// Load env vars first so the Supabase client can use them.
dotenv.config({ path: './.env' });

const supabase = require('./config/supabase');
const { categories, products } = require('./data/seedData');

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const seedDatabase = async () => {
  try {
    console.log('Seeding Supabase Database...');

    // 1. Clear existing data (Optional, be careful)
    // For a fresh seed, we might want to delete existing rows.
    // NOTE: Foreign key constraints might require specific order or TRUNCATE CASCADE.
    console.log('Clearing existing categories and products...');
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // 2. Seed Categories
    console.log('Inserting categories...');
    const { data: insertedCategories, error: catError } = await supabase
      .from('categories')
      .insert(categories)
      .select();

    if (catError) throw catError;
    console.log(`${insertedCategories.length} categories inserted.`);

    // Create a map for name -> id
    const categoryMap = {};
    insertedCategories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });

    // 3. Seed Products
    console.log('Preparing products...');
    const productsToInsert = products.map(p => {
      const categoryId = categoryMap[p.categoryName];
      if (!categoryId) {
        console.warn(`Category not found for product: ${p.name}`);
      }

      return {
        name: p.name,
        description: p.description,
        price: p.price,
        discount_price: p.discountPrice,
        unit: p.unit,
        images: p.images,
        category_id: categoryId,
        category_slug: slugify(p.categoryName),
        stock: p.stock,
        rating: p.rating,
        num_reviews: p.numReviews,
        is_featured: p.isFeatured,
        is_organic: p.isOrganic,
        nutritional_info: p.nutritionalInfo,
        farmer_details: p.farmerDetails,
        visibility: true,
        is_deleted: false
      };
    }).filter(p => p.category_id);

    console.log(`Inserting ${productsToInsert.length} products...`);
    // Insert in batches if necessary, but 100+ should be fine in one go
    const { data: insertedProducts, error: prodError } = await supabase
      .from('products')
      .insert(productsToInsert)
      .select();

    if (prodError) throw prodError;
    console.log(`${insertedProducts.length} products inserted.`);

    console.log('Database seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Seeding Error:', err.message);
    process.exit(1);
  }
};

seedDatabase();
