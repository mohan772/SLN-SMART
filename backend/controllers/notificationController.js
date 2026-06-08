const supabase = require('../config/supabase')

exports.getNotifications = async (req, res, next) => {
  try {
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    res.status(200).json({ success: true, count: notifications.length, data: notifications })
  } catch (err) {
    next(err)
  }
}

exports.markNotificationRead = async (req, res, next) => {
  try {
    const { data: notification, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error || !notification) {
      return res.status(404).json({ message: 'Notification not found' })
    }
    res.status(200).json({ success: true, data: notification })
  } catch (err) {
    next(err)
  }
}
