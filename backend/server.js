const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const errorHandler = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Route files
const auth = require('./routes/authRoutes');
const products = require('./routes/productRoutes');
const orders = require('./routes/orderRoutes');
const payment = require('./routes/paymentRoutes');
const cart = require('./routes/cartRoutes');
const categories = require('./routes/categoryRoutes');
const reviews = require('./routes/reviewRoutes');
const addresses = require('./routes/addressRoutes');
const wishlist = require('./routes/wishlistRoutes');
const coupons = require('./routes/couponRoutes');
const notifications = require('./routes/notificationRoutes');
const password = require('./routes/passwordRoutes');
const inventory = require('./routes/inventoryRoutes');
const stats = require('./routes/statsRoutes');
const recentlyViewed = require('./routes/recentlyViewedRoutes');

const app = express();

// Security Middleware
app.use(helmet());

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routers
app.use('/api/auth', auth);
app.use('/api/products', products);
app.use('/api/orders', orders);
app.use('/api/payment', payment);
app.use('/api/cart', cart);
app.use('/api/categories', categories);
app.use('/api/reviews', reviews);
app.use('/api/addresses', addresses);
app.use('/api/wishlist', wishlist);
app.use('/api/coupons', coupons);
app.use('/api/notifications', notifications);
app.use('/api/password', password);
app.use('/api/inventory', inventory);
app.use('/api/stats', stats);
app.use('/api/recently-viewed', recentlyViewed);

// Serve static files from uploads folder

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Port Configuration
const PORT = process.env.PORT || 5000;

// Global Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
