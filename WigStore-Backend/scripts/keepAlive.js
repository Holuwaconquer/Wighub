const axios = require('axios');

const targetUrl = process.env.BACKEND_URL || 'http://localhost:5000/api/health';

const pingHealth = async () => {
  try {
    const response = await axios.get(targetUrl, { timeout: 10000 });
    console.log(`KeepAlive ping successful: ${response.status} ${response.statusText}`);
  } catch (error) {
    console.error('KeepAlive ping failed:', error.message || error);
    process.exit(1);
  }
};

pingHealth();
