// controllers/orderController.js
const { sequelize, Order, OrderItem, Product } = require('../models');

exports.createOrder = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const { items, shippingAddress } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: 'Order items are required' });
    }

    // Calculate total and validate stock + product existence
    let total = 0;
    const itemsData = [];

    for (const it of items) {
      const { productId, quantity } = it;
      if (!productId || !quantity || quantity <= 0) {
        await t.rollback();
        return res.status(400).json({ message: 'Each item needs productId and quantity > 0' });
      }
      const product = await Product.findByPk(productId, { transaction: t, lock: t.LOCK.UPDATE });
      if (!product) {
        await t.rollback();
        return res.status(400).json({ message: `Product ${productId} not found` });
      }
      if (product.quantity < quantity) {
        await t.rollback();
        return res.status(400).json({ message: `Insufficient stock for product ${product.name}` });
      }

      const linePrice = parseFloat(product.price) * parseInt(quantity);
      total += linePrice;
      itemsData.push({ product, quantity, linePrice });
    }

    // create order
    const order = await Order.create({ userId, total, shippingAddress }, { transaction: t });

    // create order items and decrement stock
    for (const it of itemsData) {
      await OrderItem.create({
        orderId: order.id,
        productId: it.product.id,
        quantity: it.quantity,
        price: it.product.price,
      }, { transaction: t });

      // decrement product quantity
      it.product.quantity = it.product.quantity - it.quantity;
      await it.product.save({ transaction: t });
    }

    await t.commit();
    const fullOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, include: ['Product'] }],
    });
    res.status(201).json(fullOrder);
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{ model: OrderItem, include: [Product] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, include: [Product] }],
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // only owner or admin
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    // admin only
    const orders = await Order.findAll({
      include: [{ model: OrderItem, include: [Product] }, 'User'],
      order: [['createdAt', 'DESC']],
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const deleted = await Order.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    next(err);
  }
};



