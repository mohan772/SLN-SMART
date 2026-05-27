const express = require('express');
const { 
    getInventoryAnalytics, 
    getAutoPriceSuggestion,
    restockProduct,
    getInventoryLogs
} = require('../controllers/inventoryController');

const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

// Protect all inventory routes for admin only
router.use(protect);
router.use(authorize('admin'));

router.get('/analytics', getInventoryAnalytics);
router.get('/price-suggestion/:id', getAutoPriceSuggestion);
router.post('/restock/:id', restockProduct);
router.get('/logs', getInventoryLogs);

module.exports = router;
