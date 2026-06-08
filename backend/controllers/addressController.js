const supabase = require('../config/supabase');

exports.getAddresses = async (req, res, next) => {
  try {
    const { data: addresses, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', req.user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({ success: true, count: addresses.length, data: addresses })
  } catch (err) {
    next(err)
  }
}

exports.createAddress = async (req, res, next) => {
  try {
    const addressData = { user_id: req.user.id, ...req.body };
    
    const { data: address, error } = await supabase
      .from('addresses')
      .insert(addressData)
      .select()
      .single();

    if (error) throw error;

    if (address.is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', req.user.id)
        .neq('id', address.id);
    }

    res.status(201).json({ success: true, data: address })
  } catch (err) {
    next(err)
  }
}

exports.updateAddress = async (req, res, next) => {
  try {
    const { data: address, error } = await supabase
      .from('addresses')
      .update(req.body)
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error || !address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    if (address.is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', req.user.id)
        .neq('id', address.id);
    }

    res.status(200).json({ success: true, data: address })
  } catch (err) {
    next(err)
  }
}

exports.deleteAddress = async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.status(200).json({ success: true, message: 'Address removed' })
  } catch (err) {
    next(err)
  }
}
