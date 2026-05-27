const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Category = require('./models/Category');
const { categories, products } = require('./data/seedData');

// Load env vars
dotenv.config({ path: './.env' });

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully.');

    console.log('Deleting existing collections to clear indexes...');
    try { await Product.collection.drop(); } catch(e) {}
    try { await Category.collection.drop(); } catch(e) {}
    console.log('Existing collections dropped.');

    console.log('Inserting categories...');
    const insertedCategories = await Category.insertMany(categories);
    console.log(`${insertedCategories.length} categories inserted.`);

    // Map category names to their new ObjectIds
    const categoryMap = {};
    insertedCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    console.log('Inserting products...');
    const productsWithCategoryIds = products.map((prod) => {
      const categoryId = categoryMap[prod.categoryName];
      if (!categoryId) {
        console.warn(`Warning: Category not found for product ${prod.name}`);
      }
      
      const categorySlug = prod.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      return {
        ...prod,
        category: categoryId,
        categorySlug: categorySlug,
      };
    });

    const insertedProducts = await Product.insertMany(productsWithCategoryIds);
    console.log(`${insertedProducts.length} products inserted.`);

    console.log('Database seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();
