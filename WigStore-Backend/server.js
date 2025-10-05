// server.js
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const { sequelize } = require('./models');
const User = require('./models/user.model');
const { notFound, errorHandler } = require('./middleware/error.middleware');
const app = express();

app.use(cors({
  origin: "*",
  credentials: true,
}));

// Import routes
const userRoutes = require('./routes/user.routes');
const categoryRoutes = require('./routes/category.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const adminRoutes = require('./routes/admin.routes');


// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));



// const allowedOrigins = [
//   process.env.CLIENT_URL,
//   /\.ngrok\.io$/, // Allow any ngrok.io tunnel
// ];

// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.some(o =>
//       o instanceof RegExp ? o.test(origin) : o === origin
//     )) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
// }));


// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    message: 'Server is running', 
    timestamp: new Date().toISOString() 
  });
});

// API Routes
app.use('/user', userRoutes);
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/admin', adminRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// 🧠 Sync DB & Seed Default Admin
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Database synchronized');

    const PORT = process.env.PORT || 5000;

    // 🧩 Create default admin if missing
    const defaultEmail = 'admin@wigstore.com';
    const adminExists = await User.findOne({ where: { email: defaultEmail } });

    if (!adminExists) {
      const hash = await bcrypt.hash('Admin123', 10);
      await User.create({
        name: 'Super Admin',
        email: defaultEmail,
        password: hash,
        role: 'admin',
      });
      console.log(`✅ Default admin created (email: ${defaultEmail}, password: Admin123)`);
    } else {
      console.log('⚙️  Admin already exists, skipping creation');
    }

    app.listen(PORT, () =>
      console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
    );
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
};

startServer();