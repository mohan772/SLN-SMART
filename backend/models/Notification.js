const mongoose = require('mongoose')

const notificationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a notification title'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please add a notification message'],
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('Notification', notificationSchema)
