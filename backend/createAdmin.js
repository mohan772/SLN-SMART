const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const supabase = require('./config/supabase');

const setupAdmin = async () => {
  try {
    // Check if user exists
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('id')
      .or('email.eq.admin@sln.com,username.eq.admin')
      .maybeSingle();

    if (user) {
      console.log('Admin already exists. Updating...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      const { error: updateError } = await supabase
        .from('users')
        .update({
          role: 'admin',
          password: hashedPassword,
          is_verified: true
        })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      console.log('Admin user updated. Username: admin, Password: password123');
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);

      const { error: insertError } = await supabase
        .from('users')
        .insert({
          username: 'admin',
          name: 'Super Admin',
          email: 'admin@sln.com',
          password: hashedPassword,
          role: 'admin',
          is_verified: true
        });

      if (insertError) throw insertError;
      console.log('Created new admin user. Username: admin, Password: password123');
    }
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

setupAdmin();
