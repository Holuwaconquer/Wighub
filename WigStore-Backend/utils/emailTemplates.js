/**
 * Email template generators for order notifications
 */

// User Order Confirmation Email
const getUserOrderConfirmationEmail = (order, user) => {
  const itemsHtml = order.orderItems
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <strong>${item.name}</strong><br>
        Size: ${item.size} | Color: ${item.color}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
        ₦${(item.price * item.quantity).toLocaleString('en-NG')}
      </td>
    </tr>
  `
    )
    .join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background-color: #8a0fb3; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Order Confirmation</h1>
      </div>
      
      <div style="padding: 20px; background-color: #f9f9f9;">
        <p>Hi ${user.name},</p>
        <p>Thank you for your order! We've received it and will start processing it shortly.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #8a0fb3; margin-top: 0;">Order Details</h2>
          <p><strong>Order ID:</strong> <span style="color: #8a0fb3; font-weight: bold;">${order.orderId}</span></p>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-NG')}</p>
          <p><strong>Status:</strong> <span style="background-color: #fff3cd; padding: 4px 8px; border-radius: 4px; color: #856404;">${order.status.toUpperCase()}</span></p>
          
          <h3 style="color: #333; border-bottom: 2px solid #8a0fb3; padding-bottom: 10px;">Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #8a0fb3;">Product</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #8a0fb3;">Qty</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #8a0fb3;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div style="border-top: 2px solid #8a0fb3; margin-top: 20px; padding-top: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Subtotal:</span>
              <strong>₦${order.itemsPrice.toLocaleString('en-NG')}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Shipping:</span>
              <strong>₦${order.shippingPrice.toLocaleString('en-NG')}</strong>
            </div>
            ${
              order.coupon && order.coupon.discount > 0
                ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Discount:</span>
              <strong style="color: green;">-₦${order.coupon.discount.toLocaleString('en-NG')}</strong>
            </div>
            `
                : ''
            }
            <div style="display: flex; justify-content: space-between; margin-top: 12px; padding-top: 12px; border-top: 1px solid #eee; font-size: 18px;">
              <span style="font-weight: bold;">Total:</span>
              <strong style="color: #8a0fb3;">₦${order.totalPrice.toLocaleString('en-NG')}</strong>
            </div>
          </div>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Shipping Address</h3>
          <p>
            ${order.shippingAddress.fullName}<br>
            ${order.shippingAddress.address}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
            Phone: ${order.shippingAddress.phone}
          </p>
          <p style="margin-top: 12px;"><strong>Shipping Method:</strong> ${order.shippingLocation?.name || 'Standard'}</p>
        </div>
        
        <p style="margin-top: 30px; text-align: center;">
          You can track your order using Order ID: <strong style="color: #8a0fb3;">${order.orderId}</strong>
        </p>
        
        <p style="color: #666; font-size: 12px; text-align: center; margin-top: 20px;">
          If you have any questions, please don't hesitate to contact us.
        </p>
      </div>
      
      <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666;">
        <p>Minka Luxury Hair | https://minkaluxury.com</p>
      </div>
    </div>
  `;
};

// Admin Order Notification Email
const getAdminOrderNotificationEmail = (order, user) => {
  const itemsHtml = order.orderItems
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee; display: flex; gap: 12px; align-items: center;">
        <img src="${item.image || ''}" alt="${item.name}" width="60" height="60" style="object-fit: cover; border-radius: 8px;" />
        <div>
          <strong>${item.name}</strong><br>
          ${item.size ? `Size: ${item.size}<br>` : ''}
          ${item.color ? `Color: ${item.color}` : ''}
        </div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₦${(item.price * item.quantity).toLocaleString('en-NG')}</td>
    </tr>
  `
    )
    .join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background-color: #8a0fb3; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">🎉 New Order Received!</h1>
      </div>
      
      <div style="padding: 20px; background-color: #f9f9f9;">
        <p>A new order has been placed on your store.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #8a0fb3; margin-top: 0;">Order Information</h2>
          <p><strong>Order ID:</strong> <span style="color: #8a0fb3; font-weight: bold; font-size: 16px;">${order.orderId}</span></p>
          <p><strong>Customer:</strong> ${user.name}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Phone:</strong> ${order.shippingAddress.phone}</p>
          <p><strong>Shipping Method:</strong> ${order.shippingLocation?.name || 'Standard'}</p>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-NG', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
          
          <h3 style="color: #333; border-bottom: 2px solid #8a0fb3; padding-bottom: 10px; margin-top: 20px;">Items</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f0f0f0;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #8a0fb3;">Product</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #8a0fb3;">Qty</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #8a0fb3;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div style="border-top: 2px solid #8a0fb3; margin-top: 20px; padding-top: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Order Total:</span>
              <strong style="color: #8a0fb3; font-size: 18px;">₦${order.totalPrice.toLocaleString('en-NG')}</strong>
            </div>
          </div>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">Delivery Address</h3>
          <p>
            ${order.shippingAddress.fullName}<br>
            ${order.shippingAddress.address}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}
          </p>
        </div>
        
        <p style="text-align: center; margin-top: 20px;">
          <a href="${process.env.CLIENT_URL}/admin/orders/${order._id}" style="background-color: #8a0fb3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">View Order Details</a>
        </p>
      </div>
    </div>
  `;
};

// User Order Status Update Email
const getOrderStatusUpdateEmail = (order, user, newStatus) => {
  const statusMessages = {
    pending: '⏳ Your order is pending',
    processing: '📦 We are processing your order',
    shipped: '🚚 Your order has been shipped',
    delivered: '✅ Your order has been delivered',
    cancelled: '❌ Your order has been cancelled'
  };

  const statusColors = {
    pending: '#ffc107',
    processing: '#17a2b8',
    shipped: '#6f42c1',
    delivered: '#28a745',
    cancelled: '#dc3545'
  };

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background-color: ${statusColors[newStatus]}; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">${statusMessages[newStatus]}</h1>
      </div>
      
      <div style="padding: 20px; background-color: #f9f9f9;">
        <p>Hi ${user.name},</p>
        <p>We wanted to let you know that your order status has been updated.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Order Update</h2>
          <p><strong>Order ID:</strong> <span style="color: #8a0fb3; font-weight: bold;">${order.orderId}</span></p>
          <p><strong>New Status:</strong> 
            <span style="background-color: ${statusColors[newStatus]}; color: white; padding: 6px 12px; border-radius: 4px;">
              ${newStatus.toUpperCase()}
            </span>
          </p>
          ${
            order.trackingNumber
              ? `<p><strong>Tracking Number:</strong> <code style="background-color: #f0f0f0; padding: 4px 8px; border-radius: 4px;">${order.trackingNumber}</code></p>`
              : ''
          }
          <p><strong>Updated At:</strong> ${new Date().toLocaleDateString('en-NG', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>
        
        ${
          newStatus === 'delivered'
            ? `
        <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
          <p style="margin: 0;">
            <strong>Your order has been delivered!</strong><br>
            Thank you for shopping with us. We hope you love your purchase!
          </p>
        </div>
        `
            : ''
        }
        
        ${
          newStatus === 'shipped'
            ? `
        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196f3;">
          <p style="margin: 0;">
            <strong>Your order is on its way!</strong><br>
            Track your package using the tracking number above.
          </p>
        </div>
        `
            : ''
        }
        
        <p style="color: #666; font-size: 12px; text-align: center; margin-top: 20px;">
          If you have any questions, please contact us at ${process.env.ADMIN_EMAIL}
        </p>
      </div>
      
      <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666;">
        <p>Minka Luxury Hair | https://minkaluxury.com</p>
      </div>
    </div>
  `;
};

module.exports = {
  getUserOrderConfirmationEmail,
  getAdminOrderNotificationEmail,
  getOrderStatusUpdateEmail
};
