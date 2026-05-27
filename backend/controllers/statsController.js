const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get public site statistics
// @route   GET /api/stats
// @access  Public
exports.getSiteStats = async (req, res, next) => {
  try {
    const [happyCustomers, cityList, farmerNames, ordersDelivered, deliveredOrders] = await Promise.all([
      Order.distinct('user'),
      Order.distinct('shippingAddress.city'),
      Product.distinct('farmerDetails.name', { 'farmerDetails.name': { $nin: [null, ''] } }),
      Order.countDocuments({ status: 'Delivered' }),
      Order.find({ status: 'Delivered', deliveredAt: { $exists: true } }, 'createdAt deliveredAt'),
    ]);

    const citiesCovered = cityList.filter(Boolean).length;
    const farmPartners = farmerNames.filter(Boolean).length;
    const happyCustomersCount = happyCustomers.filter(Boolean).length;

    let averageDeliveryTime = '45 min';
    if (deliveredOrders.length > 0) {
      const totalMinutes = deliveredOrders.reduce((sum, order) => {
        const created = new Date(order.createdAt).getTime();
        const delivered = new Date(order.deliveredAt).getTime();
        if (!created || !delivered || delivered <= created) {
          return sum;
        }
        return sum + (delivered - created) / 60000;
      }, 0);
      const avgMinutes = Math.round(totalMinutes / deliveredOrders.length);
      if (avgMinutes > 0) {
        averageDeliveryTime = `${avgMinutes} min`;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        happyCustomers: happyCustomersCount,
        farmPartners,
        citiesCovered,
        ordersDelivered,
        averageDeliveryTime,
      },
    });
  } catch (err) {
    next(err);
  }
};
