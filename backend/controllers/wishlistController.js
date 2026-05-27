const Wishlist = require('../models/Wishlist')

exports.getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('items.product')
    res.status(200).json({ success: true, data: wishlist || { items: [] } })
  } catch (err) {
    next(err)
  }
}

exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body
    let wishlist = await Wishlist.findOne({ user: req.user._id })
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, items: [{ product: productId }] })
      return res.status(201).json({ success: true, data: wishlist })
    }

    const exists = wishlist.items.some((item) => item.product.toString() === productId)
    if (!exists) {
      wishlist.items.push({ product: productId })
      await wishlist.save()
    }

    res.status(200).json({ success: true, data: wishlist })
  } catch (err) {
    next(err)
  }
}

exports.removeFromWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id })
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' })
    }
    wishlist.items = wishlist.items.filter((item) => item.product.toString() !== req.params.productId)
    await wishlist.save()
    res.status(200).json({ success: true, data: wishlist })
  } catch (err) {
    next(err)
  }
}
