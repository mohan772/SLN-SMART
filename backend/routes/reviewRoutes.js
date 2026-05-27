const express = require('express')
const { 
    getReviewsByProduct, 
    addReview,
    getMyReviews,
    deleteReview
} = require('../controllers/reviewController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/product/:productId', getReviewsByProduct)
router.post('/product/:productId', protect, addReview)
router.get('/myreviews', protect, getMyReviews)
router.delete('/:id', protect, deleteReview)

module.exports = router;
