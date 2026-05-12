const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Create product review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { product, productId, rating, title, comment, images } = req.body;
    const pid = product || productId;

    if (!pid) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Check if product exists
    const productData = await Product.findById(pid);
    if (!productData) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user has purchased the product
    const hasPurchased = await Order.findOne({
      user: req.user._id,
      'orderItems.product': pid,
      status: 'delivered'
    });

    if (!hasPurchased && req.user.role !== 'admin') {
      return res.status(400).json({ 
        message: 'You can only review products you have purchased and received' 
      });
    }

    // Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({
      product: pid,
      user: req.user._id
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    const review = await Review.create({
      product: pid,
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
      product: pid, 
      status: 'approved' 
    });
    
    productData.numReviews = approvedReviews.length;
    if (approvedReviews.length > 0) {
      productData.ratings = approvedReviews.reduce((acc, item) => item.rating + acc, 0) / approvedReviews.length;
    } else {
      productData.ratings = 0;
    }
    
    await productData.save();

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

const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
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

    // Update product rating if the product still exists
    const product = await Product.findById(review.product);
    if (product) {
      const reviews = await Review.find({ product: review.product, status: 'approved' });
      product.numReviews = reviews.length;
      product.ratings = reviews.length > 0
        ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
        : 0;
      await product.save();
    } else {
      console.warn(`Approved review ${review._id} but product ${review.product} was not found.`);
    }

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

    await Review.findByIdAndDelete(req.params.id);
    
    // Update product rating if the product still exists
    const product = await Product.findById(review.product);
    if (product) {
      const reviews = await Review.find({ product: review.product, status: 'approved' });
      product.numReviews = reviews.length;
      product.ratings = reviews.length > 0 
        ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length 
        : 0;
      await product.save();
    } else {
      console.warn(`Deleted review ${review._id} but product ${review.product} was not found.`);
    }

    res.json({ message: 'Review deleted' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createReview,
  getProductReviews,
  getUserReviews,
  markHelpful,
  getAllReviews,
  approveReview,
  deleteReview
};