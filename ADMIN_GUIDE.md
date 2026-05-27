# Admin Management Guide - SLN Smart Vegetable Shop

Complete guide for administrators managing the grocery platform.

## 📊 Admin Dashboard Overview

Access admin panel at: `/admin`

### Dashboard Sections

1. **Overview** - Key metrics and statistics
2. **Products** - Add, edit, delete products
3. **Categories** - Manage product categories
4. **Orders** - View and manage customer orders
5. **Customers** - Manage user accounts
6. **Inventory** - Stock management
7. **Analytics** - Sales reports and insights
8. **Settings** - Platform configuration

---

## 🛍️ Product Management

### Add New Product

1. Go to **Admin** → **Products**
2. Click **"Add Product"** button
3. Fill in details:
   - **Product Name**: e.g., "Fresh Tomatoes"
   - **Description**: Detailed description
   - **Category**: Select from dropdown
   - **Price**: ₹ amount
   - **Discount**: Optional discount %
   - **Stock**: Current quantity
   - **Image**: Upload product image
   - **Is Organic**: Check if certified organic
   - **Unit**: e.g., "1 Kg", "500g"

4. Click **"Save Product"**

### Edit Product

1. Go to **Products**
2. Find product in list
3. Click **Edit** icon
4. Update details
5. Click **Save Changes**

### Delete Product

1. Go to **Products**
2. Find product in list
3. Click **Delete** icon
4. Confirm deletion

### Bulk Upload Products

```bash
# Create CSV file with headers:
name,category,price,discount,stock,unit,isOrganic,description

# Example:
Tomatoes,Vegetables,50,10,100,1 Kg,true,Fresh red tomatoes
Apples,Fruits,80,5,50,500g,true,Premium red apples
```

Import CSV file in Products section.

---

## 📦 Inventory Management

### Update Stock

1. Go to **Inventory**
2. Search product
3. Update quantity
4. Set low stock alert threshold
5. Save

### Low Stock Alerts

- Products with stock < threshold show warning
- Automatic notifications to admin
- Get alerts when stock < 10 units

### Stock History

View all stock changes:
- Date of change
- Previous quantity
- New quantity
- Changed by (user)
- Reason (Sale, Purchase, Return)

---

## 📋 Order Management

### View Orders

1. Go to **Orders**
2. Filter by:
   - **Status**: Pending, Ordered, Packed, Shipped, Delivered
   - **Date Range**: Select dates
   - **Payment Status**: Paid, Pending, Failed
   - **Customer**: Search by name/email

### Update Order Status

1. Click on order
2. Current status shown
3. Select new status:
   - **Pending** → Order created, awaiting processing
   - **Ordered** → Payment received, ready to pack
   - **Packed** → Items packed and ready
   - **Shipped** → Handed to delivery partner
   - **Out for Delivery** → Delivery in progress
   - **Delivered** → Successfully delivered
   - **Cancelled** → Order cancelled
   - **Refunded** → Money returned to customer

4. Add note (optional): "Delay due to stock shortage"
5. Click **Update Status**

### Assign Delivery Person

1. Open order
2. Click **Assign Delivery**
3. Select delivery person from list
4. Set estimated delivery time
5. Save

### Generate Invoice

1. Open order
2. Click **Generate Invoice**
3. PDF will be created
4. Send to customer via email
5. Download for records

### Process Refund

1. Open cancelled/returned order
2. Click **Process Refund**
3. Verify payment details
4. Initiate refund in Razorpay
5. Mark order as "Refunded"

---

## 👥 Customer Management

### View Customers

1. Go to **Customers**
2. See list of all customers
3. Click on customer to view:
   - Profile information
   - Order history
   - Wishlist
   - Saved addresses
   - Spending history

### Manage Customer Accounts

- **Block Customer**: Prevents login
- **Unblock Customer**: Restores access
- **Send Message**: Email customer
- **View Tickets**: Support requests
- **Export Data**: Export customer information

### Customer Segments

Create segments for targeted offers:
- High spenders (> ₹10,000)
- Regular customers (> 5 orders)
- New customers (< 1 month)
- Inactive customers (no order in 30 days)

---

## 🏷️ Category Management

### Add Category

1. Go to **Categories**
2. Click **Add Category**
3. Fill in:
   - **Name**: e.g., "Vegetables"
   - **Description**: Category description
   - **Image**: Category banner
   - **Slug**: auto-generated URL slug

4. Save

### Edit Category

1. Click category
2. Update details
3. Save changes

### Delete Category

⚠️ Can only delete if no products assigned

1. First move all products to another category
2. Then delete category

---

## 📊 Analytics & Reports

### Sales Analytics

- Total sales (daily, weekly, monthly)
- Average order value
- Top selling products
- Revenue trends
- Payment method breakdown

### Customer Analytics

- New customers (today, this week, this month)
- Repeat customer rate
- Average customer lifetime value
- Churn rate

### Product Analytics

- Best sellers
- Slow moving products
- Product profit margins
- Stock turnover rate

### Generate Reports

1. Go to **Analytics**
2. Select report type
3. Choose date range
4. Click **Generate**
5. Download as PDF/Excel

---

## 💳 Payment Management

### Razorpay Dashboard

Access: https://dashboard.razorpay.com

### Monitor Payments

1. View all transactions
2. Check payment status
3. Handle failed payments
4. Process refunds
5. Download transaction history

### Verify Payment Issues

If payment failed:

1. Go to **Orders** → Failed
2. Click on order
3. Check Razorpay transaction ID
4. View error message
5. Contact customer

---

## ⚙️ Settings & Configuration

### General Settings

- **App Name**: SLN Smart Vegetable Shop
- **Support Email**: support@sln-grocery.com
- **Support Phone**: +91-1234567890
- **Business Hours**: 8 AM - 8 PM

### Delivery Settings

- **Delivery Radius**: 10 km
- **Free Delivery Above**: ₹500
- **Base Delivery Charge**: ₹50
- **Delivery Time Slots**: Configure available slots

### Tax Settings

- **Tax Rate**: 5% on vegetables
- **Tax Calculation**: Per item

### Discount Settings

- **Max Discount %**: 50%
- **Min Order for Discount**: ₹200

### Email Configuration

- **SMTP Server**: smtp.gmail.com
- **From Email**: noreply@sln-grocery.com
- **Support Email**: support@sln-grocery.com

---

## 🔔 Notifications

### Admin Notifications

Receive alerts for:
- New orders
- Low stock items
- Failed payments
- Customer complaints
- System errors

### Configure Notifications

1. Go to **Settings** → **Notifications**
2. Toggle notifications on/off
3. Set notification channels:
   - Email
   - SMS
   - In-app
   - Push notifications

---

## 📱 Mobile App Administration

### App Features

- Real-time order tracking
- Push notifications
- Offline browsing
- One-click checkout
- Saved payment methods

### App Analytics

Monitor:
- App downloads
- Active users
- Crash reports
- Feature usage
- User ratings

---

## 🛡️ Security Best Practices

### Admin Security

- ✅ Use strong password (min 12 characters)
- ✅ Enable 2-factor authentication
- ✅ Never share login credentials
- ✅ Use VPN for remote access
- ✅ Regularly change password
- ✅ Review login history monthly

### Data Security

- ✅ Regular database backups
- ✅ Encrypt sensitive data
- ✅ Secure payment information
- ✅ GDPR compliance
- ✅ Access logs maintained

### Access Control

Admin roles:
- **Super Admin**: Full access
- **Manager**: Orders + Inventory
- **Support**: Orders + Customers
- **Analyst**: Analytics only (read-only)

### Audit Trail

View all admin actions:
- Who made change
- What changed
- When it changed
- Why (notes)

---

## 🚀 Promotional Campaigns

### Create Flash Sale

1. Go to **Promotions**
2. Click **New Flash Sale**
3. Select products
4. Set discount %
5. Set duration (24 hours)
6. Publish

### Create Coupon

1. Go to **Coupons**
2. Click **New Coupon**
3. Fill in:
   - Code: e.g., "FRESH50"
   - Discount: ₹50 or 10%
   - Min order: ₹500
   - Max uses: 100
   - Expiry date

4. Publish

### Email Campaign

1. Go to **Campaigns**
2. Create new campaign
3. Select customer segment
4. Write email
5. Schedule send time
6. Track opens/clicks

---

## 📞 Support Ticket System

### Manage Support Tickets

1. Go to **Support**
2. View tickets by status:
   - Open
   - In Progress
   - Resolved
   - Closed

3. Click ticket to:
   - Read customer message
   - Reply
   - Attach files
   - Change status
   - Add notes

### Common Issues to Handle

- Order not received
- Payment failed
- Product quality complaint
- Delivery delay
- Return/refund request

---

## 📈 Growth Hacks

### Featured Section

- Feature best sellers
- Highlight new products
- Show flash sales
- Create collections

### Seasonal Campaigns

- **Summer**: Fresh juices, salads
- **Monsoon**: Indoor plants
- **Winter**: Root vegetables
- **Festivals**: Special offers

### Loyalty Program

- Points per order
- Referral bonuses
- Birthday discounts
- VIP tier rewards

---

## 🆘 Troubleshooting

### Common Issues

**Issue**: Order status not updating
- **Solution**: Refresh page, check admin permissions

**Issue**: Low stock not triggering alert
- **Solution**: Set alert threshold in inventory settings

**Issue**: Payment showing failed but amount deducted
- **Solution**: Check Razorpay dashboard, initiate refund if needed

**Issue**: Customer can't login
- **Solution**: Reset password, check account status (not blocked)

**Issue**: Image not uploading
- **Solution**: Check file size < 5MB, format must be JPG/PNG

---

## 📚 Training & Resources

### For New Admins

1. Watch onboarding video
2. Read this guide
3. Practice with test data
4. Shadow experienced admin
5. Start with limited permissions
6. Gradually increase access

### Useful Links

- Admin Dashboard: `/admin`
- API Documentation: `/api/docs`
- Support: support@sln-grocery.com
- Emergency: +91-9876543210

---

## ✅ Daily Checklist

Every morning, admins should:

- [ ] Check new orders
- [ ] Review failed payments
- [ ] Check low stock alerts
- [ ] Respond to support tickets
- [ ] Update order statuses
- [ ] Monitor system health

---

## 🎯 Monthly Goals

Track these metrics:

- Total orders
- Revenue
- Customer satisfaction (NPS)
- Product return rate
- Delivery on-time rate
- Average order value

---

## 📞 Admin Support

**Email**: admin-support@sln-grocery.com
**Phone**: +91-1234567890 (ext: 100)
**Slack**: #admin-support
**Hours**: 9 AM - 6 PM IST

---

**Last Updated**: May 2026
**Version**: 1.0
**Status**: Production Ready

Happy Managing! 🚀
