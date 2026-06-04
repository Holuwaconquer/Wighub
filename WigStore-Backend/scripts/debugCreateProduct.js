const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

const testAdmin = {
  email: 'admin@minka.com',
  password: 'admin123',
};

const testProduct = {
  name: 'Virgin Brazilian Hair',
  description: 'Debug create product for slug issue',
  price: 580000,
  originalPrice: 630000,
  category: 'Wigs',
  hairType: 'Brazilian',
  texture: 'Straight',
  length: '22 inch',
  weight: '250g',
  stock: 12,
  sku: `DEBUG-${Date.now()}`,
  images: ['https://example.com/image.jpg'],
  features: ['Premium virgin hair', 'Soft and shiny'],
  specifications: {
    'Hair Type': 'Brazilian',
    'Texture': 'Straight',
    'Length': '22 inch'
  },
  status: 'active'
};

(async () => {
  try {
    const login = await axios.post(`${API_URL}/auth/login`, testAdmin);
    const token = login.data.token;
    console.log('Admin token:', token.substring(0, 20) + '...');
    
    const response = await axios.post(`${API_URL}/products`, testProduct, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Create success:', response.data.slug, response.data._id);
  } catch (error) {
    console.error('Create error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
})();
