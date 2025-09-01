/*
  Migration: Convert legacy product image paths (/uploads/...) to base64 data URLs.
  Usage: node scripts/migrate_images_to_base64.js
*/

const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Product = require('../models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hey-harvest';

function guessMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.png') return 'image/png';
  if (ext === '.gif') return 'image/gif';
  if (ext === '.webp') return 'image/webp';
  return 'application/octet-stream';
}

async function convertImagePathToBase64(imagePath) {
  try {
    const abs = path.join(__dirname, '..', imagePath);
    if (!fs.existsSync(abs)) {
      console.warn(`[SKIP] File not found: ${abs}`);
      return null; // keep original if not found
    }
    const buf = fs.readFileSync(abs);
    const mime = guessMimeType(abs);
    return `data:${mime};base64,${buf.toString('base64')}`;
  } catch (err) {
    console.error(`[ERROR] Reading file ${imagePath}:`, err.message);
    return null; // keep original if failure
  }
}

async function migrate() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  const cursor = Product.find({ images: { $exists: true, $type: 'array', $ne: [] } }).cursor();
  let processed = 0;
  let updated = 0;

  for await (const product of cursor) {
    const hasLegacy = (product.images || []).some(img => typeof img === 'string' && img.startsWith('/uploads/'));
    if (!hasLegacy) {
      processed++;
      continue;
    }

    const newImages = [];
    for (const img of product.images) {
      if (typeof img === 'string' && img.startsWith('/uploads/')) {
        const converted = await convertImagePathToBase64(img);
        newImages.push(converted || img); // fallback to original on failure
      } else {
        newImages.push(img);
      }
    }

    product.images = newImages;
    try {
      await product.save();
      updated++;
      console.log(`[OK] Updated product ${product._id} (${product.name})`);
    } catch (err) {
      console.error(`[ERROR] Saving product ${product._id}:`, err.message);
    }

    processed++;
  }

  console.log(`Migration complete. Processed: ${processed}, Updated: ${updated}`);
  await mongoose.disconnect();
}

migrate().catch(async (err) => {
  console.error('Migration failed:', err);
  try { await mongoose.disconnect(); } catch (_) {}
  process.exit(1);
});
