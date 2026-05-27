const express = require('express');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getCategories);
router.get('/:id', getCategory);

const upload = require('../middleware/uploadMiddleware');

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), upload.single('image'), createCategory);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

module.exports = router;
