const User = require('../models/user');
const Product = require('../models/Product');

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist.product');
    res.json(user.wishlist || []);
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add to wishlist
// @route   POST /api/users/wishlist/:productId
// @access  Private
const addToWishlist = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.user._id);
    
    // Check if product already in wishlist
    const alreadyExists = user.wishlist.find(
      item => item.product && item.product.toString() === req.params.productId
    );

    if (alreadyExists) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    user.wishlist.push({ product: req.params.productId });
    await user.save();

    res.json({ message: 'Added to wishlist', wishlist: user.wishlist });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Remove from wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    user.wishlist = user.wishlist.filter(
      item => item.product && item.product.toString() !== req.params.productId
    );
    
    await user.save();
    res.json({ message: 'Removed from wishlist', wishlist: user.wishlist });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user addresses
// @route   GET /api/users/addresses
// @access  Private
const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.addresses || []);
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add address
// @route   POST /api/users/addresses
// @access  Private
const addAddress = async (req, res) => {
  try {
    const { fullName, phone, address, city, state, zipCode, isDefault } = req.body;
    
    if (!fullName || !phone || !address || !city || !state || !zipCode) {
      return res.status(400).json({ message: 'All address fields are required' });
    }
    
    const user = await User.findById(req.user._id);

    const newAddress = {
      fullName,
      phone,
      address,
      city,
      state,
      zipCode,
      isDefault: isDefault || false
    };

    // If this is the first address or set as default, remove default from others
    if (newAddress.isDefault || user.addresses.length === 0) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
      newAddress.isDefault = true;
    }

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json(user.addresses);
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update address
// @route   PUT /api/users/addresses/:addressId
// @access  Private
const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { fullName, phone, address, city, state, zipCode, isDefault } = req.body;
    const user = await User.findById(req.user._id);

    const addressToUpdate = user.addresses.id(addressId);
    
    if (!addressToUpdate) {
      return res.status(404).json({ message: 'Address not found' });
    }

    if (fullName) addressToUpdate.fullName = fullName;
    if (phone) addressToUpdate.phone = phone;
    if (address) addressToUpdate.address = address;
    if (city) addressToUpdate.city = city;
    if (state) addressToUpdate.state = state;
    if (zipCode) addressToUpdate.zipCode = zipCode;

    if (isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
      addressToUpdate.isDefault = true;
    }

    await user.save();
    res.json(user.addresses);
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);

    const addressToDelete = user.addresses.id(addressId);
    
    if (!addressToDelete) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // Check if it was default
    const wasDefault = addressToDelete.isDefault;
    
    // Remove the address
    user.addresses.pull(addressId);
    
    // If the deleted address was default and there are other addresses, set another as default
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    res.json(user.addresses);
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Set default address
// @route   PUT /api/users/addresses/:addressId/default
// @access  Private
const setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user._id);

    user.addresses.forEach(addr => {
      addr.isDefault = addr._id.toString() === addressId;
    });

    await user.save();
    res.json(user.addresses);
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
};