const Notification = require('../models/Notification')

exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10)
    res.status(200).json({ success: true, count: notifications.length, data: notifications })
  } catch (err) {
    next(err)
  }
}

exports.markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true },
    )
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' })
    }
    res.status(200).json({ success: true, data: notification })
  } catch (err) {
    next(err)
  }
}
