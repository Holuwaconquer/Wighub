const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:5000/api';
let authToken = '';
let testProductId = '';
let testOrderId = '';
let testCouponId = '';
let testReviewId = '';
let testCouponCode = '';

// Test data
const testUser = {
  name: 'Test Customer',
  email: `test${Date.now()}@example.com`,
  password: 'test123456',
  phone: '+2348012345678'
};

const testAdmin = {
  email: 'admin@minka.com',
  password: 'admin123'
};

const testProduct = {
  name: 'Test Brazilian Wig',
  description: '100% Virgin Human Hair Brazilian Wig',
  price: 250000,
  originalPrice: 350000,
  category: 'Wigs',
  hairType: 'Brazilian',
  texture: 'Straight',
  length: '22 inch',
  weight: '300 grams',
  stock: 50,
  sku: `TEST-${Date.now()}`,
  images: ['https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=500'],
  features: ['100% Virgin Hair', 'Pre-plucked', 'Bleached Knots'],
  specifications: {
    'Hair Type': 'Brazilian',
    'Texture': 'Straight',
    'Length': '22 inches'
  },
  careInstructions: ['Wash gently', 'Air dry'],
  isBestSeller: true,
  isNew: true,
  status: 'active'
};

const testAddress = {
  fullName: 'Test User',
  phone: '+2348012345678',
  address: '123 Test Street',
  city: 'Lagos',
  state: 'Lagos',
  zipCode: '100001',
  isDefault: true
};

const testCoupon = {
  code: `TEST${Date.now().toString().slice(-6)}`,
  type: 'percentage',
  value: 10,
  minPurchase: 50000,
  maxDiscount: 5000,
  expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  usageLimit: 100
};

const testReview = {
  productId: '',
  rating: 5,
  title: 'Excellent Product!',
  comment: 'This is an amazing product. Highly recommended!'
};

// Helper function to log results
const logResult = (testName, status, data = null) => {
  const icon = status === 'PASS' ? '✅' : '❌';
  console.log(`${icon} ${testName}: ${status}`);
  if (data && status === 'PASS') {
    console.log(`   📦 Response:`, typeof data === 'object' ? JSON.stringify(data).slice(0, 200) : data);
  }
  if (data && status === 'FAIL') {
    console.log(`   ⚠️ Error:`, data);
  }
};

// Main test suite
const runTests = async () => {
  console.log('\n🚀 Starting API Endpoint Tests...\n');
  console.log('='.repeat(60));

  try {
    // ==================== HEALTH CHECK ====================
    console.log('\n📡 TESTING HEALTH CHECK...');
    try {
      const healthRes = await axios.get('http://localhost:5000/api/health');
      logResult('Health Check', 'PASS', healthRes.data);
    } catch (error) {
      logResult('Health Check', 'FAIL', error.message);
      console.log('\n❌ Server is not running! Make sure to start the server first.');
      return;
    }

    // ==================== AUTH TESTS ====================
    console.log('\n🔐 TESTING AUTH ENDPOINTS...');

    // Register User
    try {
      const registerRes = await axios.post(`${API_URL}/auth/register`, testUser);
      authToken = registerRes.data.token;
      logResult('User Registration', 'PASS', { email: registerRes.data.email });
    } catch (error) {
      logResult('User Registration', 'FAIL', error.response?.data?.message || error.message);
    }

    // Login User
    try {
      const loginRes = await axios.post(`${API_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      authToken = loginRes.data.token;
      logResult('User Login', 'PASS', { email: loginRes.data.email });
    } catch (error) {
      logResult('User Login', 'FAIL', error.response?.data?.message || error.message);
    }

    // Get User Profile
    try {
      const profileRes = await axios.get(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      logResult('Get Profile', 'PASS', { name: profileRes.data.name });
    } catch (error) {
      logResult('Get Profile', 'FAIL', error.response?.data?.message || error.message);
    }

    // Update User Profile
    try {
      const updateRes = await axios.put(`${API_URL}/auth/profile`, 
        { name: 'Updated Test Name', phone: '+2348123456789' },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      logResult('Update Profile', 'PASS', { name: updateRes.data.name });
    } catch (error) {
      logResult('Update Profile', 'FAIL', error.response?.data?.message || error.message);
    }

    // ==================== USER ENDPOINTS ====================
    console.log('\n👤 TESTING USER ENDPOINTS...');

    // Add Address
    try {
      const addressRes = await axios.post(`${API_URL}/users/addresses`, testAddress, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      logResult('Add Address', 'PASS', { count: addressRes.data.length });
    } catch (error) {
      logResult('Add Address', 'FAIL', error.response?.data?.message || error.message);
    }

    // Get Addresses
    try {
      const addressesRes = await axios.get(`${API_URL}/users/addresses`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      logResult('Get Addresses', 'PASS', { count: addressesRes.data.length });
    } catch (error) {
      logResult('Get Addresses', 'FAIL', error.response?.data?.message || error.message);
    }

    // ==================== PRODUCT TESTS ====================
    console.log('\n📦 TESTING PRODUCT ENDPOINTS...');

    // Get All Products
    try {
      const productsRes = await axios.get(`${API_URL}/products`);
      logResult('Get All Products', 'PASS', { count: productsRes.data.products?.length || 0 });
    } catch (error) {
      logResult('Get All Products', 'FAIL', error.response?.data?.message || error.message);
    }

    // Get Featured Products
    try {
      const featuredRes = await axios.get(`${API_URL}/products/featured`);
      logResult('Get Featured Products', 'PASS', { count: featuredRes.data.length });
    } catch (error) {
      logResult('Get Featured Products', 'FAIL', error.response?.data?.message || error.message);
    }

    // Get New Arrivals
    try {
      const newRes = await axios.get(`${API_URL}/products/new-arrivals`);
      logResult('Get New Arrivals', 'PASS', { count: newRes.data.length });
    } catch (error) {
      logResult('Get New Arrivals', 'FAIL', error.response?.data?.message || error.message);
    }

    // Get Best Sellers
    try {
      const bestRes = await axios.get(`${API_URL}/products/best-sellers`);
      logResult('Get Best Sellers', 'PASS', { count: bestRes.data.length });
    } catch (error) {
      logResult('Get Best Sellers', 'FAIL', error.response?.data?.message || error.message);
    }

    // ==================== ADMIN TESTS ====================
    console.log('\n👑 TESTING ADMIN ENDPOINTS...');

    // Login as Admin
    let adminToken = '';
    try {
      const adminLoginRes = await axios.post(`${API_URL}/auth/login`, testAdmin);
      adminToken = adminLoginRes.data.token;
      logResult('Admin Login', 'PASS', { email: adminLoginRes.data.email });
    } catch (error) {
      logResult('Admin Login', 'FAIL', error.response?.data?.message || error.message);
    }

    // Create Product (Admin)
    if (adminToken) {
      try {
        const createProductRes = await axios.post(`${API_URL}/admin/products`, testProduct, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        testProductId = createProductRes.data._id;
        testReview.productId = testProductId;
        logResult('Create Product (Admin)', 'PASS', { id: testProductId, name: createProductRes.data.name });
      } catch (error) {
        logResult('Create Product (Admin)', 'FAIL', error.response?.data?.message || error.message);
      }

      // Get Single Product
      if (testProductId) {
        try {
          const productRes = await axios.get(`${API_URL}/products/${testProductId}`);
          logResult('Get Single Product', 'PASS', { name: productRes.data.name });
        } catch (error) {
          logResult('Get Single Product', 'FAIL', error.response?.data?.message || error.message);
        }
      }

      // Update Product (Admin)
      if (testProductId) {
        try {
          const updateProductRes = await axios.put(`${API_URL}/admin/products/${testProductId}`,
            { price: 260000, stock: 45 },
            { headers: { Authorization: `Bearer ${adminToken}` } }
          );
          logResult('Update Product (Admin)', 'PASS', { price: updateProductRes.data.price });
        } catch (error) {
          logResult('Update Product (Admin)', 'FAIL', error.response?.data?.message || error.message);
        }
      }
    }

    // ==================== COUPON TESTS ====================
    console.log('\n🏷️ TESTING COUPON ENDPOINTS...');

    // Create Coupon (Admin)
    if (adminToken) {
      try {
        const createCouponRes = await axios.post(`${API_URL}/coupons`, testCoupon, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        testCouponId = createCouponRes.data._id;
        testCouponCode = createCouponRes.data.code;
        logResult('Create Coupon (Admin)', 'PASS', { code: createCouponRes.data.code });
      } catch (error) {
        logResult('Create Coupon (Admin)', 'FAIL', error.response?.data?.message || error.message);
      }

      // Get All Coupons (Admin)
      try {
        const couponsRes = await axios.get(`${API_URL}/coupons`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        logResult('Get All Coupons (Admin)', 'PASS', { count: couponsRes.data.length });
      } catch (error) {
        logResult('Get All Coupons (Admin)', 'FAIL', error.response?.data?.message || error.message);
      }
    }

    // Validate Coupon (Public)
    try {
      const validateRes = await axios.post(`${API_URL}/coupons/validate`, {
        code: testCoupon.code,
        total: 100000
      });
      logResult('Validate Coupon', 'PASS', { discount: validateRes.data.discount });
    } catch (error) {
      logResult('Validate Coupon', 'FAIL', error.response?.data?.message || error.message);
    }

    // ==================== REVIEW TESTS ====================
    console.log('\n⭐ TESTING REVIEW ENDPOINTS...');

    // Get Product Reviews
    if (testProductId) {
      try {
        const reviewsRes = await axios.get(`${API_URL}/reviews/product/${testProductId}`);
        logResult('Get Product Reviews', 'PASS', { count: reviewsRes.data.length });
      } catch (error) {
        logResult('Get Product Reviews', 'FAIL', error.response?.data?.message || error.message);
      }
    }

    // ==================== ORDER TESTS ====================
    console.log('\n🛒 TESTING ORDER ENDPOINTS...');

    // Create Order
    if (testProductId && authToken) {
      const testOrder = {
        orderItems: [
          {
            product: testProductId,
            name: testProduct.name,
            price: testProduct.price,
            quantity: 2,
            size: '22 inch',
            color: 'Natural Black',
            image: testProduct.images[0]
          }
        ],
        shippingAddress: testAddress,
        paymentMethod: 'cod',
        itemsPrice: testProduct.price * 2,
        taxPrice: (testProduct.price * 2) * 0.075,
        shippingPrice: 15000,
        totalPrice: (testProduct.price * 2) + ((testProduct.price * 2) * 0.075) + 15000,
        couponCode: testCouponCode
      };

      try {
        const createOrderRes = await axios.post(`${API_URL}/orders`, testOrder, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        testOrderId = createOrderRes.data._id;
        logResult('Create Order', 'PASS', { id: testOrderId, total: createOrderRes.data.totalPrice });
      } catch (error) {
        logResult('Create Order', 'FAIL', error.response?.data?.message || error.message);
      }

      // Get My Orders
      try {
        const myOrdersRes = await axios.get(`${API_URL}/orders`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        logResult('Get My Orders', 'PASS', { count: myOrdersRes.data.length });
      } catch (error) {
        logResult('Get My Orders', 'FAIL', error.response?.data?.message || error.message);
      }

      // Get Single Order
      if (testOrderId) {
        try {
          const orderRes = await axios.get(`${API_URL}/orders/${testOrderId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
          });
          logResult('Get Single Order', 'PASS', { status: orderRes.data.status });
        } catch (error) {
          logResult('Get Single Order', 'FAIL', error.response?.data?.message || error.message);
        }
      }
    }

    // ==================== ADDITIONAL ORDER TESTS ====================
    console.log('\n📦 ADDITIONAL ORDER TESTS...');

    // Test order status flow (Admin)
    if (testOrderId && adminToken) {
      // Update to processing
      try {
        const processingRes = await axios.put(`${API_URL}/admin/orders/${testOrderId}/status`,
          { status: 'processing' },
          { headers: { Authorization: `Bearer ${adminToken}` } }
        );
        logResult('Update Order to Processing', 'PASS', { status: processingRes.data.status });
      } catch (error) {
        logResult('Update Order to Processing', 'FAIL', error.response?.data?.message || error.message);
      }
      
      // Update to shipped
      try {
        const shippedRes = await axios.put(`${API_URL}/admin/orders/${testOrderId}/status`,
          { status: 'shipped', trackingNumber: 'TRK123456789' },
          { headers: { Authorization: `Bearer ${adminToken}` } }
        );
        logResult('Update Order to Shipped', 'PASS', { status: shippedRes.data.status });
      } catch (error) {
        logResult('Update Order to Shipped', 'FAIL', error.response?.data?.message || error.message);
      }
      
      // Update to delivered
      try {
        const deliveredRes = await axios.put(`${API_URL}/admin/orders/${testOrderId}/status`,
          { status: 'delivered' },
          { headers: { Authorization: `Bearer ${adminToken}` } }
        );
        logResult('Update Order to Delivered', 'PASS', { status: deliveredRes.data.status });
      } catch (error) {
        logResult('Update Order to Delivered', 'FAIL', error.response?.data?.message || error.message);
      }
    }

    // Test order with coupon discount
    if (adminToken && testCouponCode && testProductId) {
      try {
        const orderWithCoupon = {
          orderItems: [
            {
              product: testProductId,
              name: testProduct.name,
              price: testProduct.price,
              quantity: 1,
              size: '22 inch',
              color: 'Natural Black',
              image: testProduct.images[0]
            }
          ],
          shippingAddress: testAddress,
          paymentMethod: 'card',
          itemsPrice: testProduct.price,
          taxPrice: testProduct.price * 0.075,
          shippingPrice: 15000,
          totalPrice: testProduct.price + (testProduct.price * 0.075) + 15000,
          couponCode: testCouponCode
        };
        
        const orderRes = await axios.post(`${API_URL}/orders`, orderWithCoupon, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        logResult('Create Order with Coupon', 'PASS', { 
          id: orderRes.data._id,
          couponApplied: orderRes.data.coupon?.code 
        });
        
        // Clean up
        await axios.put(`${API_URL}/orders/${orderRes.data._id}/cancel`, {}, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
      } catch (error) {
        logResult('Create Order with Coupon', 'FAIL', error.response?.data?.message || error.message);
      }
    }

    // Test payment method variations
    if (adminToken && testProductId) {
      const paymentMethods = ['card', 'bank', 'cod'];
      
      for (const method of paymentMethods) {
        try {
          const testPaymentOrder = {
            orderItems: [
              {
                product: testProductId,
                name: testProduct.name,
                price: testProduct.price,
                quantity: 1,
                size: '22 inch',
                color: 'Natural Black',
                image: testProduct.images[0]
              }
            ],
            shippingAddress: testAddress,
            paymentMethod: method,
            itemsPrice: testProduct.price,
            taxPrice: testProduct.price * 0.075,
            shippingPrice: 15000,
            totalPrice: testProduct.price + (testProduct.price * 0.075) + 15000
          };
          
          const orderRes = await axios.post(`${API_URL}/orders`, testPaymentOrder, {
            headers: { Authorization: `Bearer ${authToken}` }
          });
          logResult(`Create Order with ${method.toUpperCase()} Payment`, 'PASS', { id: orderRes.data._id });
          
          // Cancel the test order
          await axios.put(`${API_URL}/orders/${orderRes.data._id}/cancel`, {}, {
            headers: { Authorization: `Bearer ${authToken}` }
          });
        } catch (error) {
          logResult(`Create Order with ${method.toUpperCase()} Payment`, 'FAIL', error.response?.data?.message || error.message);
        }
      }
    }

    // Test order history
    if (authToken) {
      try {
        const historyRes = await axios.get(`${API_URL}/orders`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        logResult('Get Order History', 'PASS', { totalOrders: historyRes.data.length });
      } catch (error) {
        logResult('Get Order History', 'FAIL', error.response?.data?.message || error.message);
      }
    }

    // ==================== REVIEW AFTER DELIVERY TEST ====================
    console.log('\n⭐ REVIEW AFTER DELIVERY TEST...');

    // Create a review after order is delivered
    if (adminToken && authToken && testProductId) {
      try {
        // Create a new order for review test
        const testOrderForReview = {
          orderItems: [
            {
              product: testProductId,
              name: testProduct.name,
              price: testProduct.price,
              quantity: 1,
              size: '22 inch',
              color: 'Natural Black',
              image: testProduct.images[0]
            }
          ],
          shippingAddress: testAddress,
          paymentMethod: 'cod',
          itemsPrice: testProduct.price,
          taxPrice: testProduct.price * 0.075,
          shippingPrice: 15000,
          totalPrice: testProduct.price + (testProduct.price * 0.075) + 15000
        };
        
        const orderRes = await axios.post(`${API_URL}/orders`, testOrderForReview, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        const newOrderId = orderRes.data._id;
        
        // Mark as delivered (admin)
        await axios.put(`${API_URL}/admin/orders/${newOrderId}/status`,
          { status: 'delivered' },
          { headers: { Authorization: `Bearer ${adminToken}` } }
        );
        
        // Now create review (should work)
        const reviewData = {
          productId: testProductId,
          rating: 5,
          title: 'Amazing Product!',
          comment: 'This product exceeded my expectations. Highly recommended!'
        };
        
        const reviewRes = await axios.post(`${API_URL}/reviews`, reviewData, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        testReviewId = reviewRes.data._id;
        logResult('Create Review After Delivery', 'PASS', { id: testReviewId });
        
        // Approve review (Admin)
        await axios.put(`${API_URL}/reviews/admin/${testReviewId}/approve`, {}, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        logResult('Approve Review (Admin)', 'PASS', {});
        
        // Clean up review
        await axios.delete(`${API_URL}/reviews/admin/${testReviewId}`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        
        // Cancel the test order
        await axios.put(`${API_URL}/orders/${newOrderId}/cancel`, {}, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        
      } catch (error) {
        logResult('Create Review After Delivery', 'FAIL', error.response?.data?.message || error.message);
      }
    }

    // ==================== ADMIN DASHBOARD TESTS ====================
    console.log('\n📊 TESTING ADMIN DASHBOARD...');

    if (adminToken) {
      // Get Dashboard Stats
      try {
        const statsRes = await axios.get(`${API_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        logResult('Get Dashboard Stats', 'PASS', {
          users: statsRes.data.stats.totalUsers,
          products: statsRes.data.stats.totalProducts,
          orders: statsRes.data.stats.totalOrders
        });
      } catch (error) {
        logResult('Get Dashboard Stats', 'FAIL', error.response?.data?.message || error.message);
      }

      // Get All Users (Admin)
      try {
        const usersRes = await axios.get(`${API_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        logResult('Get All Users (Admin)', 'PASS', { count: usersRes.data.length });
      } catch (error) {
        logResult('Get All Users (Admin)', 'FAIL', error.response?.data?.message || error.message);
      }

      // Get All Orders (Admin)
      try {
        const allOrdersRes = await axios.get(`${API_URL}/admin/orders`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        logResult('Get All Orders (Admin)', 'PASS', { count: allOrdersRes.data.orders?.length || 0 });
      } catch (error) {
        logResult('Get All Orders (Admin)', 'FAIL', error.response?.data?.message || error.message);
      }
    }

    // ==================== CLEANUP ====================
    console.log('\n🧹 CLEANUP (Deleting test data)...');

    // Cancel Order
    if (testOrderId && authToken) {
      try {
        await axios.put(`${API_URL}/orders/${testOrderId}/cancel`, {}, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        logResult('Cancel Order', 'PASS', { orderId: testOrderId });
      } catch (error) {
        logResult('Cancel Order', 'FAIL', error.response?.data?.message || error.message);
      }
    }

    // Delete Review (Admin)
    if (testReviewId && adminToken) {
      try {
        await axios.delete(`${API_URL}/reviews/admin/${testReviewId}`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        logResult('Delete Review (Admin)', 'PASS', { reviewId: testReviewId });
      } catch (error) {
        logResult('Delete Review (Admin)', 'FAIL', error.response?.data?.message || error.message);
      }
    }

    // Delete Coupon (Admin)
    if (testCouponId && adminToken) {
      try {
        await axios.delete(`${API_URL}/coupons/${testCouponId}`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        logResult('Delete Coupon (Admin)', 'PASS', { couponId: testCouponId });
      } catch (error) {
        logResult('Delete Coupon (Admin)', 'FAIL', error.response?.data?.message || error.message);
      }
    }

    // Delete Product (Admin)
    if (testProductId && adminToken) {
      try {
        await axios.delete(`${API_URL}/admin/products/${testProductId}`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        logResult('Delete Product (Admin)', 'PASS', { productId: testProductId });
      } catch (error) {
        logResult('Delete Product (Admin)', 'FAIL', error.response?.data?.message || error.message);
      }
    }

  } catch (error) {
    console.error('\n❌ Unexpected error during tests:', error.message);
  }

  // Final summary
  console.log('\n' + '='.repeat(60));
  console.log('✅ API Endpoint Tests Completed!');
  console.log('='.repeat(60) + '\n');
};

// Run the tests
runTests();