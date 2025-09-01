# Hey Harvest Foods - Backend API

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Update .env with your actual values
   ```

3. **Database Setup**
   ```bash
   # Make sure MongoDB is running
   # Run seeder to create admin user and sample data
   node utils/seeder.js
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - Verify phone OTP
- `POST /api/auth/resend-otp` - Resend OTP
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/addresses` - Add address
- `PUT /api/auth/addresses/:id` - Update address
- `DELETE /api/auth/addresses/:id` - Delete address

### Products
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/search` - Search products
- `GET /api/products/categories` - Get categories
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/:id` - Get single product

### Admin - Products
- `GET /api/admin/products` - Get all products (admin)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

### Admin - Orders
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status

### Admin - Analytics
- `GET /api/admin/analytics` - Get dashboard analytics
- `GET /api/admin/customers` - Get all customers

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/:productId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `POST /api/orders/create` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:orderId` - Get order details
- `PUT /api/orders/:orderId/cancel` - Cancel order
- `GET /api/orders/track/:orderId` - Track order
- `POST /api/orders/validate-coupon` - Validate coupon

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews/create` - Create review
- `GET /api/reviews/user` - Get user reviews
- `PUT /api/reviews/:reviewId` - Update review
- `DELETE /api/reviews/:reviewId` - Delete review
- `POST /api/reviews/:reviewId/helpful` - Mark review helpful

### Blog
- `GET /api/blog` - Get all blogs
- `GET /api/blog/featured` - Get featured blogs
- `GET /api/blog/:slug` - Get blog by slug

### Contact
- `POST /api/contact` - Submit contact form

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/unsubscribe` - Unsubscribe
- `PUT /api/newsletter/preferences` - Update preferences

### Payment
- `POST /api/payment/create-order` - Create payment order
- `POST /api/payment/verify` - Verify payment
- `POST /api/payment/failure` - Handle payment failure

## Default Admin Credentials
- **Email**: admin@heyharvest.com
- **Password**: Admin@123

## File Upload Structure
```
uploads/
├── products/     # Product images
├── blogs/        # Blog featured images
├── reviews/      # Review images
└── users/        # User avatars
```
