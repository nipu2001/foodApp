# Smart Meal Ordering & Management System

A modern, full-stack food ordering application built with React, Firebase, Tailwind CSS, and Stripe payment integration.

## 🎨 Features

### Customer Features
- **Beautiful Homepage** with hero section and call-to-action
- **Menu Browsing** with category filters (Breakfast, Lunch, Dinner)
- **Smart Ordering** with time-based restrictions
- **Multiple Payment Methods** - Cash, Card (Stripe), Mobile Money
- **Order Tracking** with real-time status updates
- **Live Chat** with shop owners (Real-time Firebase)
- **Rating System** to provide feedback on meals
- **User Profile** management
- **Dark Mode** support

### Shop Owner Features
- **Real-time Dashboard** with live statistics
- **Menu Management** - Add, edit, delete menu items with images
- **Order Management** - View and update order statuses
- **Payment Tracking** - Monitor payment methods and status
- **Customer Chat** - Real-time messaging with all customers
- **Ratings Overview** - View all customer reviews and analytics
- **Top Selling Items** - Track popular menu items

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Firebase account
- Stripe account (optional for payments)

### Installation

1. Clone and install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Configure Firebase:
   - Create project at https://console.firebase.google.com
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Copy your config to \`src/config/firebase.js\`

3. Configure Payment (Optional):
   - Get Stripe key from https://dashboard.stripe.com
   - Add to \`.env\`:
   \`\`\`
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   \`\`\`

4. Start development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open browser: `http://localhost:5173`

### Admin Account Setup

Default admin credentials:
- **Email:** nipuninuwanthika785@gmail.com
- **Password:** nipuni12

Or create your own - first user with this email becomes owner automatically.

### Building for Production

\`\`\`bash
npm run build
npm run preview
\`\`\`

## 💳 Payment Integration

### Supported Payment Methods:
1. **Cash on Delivery** - Default, no setup needed
2. **Card Payments** - Via Stripe (Visa, MasterCard, Amex)
3. **Mobile Money** - M-Pesa, eZ Cash, Airtel Money

### Test Card (Stripe):
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/25`)
- CVV: Any 3 digits (e.g., `123`)

## 🔥 Firebase Collections

- **users** - User profiles and roles
- **menuItems** - Restaurant menu with images
- **orders** - Customer orders with status
- **payments** - Payment records and status
- **ratings** - Customer reviews and ratings
- **conversations** - Chat conversations
  - **messages** - Chat messages (subcollection)

## 🎯 Key Features Implemented

✅ Firebase Authentication (Email/Password)
✅ Real-time Firestore Database
✅ Real-time Chat System
✅ Stripe Payment Integration
✅ Dark Mode Support
✅ Image Upload for Menu Items
✅ Order Status Tracking
✅ Rating & Review System
✅ Admin Dashboard Analytics
✅ Responsive Design (Mobile/Tablet/Desktop)

## 🧭 Routes

### Public Routes
- `/` - Homepage
- `/login` - User login
- `/register` - User registration

### Customer Routes (Protected)
- `/menu` - Browse menu
- `/my-orders` - Order history
- `/chat` - Chat with owner
- `/profile` - User profile

### Owner Routes (Protected)
- `/owner` - Dashboard with analytics
- `/owner/menu` - Manage menu items
- `/owner/orders` - Manage orders
- `/owner/chat` - Chat with customers
- `/owner/ratings` - View ratings

## 🛠️ Technologies Used

### Frontend
- **React 18.3** - UI framework
- **React Router 6** - Client-side routing
- **Tailwind CSS 3** - Utility-first styling
- **React Icons** - Icon library
- **Vite 6** - Build tool

### Backend
- **Firebase 12.5** - Backend as a Service
  - Authentication
  - Firestore Database
  - Real-time listeners
  - Cloud Storage (ready)

### Payment
- **Stripe** - Payment processing
- **@stripe/stripe-js** - Stripe SDK
- **@stripe/react-stripe-js** - React integration

## 📱 Responsive Design

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## � Design System

### Colors (Tailwind)
- **Primary (Green)**: #10b981
- **Accent (Orange)**: #f97316
- **Dark Mode**: Full support

### Animations
- Fade-in, Slide-up, Scale effects
- Smooth transitions
- Loading states

## 📦 Project Structure

\`\`\`
src/
├── components/       # Reusable components
├── config/          # Firebase configuration
├── contexts/        # React Context providers
├── pages/           # Page components
│   ├── Auth/       # Login, Register
│   ├── Customer/   # Customer pages
│   └── Owner/      # Owner pages
├── services/        # API services
└── utils/          # Helper functions
\`\`\`

## 🔐 Security

- Firebase Authentication for secure login
- Protected routes with role-based access
- Firestore security rules enforced
- No sensitive data in frontend
- Environment variables for API keys

## 🧪 Testing

### Test Stripe Payment:
1. Go to checkout
2. Select "Card Payment"
3. Use: `4242 4242 4242 4242`
4. Complete order

### Test Chat:
1. Login as customer
2. Send message in chat
3. Login as owner (different browser)
4. See message in real-time

## 📝 Environment Variables

Create \`.env\` file:
\`\`\`
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
\`\`\`

## 🚀 Deployment

### Recommended Platforms:
- **Vercel** - Best for React apps
- **Netlify** - Easy deployment
- **Firebase Hosting** - Integrated with Firebase

### Build Command:
\`\`\`bash
npm run build
\`\`\`

### Output Directory:
\`\`\`
dist/
\`\`\`

## 🤝 Contributing

Feel free to fork, customize, and extend!

---

## ?? Live Deployment

**Your app is now live at:** https://myfoodsystem2025.web.app

### Quick Deploy Commands
```bash
# Build production version
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Or do both at once
npm run build; firebase deploy --only hosting
```

?? **Full deployment guide:** See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
