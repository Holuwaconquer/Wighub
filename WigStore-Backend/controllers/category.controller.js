// controllers/categoryController.js
const { Category, Product } = require('../models');

exports.createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const image = req.file ? req.file.path : null;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const exists = await Category.findOne({ where: { name } });
    if (exists) return res.status(400).json({ message: 'Category already exists' });

    const category = await Category.create({ name, description, image });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};


exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: { model: Product, attributes: ['id', 'name', 'price', 'quantity'] },
    });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    category.name = req.body.name || category.name;
    category.description = req.body.description || category.description;
    if (req.file) category.image = req.file.path;

    await category.save();
    res.json({ message: 'Category updated', category });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const productsCount = await Product.count({ where: { categoryId: req.params.id } });
    if (productsCount > 0) {
      return res.status(400).json({ message: 'Cannot delete category with products. Remove or reassign products first.' });
    }
    const deleted = await Category.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};
