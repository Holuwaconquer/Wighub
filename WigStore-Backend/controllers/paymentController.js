const Order = require("../models/Order");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");
const axios = require("axios");
const crypto = require("crypto");
const generateOrderId = require("../utils/generateOrderId");
const sendEmail = require("../utils/sendEmail");

const KORA_API_URL =
  process.env.KORA_API_URL || "https://api.korapay.com/merchant/api/v1";
const KORA_SECRET_KEY = process.env.KORA_SECRET_KEY;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

/**
 * @desc    Initialize a Kora payment transaction and create order
 * @route   POST /api/payments/initialize
 * @access  Private
 */
const initializePayment = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      shippingLocation,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      couponCode,
      amount,
      currency = "NGN",
      email,
      name,
      channels = [],
      defaultChannel = "card",
    } = req.body;

    if (!orderItems || orderItems.length === 0 || !email) {
      return res.status(400).json({
        message: "Missing required fields: orderItems, email",
      });
    }

    // Verify products are still in stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          message: `${item.name} is out of stock or insufficient quantity`,
        });
      }
    }

    // Apply coupon if provided
    let couponDiscount = 0;
    let couponData = null;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (coupon && coupon.isValid()) {
        if (coupon.type === "percentage") {
          couponDiscount = (totalPrice * coupon.value) / 100;
          if (coupon.maxDiscount && couponDiscount > coupon.maxDiscount) {
            couponDiscount = coupon.maxDiscount;
          }
        } else {
          couponDiscount = coupon.value;
        }
        coupon.usedCount += 1;
        await coupon.save();
        couponData = { code: coupon.code, discount: couponDiscount };
      }
    }

    // Create order with pending payment status
    const order = new Order({
      orderId: generateOrderId(),
      user: req.user._id,
      orderItems,
      shippingAddress,
      shippingLocation: shippingLocation || {
        name: "Standard",
        fee: shippingPrice || 0,
      },
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice: totalPrice - couponDiscount,
      coupon: couponData,
      paymentStatus: "pending",
    });

    const createdOrder = await order.save();

    // Generate unique transaction reference (use underscores to avoid URL encoding issues)
    const reference = `MINKA_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Prepare Kora request payload
    const koraPayload = {
      amount: Math.round(totalPrice - couponDiscount), // Amount in NGN (Kora expects amount in naira)
      currency,
      reference,
      narration: `Minka Luxury Hair Order ${createdOrder.orderId}`,
      redirect_url: `${CLIENT_URL}/order-confirmation/${createdOrder._id}?payment_ref=${reference}`,
      notification_url: `${process.env.BACKEND_URL || "http://localhost:5000"}/api/payments/webhook`,
      customer: {
        email,
        name: name || req.user.name || "Customer",
      },
      channels:
        channels.length > 0
          ? channels
          : ["card", "bank_transfer", "pay_with_bank"],
      default_channel: defaultChannel,
      metadata: {
        orderId: createdOrder._id.toString(),
        userId: req.user._id.toString(),
        productCount: orderItems.length,
      },
    };

    // Call Kora initialize endpoint
    const koraResponse = await axios.post(
      `${KORA_API_URL}/charges/initialize`,
      koraPayload,
      {
        headers: {
          Authorization: `Bearer ${KORA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log(
      "Kora Initialize Response:",
      JSON.stringify(koraResponse.data, null, 2),
    );

    if (!koraResponse.data.status) {
      // Delete the order if payment initialization fails
      await Order.findByIdAndDelete(createdOrder._id);
      return res.status(400).json({
        message: koraResponse.data.message || "Failed to initialize payment",
      });
    }

    // Update order with payment reference from Kora response
    // Store the reference we sent - this is what Kora will recognize for verification
    createdOrder.paymentReference = reference;
    await createdOrder.save();

    console.log("Order saved with paymentReference:", reference);

    return res.status(200).json({
      status: true,
      message: "Payment initialized successfully",
      data: {
        checkout_url: koraResponse.data.data.checkout_url,
        reference: reference,
        orderId: createdOrder._id.toString(),
      },
    });
  } catch (error) {
    console.error(
      "Payment initialization error:",
      error.response?.data || error.message,
    );
    return res.status(500).json({
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to initialize payment",
    });
  }
};

/**
 * @desc    Verify a Kora payment transaction
 * @route   POST /api/payments/verify
 * @access  Private
 */
const verifyPayment = async (req, res) => {
  try {
    const { reference, orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        message: "Missing required field: orderId",
      });
    }

    // Verify the order exists and belongs to the user
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Use the charge_id stored in the order (from Kora response) for verification
    const chargeId = order.paymentReference;
    console.log("Attempting verification with chargeId:", chargeId);
    console.log("Order details:", {
      orderId,
      userId: req.user._id,
      paymentReference: order.paymentReference,
    });

    if (!chargeId) {
      return res.status(400).json({
        message: "Payment reference not found for this order",
      });
    }

    // Call Kora verify endpoint - get charge details by reference (as path parameter)
    const koraResponse = await axios.get(
      `${KORA_API_URL}/charges/${chargeId}`,
      {
        headers: {
          Authorization: `Bearer ${KORA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log(
      "Kora Verify Response:",
      JSON.stringify(koraResponse.data, null, 2),
    );

    // Handle both single charge object and array response
    let paymentData = koraResponse.data.data;
    if (Array.isArray(paymentData) && paymentData.length > 0) {
      paymentData = paymentData[0];
    }

    if (!koraResponse.data.status) {
      await Order.findByIdAndDelete(orderId);
      return res.status(400).json({
        message: koraResponse.data.message || "Failed to verify payment",
        paymentStatus: "failed",
      });
    }

    // Update order based on payment status
    if (paymentData.status === "success") {
      // Determine payment method from response data - map to valid enum values
      let paymentMethod = "kora_card"; // default
      if (paymentData.card) {
        paymentMethod = "kora_card";
      } else if (paymentData.bank) {
        paymentMethod = "kora_bank";
      } else if (paymentData.mobile_money) {
        paymentMethod = "kora_mobile_money";
      }

      order.paymentStatus = "completed";
      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentMethod = paymentMethod;
      await order.save();

      // Send confirmation emails if not already sent
      try {
        if (!order.notificationSent) {
          await order.populate("user", "name email");
          await order.populate("orderItems.product");

          const userEmailHtml =
            require("../utils/emailTemplates").getUserOrderConfirmationEmail(
              order,
              order.user,
            );
          await sendEmail({
            email: order.user.email,
            subject: `Order Confirmation - Order #${order.orderId}`,
            html: userEmailHtml,
          });

          const adminEmailHtml =
            require("../utils/emailTemplates").getAdminOrderNotificationEmail(
              order,
              order.user,
            );
          await sendEmail({
            email: process.env.ADMIN_EMAIL,
            subject: `New Order Received - Order #${order.orderId}`,
            html: adminEmailHtml,
          });

          order.notificationSent = true;
          await order.save();
        }
      } catch (emailErr) {
        console.error("Failed to send post-payment emails:", emailErr);
      }

      return res.status(200).json({
        status: true,
        message: "Payment verified successfully",
        data: {
          orderId,
          paymentStatus: "completed",
          paymentMethod: paymentMethod,
          amount: paymentData.amount,
        },
      });
    } else if (paymentData.status === "pending") {
      order.paymentStatus = "pending";
      await order.save();

      return res.status(200).json({
        status: true,
        message: "Payment is still pending",
        data: {
          orderId,
          paymentStatus: "pending",
        },
      });
    } else {
      await Order.findByIdAndDelete(orderId);

      return res.status(400).json({
        status: false,
        message: "Payment failed",
        data: {
          orderId,
          paymentStatus: "failed",
          reference,
        },
      });
    }
  } catch (error) {
    console.error(
      "Payment verification error:",
      error.response?.data || error.message,
    );

    if (req.body?.orderId) {
      await Order.findByIdAndDelete(req.body.orderId).catch(() => {});
    }

    return res.status(500).json({
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to verify payment",
    });
  }
};

/**
 * @desc    Handle Kora webhook notifications
 * @route   POST /api/payments/webhook
 * @access  Public (Kora webhook)
 */
const handleWebhook = async (req, res) => {
  try {
    const { event, data } = req.body;

    if (!event || !data) {
      return res.status(400).json({ message: "Invalid webhook payload" });
    }

    // Verify webhook authenticity (optional but recommended)
    // You can implement signature verification if Kora provides it

    if (event === "charge.success") {
      const { reference, metadata } = data;

      // Find order by payment reference
      const order = await Order.findById(metadata.orderId);
      if (order) {
        // Determine payment method from webhook data - map to valid enum values
        let paymentMethod = "kora_card"; // default
        if (data.card) {
          paymentMethod = "kora_card";
        } else if (data.bank) {
          paymentMethod = "kora_bank";
        } else if (data.mobile_money) {
          paymentMethod = "kora_mobile_money";
        }

        order.paymentStatus = "completed";
        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentMethod = paymentMethod;
        await order.save();

        // Send confirmation emails if not already sent
        try {
          if (!order.notificationSent) {
            await order.populate("user", "name email");
            await order.populate("orderItems.product");

            const userEmailHtml =
              require("../utils/emailTemplates").getUserOrderConfirmationEmail(
                order,
                order.user,
              );
            await sendEmail({
              email: order.user.email,
              subject: `Order Confirmation - Order #${order.orderId}`,
              html: userEmailHtml,
            });

            const adminEmailHtml =
              require("../utils/emailTemplates").getAdminOrderNotificationEmail(
                order,
                order.user,
              );
            await sendEmail({
              email: process.env.ADMIN_EMAIL,
              subject: `New Order Received - Order #${order.orderId}`,
              html: adminEmailHtml,
            });

            order.notificationSent = true;
            await order.save();
          }
        } catch (emailErr) {
          console.error(
            "Failed to send webhook post-payment emails:",
            emailErr,
          );
        }

        console.log(`Payment confirmed for order ${order.orderId}`);
      }
    }

    // Always return 200 to acknowledge receipt
    return res.status(200).json({
      status: true,
      message: "Webhook received",
    });
  } catch (error) {
    console.error("Webhook error:", error.message);
    // Still return 200 to prevent Kora from retrying
    return res.status(200).json({
      status: true,
      message: "Webhook processed",
    });
  }
};

module.exports = {
  initializePayment,
  verifyPayment,
  handleWebhook,
};
