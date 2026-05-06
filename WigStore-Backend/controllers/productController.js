const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const startIndex = (page - 1) * limit;
  
  let query = { status: 'active' };
  
  // Search
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: 'i' };
  }
  
  // Category filter
  if (req.query.category && req.query.category !== 'all') {
    query.category = req.query.category;
  }
  
  // Hair type filter
  if (req.query.hairType && req.query.hairType !== 'all') {
    query.hairType = req.query.hairType;
  }
  
  // Texture filter
  if (req.query.texture) {
    query.texture = req.query.texture;
  }
  
  // Price range
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
    if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
  }
  
  // Sorting
  let sort = {};
  switch(req.query.sort) {
    case 'price-low':
      sort = { price: 1 };
      break;
    case 'price-high':
      sort = { price: -1 };
      break;
    case 'rating':
      sort = { ratings: -1 };
      break;
    case 'newest':
      sort = { createdAt: -1 };
      break;
    default:
      sort = { createdAt: -1 };
  }
  
  const products = await Product.find(query)
    .sort(sort)
    .limit(limit)
    .skip(startIndex);
  
  const total = await Product.countDocuments(query);
  
  res.status(200).json({
    products,
    page,
    pages: Math.ceil(total / limit),
    total
  });
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Get product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
const getProductBySlug = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  const products = await Product.find({ status: 'active' })
    .sort({ isBestSeller: -1, createdAt: -1 })
    .limit(8);
  res.status(200).json(products);
};

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
const getNewArrivals = async (req, res) => {
  const products = await Product.find({ status: 'active', isNew: true })
    .sort({ createdAt: -1 })
    .limit(8);
  res.status(200).json(products);
};

// @desc    Get best sellers
// @route   GET /api/products/best-sellers
// @access  Public
const getBestSellers = async (req, res) => {
  const products = await Product.find({ status: 'active', isBestSeller: true })
    .limit(8);
  res.status(200).json(products);
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = async (req, res) => {
  const products = await Product.find({ 
    category: req.params.category, 
    status: 'active' 
  });
  res.status(200).json(products);
};

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
const getRelatedProducts = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  const relatedProducts = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
    status: 'active'
  }).limit(4);
  
  res.status(200).json(relatedProducts);
};

// Admin only controllers
const createProduct = async (req, res) => {
  try {
    // Generate slug from name
    const slug = req.body.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    const product = new Product({
      ...req.body,
      slug: slug
    });
    
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // If name is being updated, update slug too
    if (req.body.name && req.body.name !== product.name) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }
    
    Object.assign(product, req.body);
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (product) {
    await Product.findByIdAndDelete(product._id);
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductBySlug,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  getProductsByCategory,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct
};