const mongoose = require('mongoose')

const addressSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    label: {
      type: String,
      default: 'Home',
      trim: true,
    },
    line1: {
      type: String,
      required: [true, 'Please add a street address'],
      trim: true,
    },
    line2: {
      type: String,
      trim: true,
      default: '',
    },
    city: {
      type: String,
      required: [true, 'Please add a city'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'Please add a state'],
      trim: true,
    },
    postalCode: {
      type: String,
      required: [true, 'Please add a postal code'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Please add a country'],
      default: 'United States',
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('Address', addressSchema)
