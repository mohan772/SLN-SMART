# SLN Smart Vegetable Shop - Production Deployment Guide

## Prerequisites
- Node.js v18+
- MongoDB Atlas Account
- Razorpay Account
- Vercel Account (for frontend)
- Render Account (for backend)
- Cloudinary Account (for images)
- Git & GitHub

## Phase 1: Backend Deployment on Render

### 1. Prepare Your Backend

```bash
cd backend

# Create production build
npm run build

# Test production setup locally
NODE_ENV=production npm start
```

### 2. Create MongoDB Atlas Cluster

1. Go to mongodb.com/cloud/atlas
2. Create free tier cluster
3. Create database user with strong password
4. Whitelist IP address (or 0.0.0.0 for all)
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/sln-grocery`

### 3. Setup Render Deployment

1. Push your code to GitHub
2. Go to render.com and sign in
3. Click "Create +" → "Web Service"
4. Select your GitHub repository
5. Fill in details:
   - **Name**: `sln-grocery-api`
   - **Environment**: Node
   - **Region**: Singapore (closest to India)
   - **Branch**: main
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 4. Add Environment Variables on Render

Go to Environment on your Render service and add:

```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sln-grocery
JWT_SECRET=your_strong_random_secret_key_min_32_chars
JWT_EXPIRE=7d
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
EMAIL_FROM=noreply@sln-grocery.com
FRONTEND_URL=https://your-frontend-url.com
```

### 5. Deploy

1. Commit and push to GitHub
2. Render will automatically deploy
3. Your API will be available at: `https://sln-grocery-api.onrender.com`

---

## Phase 2: Frontend Deployment on Vercel

### 1. Prepare Your Frontend

```bash
cd frontend

# Install dependencies
npm install

# Build for production
npm run build

# Test build locally
npm run preview
```

### 2. Update Environment Variables

Create `.env.production.local`:

```
VITE_API_URL=https://sln-grocery-api.onrender.com/api
VITE_RAZORPAY_KEY_ID=your_razorpay_public_key
VITE_APP_NAME=SLN Smart Vegetable Shop
```

### 3. Deploy on Vercel

#### Option A: Using Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

#### Option B: Using GitHub Integration

1. Go to vercel.com and sign in
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. Configure:
   - **Framework**: React
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 4. Add Environment Variables on Vercel

In Project Settings → Environment Variables:

```
VITE_API_URL=https://sln-grocery-api.onrender.com/api
VITE_RAZORPAY_KEY_ID=your_razorpay_public_key
VITE_APP_NAME=SLN Smart Vegetable Shop
```

### 5. Deploy

Push to GitHub and Vercel will automatically deploy.
Your site will be live at: `https://sln-grocery.vercel.app` (or your custom domain)

---

## Phase 3: Custom Domain Setup

### Option 1: Vercel Domain

1. Go to Project Settings → Domains
2. Add your domain (e.g., `sln-grocery.com`)
3. Add DNS records from Vercel
4. Update backend CORS to allow your domain

### Option 2: External Domain (GoDaddy, Namecheap, etc.)

1. Point nameservers to Vercel's nameservers
2. OR add CNAME record to `cname.vercel.com`
3. Configure in Vercel dashboard

### Update Backend CORS

In `backend/server.js`:

```javascript
const corsOptions = {
  origin: [
    'https://sln-grocery.com',
    'https://www.sln-grocery.com',
    'http://localhost:5173'
  ],
  credentials: true
};

app.use(cors(corsOptions));
```

---

## Phase 4: Razorpay Live Mode Setup

1. Login to Razorpay Dashboard
2. Go to Settings → API Keys
3. Switch to Live Mode
4. Copy Live Key ID and Secret
5. Update environment variables on Render and Vercel
6. Add webhook for payment confirmations

### Razorpay Webhook Setup

1. Go to Webhooks section
2. Add endpoint: `https://sln-grocery-api.onrender.com/api/payment/webhook`
3. Select events: `payment.authorized`, `payment.failed`
4. Copy webhook secret

---

## Phase 5: SSL/TLS Certificate

- Vercel: Automatically provided
- Render: Automatically provided
- Both support HTTPS by default

---

## Phase 6: Monitoring & Logging

### Render Logs

```bash
# View real-time logs
vercel logs sln-grocery-api
```

### Monitoring

- Monitor uptime: uptimerobot.com
- Monitor errors: sentry.io
- Monitor performance: newrelic.com

---

## Phase 7: Database Backups

### MongoDB Atlas

1. Go to Backup section
2. Enable automated backup (M10+ plan needed) or
3. Use manual snapshots
4. Download/restore as needed

---

## Phase 8: Security Checklist

- [x] JWT_SECRET set (strong, random)
- [x] Helmet.js enabled for security headers
- [x] CORS properly configured
- [x] Environment variables not in git
- [x] Rate limiting implemented
- [x] HTTPS/SSL enabled everywhere
- [x] Razorpay signature verification
- [x] Input validation on all endpoints
- [x] Database indexes created
- [x] Error messages don't leak sensitive info

---

## Phase 9: Performance Optimization

### Frontend (Vercel)

```bash
# Analyze build
npm run build

# Check lighthouse
vercel analytics
```

### Backend (Render)

- Use connection pooling
- Enable compression
- Cache frequently accessed data
- Use CDN for static files (Cloudinary for images)

---

## Phase 10: Monitoring & Maintenance

### Weekly Checklist

- [ ] Check error logs
- [ ] Monitor database usage
- [ ] Review API performance
- [ ] Check uptime status

### Monthly Checklist

- [ ] Backup database
- [ ] Review security logs
- [ ] Update dependencies
- [ ] Optimize slow queries

---

## Troubleshooting

### Backend Not Starting

```bash
# Check logs on Render dashboard
# Verify environment variables are set
# Check MongoDB connection string
# Test locally: npm run dev
```

### Frontend Not Loading

```bash
# Check Vercel deployment logs
# Verify API_URL is correct
# Check browser console for errors
# Clear cache and redeploy
```

### Payment Not Working

- Verify Razorpay keys are correct
- Check webhook URL is accessible
- Verify signature verification logic
- Test with Razorpay test credentials first

---

## Estimated Monthly Costs

- **Vercel**: $0-20 (depending on usage)
- **Render**: $7-12 (for basic server)
- **MongoDB Atlas**: $0-57 (depending on usage)
- **Cloudinary**: $0-84 (free tier available)
- **Razorpay**: 2-3% per transaction
- **Domain**: $10-15/year

**Total: ~$25-50/month**

---

## Getting to Production Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] MongoDB Atlas configured
- [ ] Razorpay live mode activated
- [ ] Cloudinary setup for images
- [ ] Custom domain connected
- [ ] SSL/TLS working
- [ ] Email sending verified
- [ ] Admin panel tested
- [ ] Payment flow tested
- [ ] Error handling verified
- [ ] Monitoring setup
- [ ] Database backups enabled
- [ ] Security audit completed
- [ ] Performance optimized

Once all checks pass, your platform is ready for production!
