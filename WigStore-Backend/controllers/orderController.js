const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Coupon = require('../models/Coupon');
const User = require('../models/user');
const sendEmail = require('../utils/sendEmail');
const generateOrderId = require('../utils/generateOrderId');
const {
  getUserOrderConfirmationEmail,
  getAdminOrderNotificationEmail,
  getOrderStatusUpdateEmail
} = require('../utils/emailTemplates');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      shippingLocation,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      couponCode
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Verify products are still in stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `${item.name} is out of stock or insufficient quantity` 
        });
      }
    }

    // Apply coupon if provided
    let couponDiscount = 0;
    let couponData = null;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (coupon && coupon.isValid()) {
        if (coupon.type === 'percentage') {
          couponDiscount = (totalPrice * coupon.value) / 100;
          if (coupon.maxDiscount && couponDiscount > coupon.maxDiscount) {
            couponDiscount = coupon.maxDiscount;
          }
        } else {
          couponDiscount = coupon.value;
        }
        coupon.usedCount += 1;
        await coupon.save();
        couponData = { code: coupon.code, discount: couponDiscount };
      }
    }

    const order = new Order({
      orderId: generateOrderId(),
      user: req.user._id,
      orderItems,
      shippingAddress,
      shippingLocation: shippingLocation || { name: 'Standard', fee: shippingPrice || 0 },
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice: totalPrice - couponDiscount,
      coupon: couponData
    });

    const createdOrder = await order.save();

    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear user's cart after order
    await Cart.findOneAndDelete({ user: req.user._id });

    // Populate user and product details before sending email
    await createdOrder.populate('user', 'name email');
    await createdOrder.populate('orderItems.product');

    // Send confirmation email to user
    try {
      const userEmailHtml = getUserOrderConfirmationEmail(createdOrder, req.user);
      await sendEmail({
        email: req.user.email,
        subject: `Order Confirmation - Order #${createdOrder.orderId}`,
        html: userEmailHtml
      });
    } catch (emailError) {
      console.error('Failed to send user confirmation email:', emailError);
      // Don't fail the order creation if email fails
    }

    // Send notification email to admin
    try {
      const adminEmailHtml = getAdminOrderNotificationEmail(createdOrder, req.user);
      await sendEmail({
        email: process.env.ADMIN_EMAIL,
        subject: `New Order Received - Order #${createdOrder.orderId}`,
        html: adminEmailHtml
      });
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError);
      // Don't fail the order creation if email fails
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to user or user is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const previousStatus = order.status;
    order.status = status;
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();

    // Send status update email to user
    try {
      const statusEmailHtml = getOrderStatusUpdateEmail(updatedOrder, order.user, status);
      await sendEmail({
        email: order.user.email,
        subject: `Order Status Updated - Order #${updatedOrder.orderId}`,
        html: statusEmailHtml
      });
    } catch (emailError) {
      console.error('Failed to send order status update email:', emailError);
      // Don't fail the status update if email fails
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Only allow cancellation if order is pending or processing
    // Cannot cancel shipped or delivered orders
    if (order.status !== 'pending' && order.status !== 'processing') {
      return res.status(400).json({ 
        message: `Order cannot be cancelled at this stage. Current status: ${order.status}` 
      });
    }

    order.status = 'cancelled';

    // Restore product stock
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;

    let query = {};
    
    // Filter by status
    if (req.query.status && req.query.status !== 'all') {
      query.status = req.query.status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrders
};