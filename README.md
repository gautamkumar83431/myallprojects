# MERN Project Store

A full-stack web application for selling and managing digital projects with payment integration.

## Features

- **Admin Panel**: Login, add projects with images and zip files, view all payment details
- **User Features**: Register/Login, browse projects, make payments, download purchased projects
- **Payment Integration**: Stripe payment gateway
- **Responsive Design**: Works on all devices

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed and running
- Stripe account (for payment processing)

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Update `.env` file with your credentials:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/project-store
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

4. Create admin user (run this once):
```bash
node -e "const bcrypt = require('bcryptjs'); const mongoose = require('mongoose'); require('dotenv').config(); mongoose.connect(process.env.MONGODB_URI).then(async () => { const User = require('./models/User'); const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10); await User.create({ email: process.env.ADMIN_EMAIL, password: hashedPassword, isAdmin: true }); console.log('Admin created'); process.exit(); });"
```

5. Start backend server:
```bash
npm start
```

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update Stripe publishable key in `src/pages/Payment.js`:
```javascript
const stripePromise = loadStripe('your_stripe_publishable_key_here');
```

4. Start frontend:
```bash
npm start
```

## Usage

### Admin Login
- Email: admin@example.com
- Password: admin123

### Admin Features
- Click "Add Project" to upload new projects
- Click "Payment Details" to view all user payments
- Delete projects from home page

### User Features
- Register/Login to access payment features
- Browse available projects
- Click "Purchase & Download" to buy projects
- View purchased projects in "My Purchases"
- Download zip files after payment

## Tech Stack

**Backend:**
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer (file uploads)
- Stripe (payments)
- Bcrypt (password hashing)

**Frontend:**
- React
- React Router
- Axios
- Stripe React Elements
- Responsive CSS

## API Endpoints

### Auth
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration

### Projects
- GET `/api/projects` - Get all projects
- POST `/api/projects` - Add project (admin only)
- DELETE `/api/projects/:id` - Delete project (admin only)
- GET `/api/projects/download/:id` - Download project (authenticated)

### Payments
- POST `/api/payments/create-payment-intent` - Create payment intent
- POST `/api/payments/confirm` - Confirm payment
- GET `/api/payments/admin/all` - Get all payments (admin only)
- GET `/api/payments/user` - Get user's payments

## Notes

- Make sure MongoDB is running before starting the backend
- Update Stripe keys in both backend `.env` and frontend `Payment.js`
- For production, update CORS settings and use environment variables
- Uploaded files are stored in `backend/uploads/` folder
