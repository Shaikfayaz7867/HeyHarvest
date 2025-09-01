# Hey Harvest Foods - Complete MERN Stack E-commerce Platform

## Project Overview
Build a premium e-commerce platform for Hey Harvest Foods Pvt Ltd, a Bihar-based makhana (fox nuts/lotus seeds) brand. Create a complete MERN stack application with admin panel, user authentication, payment gateway, and all modern e-commerce features.

## Tech Stack Requirements
- **Frontend**: React.js with Vite, JSX (not TSX)
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS + ShadcnUI components
- **Animations**: Framer Motion for smooth transitions
- **State Management**: Context API + useReducer
- **Authentication**: JWT tokens
- **File Upload**: Multer for images
- **Email Service**: NodeMailer
- **SMS Service**: Twilio/Fast2SMS
- **Payment Gateway**: Razorpay/Stripe
- **Responsive Design**: Mobile-first approach

## Brand Guidelines (From PDF)
- **Colors**: White/Kraft background + Green (#2D5016, #4A7C59) + Golden Yellow (#F4C430)
- **Theme**: Clean, earthy, premium, export-ready aesthetic
- **Typography**: Modern sans-serif fonts
- **Motifs**: Lotus/water lily elements, farm illustrations
- **Mood**: Natural, authentic, trustworthy

## Project Structure
```
hey-harvest/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/ (ShadcnUI components)
│   │   │   ├── layout/
│   │   │   ├── product/
│   │   │   ├── admin/
│   │   │   └── animations/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   └── assets/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── controllers/
│   ├── services/
│   └── utils/
```

## Core Features Required

### 1. User Authentication & Roles
- **User Registration**: Email/Mobile OTP verification
- **Login System**: Email or Mobile + Password
- **Role-based Access**: ADMIN and USER roles
- **Protected Routes**: Users must login to add to cart/purchase
- **JWT Authentication**: Secure token-based auth

### 2. Product Management (Admin)
```javascript
// Product Schema Structure
{
  name: String,
  description: String,
  category: String, // Pure 4 Suta, Refined 5 Suta, Reserved 6 Suta, Elite 6 Suta
  size: String, // 12-16mm, 16-18mm, 18-22mm
  packSize: String, // 200g
  images: [String], // Multiple product images
  price: Number,
  discountPrice: Number,
  inventory: Number,
  sku: String,
  material: String,
  colors: [String],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Admin Dashboard Features
- **Product Management**: Add/Edit/Delete products with image upload
- **Inventory Management**: Stock tracking, low stock alerts
- **Order Management**: View/Update order status
- **Customer Management**: View customer details, order history
- **Categories Management**: Manage product collections
- **Discount Management**: Create/manage discount codes
- **Gift Cards**: Create and manage gift card system
- **Abandoned Cart Recovery**: Email customers with cart links
- **Blog Management**: Create/Edit blog posts
- **Reviews Management**: Moderate customer reviews
- **Analytics Dashboard**: Sales, orders, customer metrics

### 4. Frontend Pages (Exact PDF Requirements)

#### Home Page
- Premium banner with "Say Hey to Health" tagline
- Hero section: Makhana ponds → farmers → packaged product journey
- Product highlights showcasing all Suta sizes
- GI heritage section about Mithilanchal region
- CTA buttons: "Shop Now", "Bulk Enquiry"
- Animated transitions and micro-interactions

#### About Us
- Story section: Mithilanchal ponds to kitchen journey
- Bihar makhana heritage storytelling
- Brand values: purity, traceability, nourishment
- Interactive timeline/visual story

#### Products Page
- **SKU Showcase**:
  - Pure 4 Suta (12–16 mm)
  - Refined 5 Suta (16–18 mm) 
  - Reserved 6 Suta (18–22 mm)
  - Elite 6 Suta
- Pack size: 200g for all
- Product cards with: Image + Features + Benefits + "Buy Now/Enquire"
- Filter and sort functionality
- Quick view modals

#### Health Benefits Page
- Infographic-style layout with icons:
  - High Protein 🌱
  - Gluten Free 🌾  
  - Antioxidant Rich 💪
  - Vegan 🌍
  - Low Glycemic Index 🩺
- Links to detailed blog posts and FAQs

#### Process/Farm-to-Pack Journey
- Interactive illustrated sections:
  1. Harvesting from ponds
  2. Drying under sun
  3. Popping with thaapi
  4. Grading with chalni
  5. Packaging in pouches & jars
- Animated scroll-triggered reveals

#### Certifications
- Display GST, FSSAI certificates
- Placeholder for future organic, GI tagging
- Professional certificate showcase

#### Shop/Store
- Product grid with filters
- Add to cart functionality (login required)
- Bulk inquiry form for B2B customers
- Cart management with quantities
- Wishlist functionality

#### Contact Us
- WhatsApp integration button
- Email, Phone contact details
- Office address in Patna
- Contact form for business leads
- Google Maps integration

### 5. E-commerce Features

#### Shopping Cart & Checkout
```javascript
// Cart Item Schema
{
  productId: ObjectId,
  quantity: Number,
  price: Number,
  discountPrice: Number,
  userId: ObjectId
}

// Order Schema
{
  userId: ObjectId,
  items: [CartItem],
  shippingAddress: Object,
  billingAddress: Object,
  paymentMethod: String,
  paymentStatus: String,
  orderStatus: String, // pending, confirmed, shipped, delivered
  trackingNumber: String,
  totalAmount: Number,
  discountAmount: Number,
  createdAt: Date
}
```

#### Payment Integration
- Razorpay/Stripe integration
- Support for Debit/Credit cards, UPI, Net Banking
- Secure payment processing
- Order confirmation emails

#### Shipping & Tracking
- Address management
- Shipping calculator
- Order tracking system
- Courier service API integration (future-ready)

### 6. Advanced Features

#### Review System
```javascript
// Review Schema
{
  userId: ObjectId,
  productId: ObjectId,
  rating: Number, // 1-5 stars
  title: String,
  comment: String,
  images: [String], // Review images
  isVerified: Boolean,
  createdAt: Date
}
```

#### Blog System
- Rich text editor for admin
- SEO-friendly blog posts
- Categories and tags
- Comment system

#### Notification System
- Email notifications (orders, shipping updates)
- SMS notifications for important updates
- Admin notification dashboard

### 7. UI/UX Requirements

#### Design System
- **Color Palette**:
  - Primary Green: #2D5016
  - Secondary Green: #4A7C59
  - Golden Yellow: #F4C430
  - Background: White/Kraft (#F5F5DC)
  - Text: Charcoal (#333333)

#### Animations & Transitions
- Page load animations
- Hover effects on all interactive elements
- Smooth scroll-triggered animations
- Loading spinners and skeletons
- Parallax effects on hero sections
- Micro-interactions for buttons and cards

#### Dark/Light Mode
- Toggle switch in header
- Persistent theme preference
- Smooth theme transitions
- Appropriate color schemes for both modes

### 8. Responsive Design
- Mobile-first approach
- Breakpoints: 320px, 768px, 1024px, 1280px
- Touch-friendly navigation
- Optimized images for different screen sizes
- Progressive Web App features

### 9. SEO & Performance
- React Helmet for meta tags
- Image optimization
- Lazy loading
- Code splitting
- Fast loading speeds (<3s)
- Mobile PageSpeed optimization

### 10. Integration Requirements

#### Email Service (NodeMailer)
```javascript
// Email Types Needed
- Welcome emails
- Order confirmations  
- Shipping notifications
- Abandoned cart recovery
- Bulk inquiry responses
- Newsletter subscriptions
```

#### SMS Service Integration
- Order status updates
- OTP verification
- Delivery notifications

#### Future API Integrations
- Courier tracking APIs (BlueDart, Delhivery, etc.)
- Inventory management systems
- Analytics tools (Google Analytics 4)

## Development Guidelines

### Code Standards
- Follow industry best practices
- Modular, reusable components
- Clean, commented code
- Error handling throughout
- Input validation and sanitization
- Security best practices (helmet, cors, rate limiting)

### File Organization
```javascript
// Component Structure Example
components/
├── ui/
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Modal.jsx
│   └── Input.jsx
├── layout/
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── Sidebar.jsx
│   └── Layout.jsx
├── product/
│   ├── ProductCard.jsx
│   ├── ProductGrid.jsx
│   ├── ProductDetail.jsx
│   └── ProductFilters.jsx
```

### Database Models Required
1. **User Model**: Authentication, profiles, addresses
2. **Product Model**: All product details, variants, inventory
3. **Category Model**: Product categories and collections
4. **Order Model**: Complete order management
5. **Cart Model**: Shopping cart persistence
6. **Review Model**: Product reviews and ratings
7. **Blog Model**: Content management
8. **Coupon Model**: Discount codes and gift cards
9. **Contact Model**: Inquiry management
10. **Newsletter Model**: Email subscriptions

### Key API Endpoints
```javascript
// Authentication
POST /api/auth/register
POST /api/auth/login
POST /api/auth/verify-otp
GET /api/auth/profile

// Products
GET /api/products
GET /api/products/:id
POST /api/admin/products (Admin only)
PUT /api/admin/products/:id (Admin only)
DELETE /api/admin/products/:id (Admin only)

// Cart & Orders
GET /api/cart
POST /api/cart/add
PUT /api/cart/update
DELETE /api/cart/remove
POST /api/orders/create
GET /api/orders/track/:id

// Reviews
GET /api/reviews/:productId
POST /api/reviews/create
PUT /api/admin/reviews/:id/moderate

// Admin Dashboard
GET /api/admin/analytics
GET /api/admin/orders
PUT /api/admin/orders/:id/status
GET /api/admin/customers
GET /api/admin/abandoned-carts
```

## Implementation Instructions

### Phase 1: Setup & Foundation
1. Initialize Vite React project with Tailwind CSS
2. Setup Express.js backend with MongoDB connection
3. Implement basic authentication system
4. Create responsive layout components
5. Setup ShadcnUI component library

### Phase 2: Core E-commerce
1. Product management system (admin)
2. Product display pages (user)
3. Shopping cart functionality
4. User authentication flows
5. Basic order management

### Phase 3: Advanced Features
1. Payment gateway integration
2. Email/SMS notification system
3. Review and rating system
4. Blog management system
5. Advanced admin dashboard

### Phase 4: Polish & Optimization
1. Implement all animations and transitions
2. Dark/light mode toggle
3. Performance optimization
4. SEO implementation
5. Testing and bug fixes

## Special Notes
- Reference evolvesnacks.com for modern e-commerce UX patterns
- Ensure export-ready professional appeal for B2B buyers
- Implement robust error handling and loading states
- Create reusable, scalable components
- Follow the exact brand colors and design guidelines
- All images, logos, and banners will be added to assets folder later
- Make code flexible for future modifications and feature additions
- Implement proper input validation and security measures
- Create comprehensive admin controls for all content management

## Success Criteria
- Fully functional e-commerce platform
- Beautiful, animated, responsive design matching brand guidelines
- Complete admin panel with all management features
- Secure user authentication and payment processing
- SEO-optimized and performance-focused
- Industry-standard code quality and structure
- Ready for production deployment

Build this as a complete, professional e-commerce solution that Hey Harvest Foods can use to sell their premium makhana products both domestically and internationally.