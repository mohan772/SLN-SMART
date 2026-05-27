const express = require('express');
const {
  addRecentlyViewed,
  getRecentlyViewed,
} = require('../controllers/recentlyViewedController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.post('/', addRecentlyViewed);
router.get('/', getRecentlyViewed);

module.exports = router;
