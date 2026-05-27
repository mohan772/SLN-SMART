const Address = require('../models/Address')

exports.getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 })
    res.status(200).json({ success: true, count: addresses.length, data: addresses })
  } catch (err) {
    next(err)
  }
}

exports.createAddress = async (req, res, next) => {
  try {
    const address = await Address.create({ user: req.user._id, ...req.body })
    if (address.isDefault) {
      await Address.updateMany({ user: req.user._id, _id: { $ne: address._id } }, { isDefault: false })
    }
    res.status(201).json({ success: true, data: address })
  } catch (err) {
    next(err)
  }
}

exports.updateAddress = async (req, res, next) => {
  try {
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true },
    )
    if (!address) {
      return res.status(404).json({ message: 'Address not found' })
    }
    if (address.isDefault) {
      await Address.updateMany({ user: req.user._id, _id: { $ne: address._id } }, { isDefault: false })
    }
    res.status(200).json({ success: true, data: address })
  } catch (err) {
    next(err)
  }
}

exports.deleteAddress = async (req, res, next) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!address) {
      return res.status(404).json({ message: 'Address not found' })
    }
    res.status(200).json({ success: true, message: 'Address removed' })
  } catch (err) {
    next(err)
  }
}
