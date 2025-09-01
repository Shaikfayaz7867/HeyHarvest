const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
require('dotenv').config();

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hey-harvest');
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Seed admin user
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'ADMIN' });
    if (adminExists) {
      console.log('Admin user already exists');
      return;
    }

    const admin = new User({
      firstName: 'Admin',
      lastName: 'HeyHarvest',
      email: 'admin@heyharvest.com',
      phone: '9876543210',
      password: 'Admin@123',
      role: 'ADMIN',
      isEmailVerified: true,
      isPhoneVerified: true
    });

    await admin.save();
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// Seed categories
const seedCategories = async () => {
  try {
    const categories = [
      {
        name: 'Pure 4 Suta',
        description: 'Premium quality makhana with 12-16mm size',
        sortOrder: 1
      },
      {
        name: 'Refined 5 Suta',
        description: 'Refined makhana with 16-18mm size',
        sortOrder: 2
      },
      {
        name: 'Reserved 6 Suta',
        description: 'Reserved quality makhana with 18-22mm size',
        sortOrder: 3
      },
      {
        name: 'Elite 6 Suta',
        description: 'Elite premium makhana with superior quality',
        sortOrder: 4
      }
    ];

    for (const categoryData of categories) {
      const exists = await Category.findOne({ name: categoryData.name });
      if (!exists) {
        await Category.create(categoryData);
        console.log(`Category created: ${categoryData.name}`);
      }
    }
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
};

// Seed sample products
const seedProducts = async () => {
  try {
    const productExists = await Product.findOne();
    if (productExists) {
      console.log('Products already exist');
      return;
    }

    const sampleProducts = [
      {
        name: 'Hey Harvest Pure 4 Suta Makhana',
        description: 'Premium quality makhana from Mithilanchal ponds. Rich in protein and antioxidants.',
        category: 'Pure 4 Suta',
        size: '12-16mm',
        packSize: '200g',
        images: ['/uploads/products/sample-pure-4-suta.jpg'],
        price: 299,
        discountPrice: 249,
        inventory: 100,
        sku: 'P4S-1216-001',
        isFeatured: true,
        tags: ['premium', 'protein-rich', 'healthy-snack'],
        benefits: ['High Protein', 'Gluten Free', 'Antioxidant Rich', 'Low Glycemic Index']
      },
      {
        name: 'Hey Harvest Refined 5 Suta Makhana',
        description: 'Refined makhana with perfect crunch and taste. Ideal for snacking and cooking.',
        category: 'Refined 5 Suta',
        size: '16-18mm',
        packSize: '200g',
        images: ['/uploads/products/sample-refined-5-suta.jpg'],
        price: 349,
        discountPrice: 299,
        inventory: 150,
        sku: 'R5S-1618-001',
        isFeatured: true,
        tags: ['refined', 'crunchy', 'versatile'],
        benefits: ['Perfect Crunch', 'Versatile Use', 'Natural Goodness']
      },
      {
        name: 'Hey Harvest Reserved 6 Suta Makhana',
        description: 'Reserved quality large-sized makhana. Perfect for gifting and special occasions.',
        category: 'Reserved 6 Suta',
        size: '18-22mm',
        packSize: '200g',
        images: ['/uploads/products/sample-reserved-6-suta.jpg'],
        price: 449,
        discountPrice: 399,
        inventory: 75,
        sku: 'RV6S-1822-001',
        isFeatured: true,
        tags: ['premium', 'large-size', 'gift-worthy'],
        benefits: ['Large Size', 'Premium Quality', 'Gift Worthy']
      },
      {
        name: 'Hey Harvest Elite 6 Suta Makhana',
        description: 'Elite premium makhana - the finest quality available. Hand-picked and carefully processed.',
        category: 'Elite 6 Suta',
        size: '18-22mm',
        packSize: '200g',
        images: ['/uploads/products/sample-elite-6-suta.jpg'],
        price: 599,
        discountPrice: 549,
        inventory: 50,
        sku: 'E6S-1822-001',
        isFeatured: true,
        tags: ['elite', 'premium', 'hand-picked'],
        benefits: ['Elite Quality', 'Hand Picked', 'Superior Taste']
      }
    ];

    await Product.insertMany(sampleProducts);
    console.log('Sample products created successfully');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

// Main seeder function
const seedDatabase = async () => {
  try {
    await connectDB();
    await seedAdmin();
    await seedCategories();
    await seedProducts();
    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = {
  seedDatabase,
  seedAdmin,
  seedCategories,
  seedProducts
};
