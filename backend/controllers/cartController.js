const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get logged in user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    const productIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex > -1) {
      // Product exists in cart, update quantity
      cart.items[productIndex].quantity += quantity;
    } else {
      // Product does not exist in cart, add new item
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    cart = await cart.populate('items.product');

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const productIndex = cart.items.findIndex(
      (item) => item.product.toString() === req.params.productId
    );

    if (productIndex > -1) {
      cart.items[productIndex].quantity = quantity;
      if (quantity <= 0) {
        cart.items.splice(productIndex, 1);
      }
      await cart.save();
    }

    const updatedCart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    res.status(200).json({
      success: true,
      data: updatedCart,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
exports.removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    await cart.save();
    const updatedCart = await Cart.findOne({ user: req.user.id }).populate('items.product');

    res.status(200).json({
      success: true,
      data: updatedCart,
    });
  } catch (err) {
    next(err);
  }
};
