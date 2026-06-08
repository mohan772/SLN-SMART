const supabase = require('../config/supabase');

// @desc    Get public site statistics
// @route   GET /api/stats
// @access  Public
exports.getSiteStats = async (req, res, next) => {
  try {
    const [
      { data: allOrders },
      { data: deliveredOrders },
      { data: allProducts }
    ] = await Promise.all([
      supabase.from('orders').select('user_id, shipping_address'),
      supabase.from('orders').select('created_at, delivered_at').eq('status', 'Delivered'),
      supabase.from('products').select('farmer_details').not('is_deleted', 'eq', true)
    ]);

    // Happy Customers (Unique users)
    const happyCustomersCount = allOrders ? new Set(allOrders.map(o => o.user_id)).size : 0;

    // Cities Covered
    const cities = allOrders ? new Set(allOrders.map(o => o.shipping_address?.city).filter(Boolean)) : new Set();
    const citiesCovered = cities.size;

    // Farm Partners
    const farmers = allProducts ? new Set(allProducts.map(p => p.farmer_details?.name).filter(Boolean)) : new Set();
    const farmPartners = farmers.size;

    const ordersDelivered = deliveredOrders ? deliveredOrders.length : 0;

    let averageDeliveryTime = '45 min';
    if (deliveredOrders && deliveredOrders.length > 0) {
      const totalMinutes = deliveredOrders.reduce((sum, order) => {
        const created = new Date(order.created_at).getTime();
        const delivered = new Date(order.delivered_at).getTime();
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
