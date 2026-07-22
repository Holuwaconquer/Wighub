// scripts/fixIndexes.js
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  try {
    await Product.collection.dropIndex('sku_1');
  } catch (err) {
    console.log('dropIndex error (may not exist):', err.message);
  }
  await Product.syncIndexes();
  console.log('Indexes synced');
  await mongoose.disconnect();
}
run().catch(err=>{ console.error(err); process.exit(1); });