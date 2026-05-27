const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/search', require('../controllers/productController').searchProducts);
router.get('/', getProducts);
router.get('/category/:slug', require('../controllers/productController').getProductsByCategory);
router.get('/:id', getProduct);


const upload = require('../middleware/uploadMiddleware');

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), upload.array('images', 5), createProduct);
router.put('/:id', protect, authorize('admin'), upload.array('images', 5), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
