# Quick Start Guide

Get SLN Grocery Platform running in 5 minutes!

## Option 1: Local Development

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/sln-grocery.git
cd sln-grocery
```

### Step 2: Setup Backend
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your settings:
# - MONGODB_URI (local or Atlas)
# - RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
# - JWT_SECRET
# - EMAIL credentials (optional for local)

# Start server
npm run dev
```

Server will run at: `http://localhost:5000`

### Step 3: Setup Frontend
```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with:
# - VITE_API_URL=http://localhost:5000/api
# - VITE_RAZORPAY_KEY_ID (test key from Razorpay)

# Start dev server
npm run dev
```

Frontend will run at: `http://localhost:5173`

### Step 4: Access Application
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **API Docs**: http://localhost:5000/api

---

## Option 2: Docker Compose (Easy)

```bash
# If using Docker
docker-compose up

# Access at http://localhost
```

---

## First Time Setup Checklist

- [ ] Clone repository
- [ ] Create MongoDB Atlas cluster (free tier)
- [ ] Get Razorpay test keys from dashboard
- [ ] Setup environment variables
- [ ] Install dependencies
- [ ] Start backend server
- [ ] Start frontend server
- [ ] Login/Register
- [ ] Add products to cart
- [ ] Test checkout with Razorpay test card
- [ ] Check admin panel

---

## Test Credentials

### Razorpay Test Card
```
Card Number: 4111 1111 1111 1111
Expiry: Any future date
CVV: Any 3 digits
```

### Test UPI
```
ID: success@razorpay
Password: password
```

---

## Common Issues & Solutions

### MongoDB Connection Error
```
Error: connect ECONNREFUSED
```
**Solution**: 
- Check if MongoDB is running
- Or use MongoDB Atlas connection string
- Verify MONGODB_URI in .env

### Razorpay Key Error
```
Error: Invalid Razorpay key
```
**Solution**:
- Use TEST keys for development (not LIVE)
- Check .env file has correct keys
- Ensure keys are not exposed in code

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution**:
```bash
# Kill process using port 5000 (Linux/Mac)
lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### CORS Error
```
Error: Access to XMLHttpRequest blocked by CORS policy
```
**Solution**:
- Check FRONTEND_URL in backend .env
- Update CORS configuration in server.js
- Restart backend server

---

## Project Structure

```
sln-grocery/
├── backend/
│   ├── config/           # Database configuration
│   ├── controllers/       # Business logic
│   ├── middleware/        # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── utils/            # Helper functions
│   ├── server.js         # Entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context
│   │   ├── services/     # API services
│   │   ├── utils/        # Helper functions
│   │   ├── App.jsx       # Main app
│   │   └── main.jsx      # Entry point
│   ├── public/           # Static files
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── README.md
├── DEPLOYMENT_GUIDE.md
└── docker-compose.yml
```

---

## Next Steps

1. **Explore Admin Panel**
   - Add products
   - Manage inventory
   - Create categories
   - View orders

2. **Customize Branding**
   - Update colors in tailwind.config.js
   - Replace images
   - Modify copy/text

3. **Add Real Data**
   - Import product database
   - Setup delivery zones
   - Configure payment methods

4. **Deploy to Production**
   - Follow DEPLOYMENT_GUIDE.md
   - Setup custom domain
   - Enable live payment

---

## API Quick Reference

### Create Order
```bash
curl -X POST http://localhost:5000/api/payment/create-order \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "orderItems": [...],
    "shippingAddress": {...},
    "totalPrice": 500
  }'
```

### Get Products
```bash
curl http://localhost:5000/api/products
```

### Get Orders
```bash
curl -X GET http://localhost:5000/api/payment/my/orders \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Useful Commands

### Backend
```bash
# Install dependencies
npm install

# Start development
npm run dev

# Start production
npm start

# Run tests
npm run test

# Lint code
npm run lint
```

### Frontend
```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Format code
npm run format
```

---

## Getting Help

- 📖 Read the [README.md](../README.md)
- 📚 Check [DEPLOYMENT_GUIDE.md](../backend/DEPLOYMENT_GUIDE.md)
- 🐛 Browse [Issues](https://github.com/yourusername/sln-grocery/issues)
- 💬 Start a [Discussion](https://github.com/yourusername/sln-grocery/discussions)
- 📧 Email: support@sln-grocery.com

---

## Next: Deploy to Production

Once you're comfortable with local development:

1. Push code to GitHub
2. Deploy backend to Render
3. Deploy frontend to Vercel
4. Setup custom domain
5. Enable live Razorpay keys

See [DEPLOYMENT_GUIDE.md](../backend/DEPLOYMENT_GUIDE.md) for detailed steps.

---

**Happy Coding! 🚀**
