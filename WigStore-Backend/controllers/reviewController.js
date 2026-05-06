const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Create product review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { productId, rating, title, comment, images } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user has purchased the product
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      'orderItems.product': productId,
      status: 'delivered'
    });

    if (!hasPurchased && req.user.role !== 'admin') {
      return res.status(400).json({ 
        message: 'You can only review products you have purchased and received' 
      });
    }

    // Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({
      product: productId,
      user: req.user._id
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating,
      title,
      comment,
      images: images || [],
      isVerified: hasPurchased ? true : false,
      status: req.user.role === 'admin' ? 'approved' : 'pending'
    });

    // Update product ratings (only count approved reviews)
    const approvedReviews = await Review.find({ 
      product: productId, 
      status: 'approved' 
    });
    
    product.numReviews = approvedReviews.length;
    if (approvedReviews.length > 0) {
      product.ratings = approvedReviews.reduce((acc, item) => item.rating + acc, 0) / approvedReviews.length;
    } else {
      product.ratings = 0;
    }
    
    await product.save();

    res.status(201).json(review);
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get product reviews
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ 
      product: req.params.productId, 
      status: 'approved' 
    }).populate('user', 'name avatar');
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update review helpful count
// @route   PUT /api/reviews/:id/helpful
// @access  Private
const markHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.helpful += 1;
    await review.save();

    res.json({ helpful: review.helpful });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin controllers
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('product', 'name')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const approveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.status = 'approved';
    await review.save();

    // Update product rating
    const product = await Product.findById(review.product);
    const reviews = await Review.find({ product: review.product, status: 'approved' });
    
    product.numReviews = reviews.length;
    product.ratings = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    await product.save();

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await review.remove();
    
    // Update product rating
    const product = await Product.findById(review.product);
    const reviews = await Review.find({ product: review.product, status: 'approved' });
    
    product.numReviews = reviews.length;
    product.ratings = reviews.length > 0 
      ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length 
      : 0;
    await product.save();

    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createReview,
  getProductReviews,
  markHelpful,
  getAllReviews,
  approveReview,
  deleteReview
};