const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const generateToken = require('../utils/generateToken');

exports.registerUser = async (req, res, next) => {
  try {
    if (req.body.role && req.body.role === 'admin') {
      return res.status(403).json({ message: 'Cannot self-assign admin role' });
    }
    const { name, email, password, address, phone } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    if (!email || !password || !name)
      return res.status(401).json({ message: 'Please fill all required fields' });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, address, phone, image: imageUrl });

    generateToken(user.id, res);
    res.status(201).json({ message: 'User created successfully', status: true });
  } catch (error) {
    next(error);
  }
};

// Upload profile image
exports.uploadProfileImage = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.image = req.file.path;
    await user.save();

    res.json({ message: 'Profile image updated', image: user.image });
  } catch (error) {
    next(error);
  }
};

// Login
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'This email is not registered' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials'});

    const token = generateToken(user.id, res);
    res.cookie('token', token, { httpOnly: true, secure: false });
    res.status(200).json({ message: 'Login successful', status: true, name: user.name });
  } catch (error) {
    next(error);
  }
};

// Logout
exports.logoutUser = async (req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  res.json({ message: 'Logged out' });
};

// Get profile (protected)
exports.getProfile = async (req, res) => {
  res.json(req.user);
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, email, address, phone, currentPassword, newPassword } = req.body;

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already taken' });
      }
      user.email = email;
    }

    // Update basic info
    if (name) user.name = name;
    if (address) user.address = address;
    if (phone) user.phone = phone;

    // Update password if provided
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be at least 6 characters' });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({ 
      message: 'Profile updated successfully', 
      user: updatedUser 
    });
  } catch (error) {
    next(error);
  }
};

// Update user by ID (Admin only)
exports.updateUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, email, address, phone, role } = req.body;

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already taken' });
      }
      user.email = email;
    }

    // Update fields
    if (name) user.name = name;
    if (address) user.address = address;
    if (phone) user.phone = phone;
    if (role && req.user.role === 'admin') {
      user.role = role;
    }

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({ 
      message: 'User updated successfully', 
      user: updatedUser 
    });
  } catch (error) {
    next(error);
  }
};

// Delete user account
exports.deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();
    
    res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
};