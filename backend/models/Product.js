const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  discountPrice: {
    type: Number,
  },
  unit: {
    type: String,
    required: [true, 'Please add a unit (e.g., kg, gram, bunch)'],
    default: 'kg',
  },
  images: {
    type: [String],
    default: ['no-photo.jpg'],
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Please add a category'],
  },
  categorySlug: {
    type: String,
    required: [true, 'Please add a category slug'],
    trim: true,
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isOrganic: {
    type: Boolean,
    default: true,
  },
  nutritionalInfo: {
    calories: String,
    vitamins: [String],
    minerals: [String],
  },
  farmerDetails: {
    name: String,
    location: String,
    image: String,
  },
  trending: {
    type: Boolean,
    default: false,
  },
  seasonal: {
    type: Boolean,
    default: false,
  },
  demandLevel: {
    type: String,
    enum: ['Low', 'Normal', 'High'],
    default: 'Normal',
  },
  visibility: {
    type: Boolean,
    default: true,
  },
  supplier: {
    name: String,
    contactInfo: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

productSchema.index({ name: 'text', description: 'text', categorySlug: 'text', 'farmerDetails.name': 'text' });

module.exports = mongoose.model('Product', productSchema);

