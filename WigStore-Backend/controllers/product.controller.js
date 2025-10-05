// controllers/productController.js
const { Product, Category } = require('../models');

exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, quantity, review, categoryId } = req.body;
    const imageUrls = req.files ? req.files.map((file) => file.path) : [];

    const category = await Category.findByPk(categoryId);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    const product = await Product.create({
      name,
      description,
      price,
      quantity,
      review,
      categoryId: categoryId,
      images: JSON.stringify(imageUrls),
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// Update product
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (req.files && req.files.length > 0) {
      product.images = JSON.stringify(req.files.map(f => f.path));
    }

    // If updating categoryId from req.body, make sure it's lowercase
    if (req.body.categoryId) {
      req.body.categoryId = req.body.categoryId;
    }

    Object.assign(product, req.body);
    await product.save();

    res.json({ message: 'Product updated', product });
  } catch (error) {
    next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, q, category } = req.query;
    const offset = (page - 1) * limit;
    const where = {};
    if (q) where.name = { [require('sequelize').Op.like]: `%${q}%` };
    if (category) where.categoryId = category;

    const products = await Product.findAndCountAll({
      where,
      include: { model: Category, attributes: ['id', 'name'] },
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']],
    });

    res.json({
      total: products.count,
      page: parseInt(page),
      pages: Math.ceil(products.count / limit),
      data: products.rows,
    });
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: { model: Category, attributes: ['id', 'name'] },
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const deleted = await Product.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};
