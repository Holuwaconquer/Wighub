import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getOrderById, verifyPayment } from "../services/api";
import { clearCart } from "../store/slices/cartSlice";
import {
  FaCheckCircle,
  FaTruck,
  FaBox,
  FaClock,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUser,
  FaReceipt,
  FaPrint,
  FaShare,
  FaArrowLeft,
} from "react-icons/fa";
import { BsShieldCheck, BsGift } from "react-icons/bs";

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [verificationError, setVerificationError] = useState(null);

  useEffect(() => {
    const verifyAndFetchOrder = async () => {
      try {
        // Check if this is a redirect from Kora payment
        const searchParams = new URLSearchParams(location.search);
        const paymentRef = searchParams.get("payment_ref");

        // If there's a payment reference, verify the payment first
        if (paymentRef) {
          try {
            await verifyPayment(orderId);
            setPaymentVerified(true);
            toast.success("Payment verified successfully!");
            // Clear cart after successful payment verification
            dispatch(clearCart());
            localStorage.removeItem("minka_cart");
            localStorage.removeItem("pending_order_id");
          } catch (error) {
            setVerificationError(error?.message || "Failed to verify payment");
            toast.error("Payment verification failed. Please contact support.");
            console.error("Payment verification error:", error);
          }
        }

        // Fetch order details
        const response = await getOrderById(orderId);
        setOrder(response);
      } catch (error) {
        const orders = JSON.parse(localStorage.getItem("orders") || "[]");
        const foundOrder = orders.find(
          (o) => o._id === orderId || o.id === parseInt(orderId),
        );
        setOrder(foundOrder);
      } finally {
        setLoading(false);
      }
    };

    verifyAndFetchOrder();
  }, [orderId, location.search, dispatch]);

  const formatNaira = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-NG", options);
  };

  const getPaymentMethodLabel = (method) => {
    if (!method) return "Card";
    if (method === "cod" || method === "cash") return "Cash on Delivery";
    if (method === "bank") return "Bank Transfer";
    if (method === "card" || method === "kora_card")
      return "Credit / Debit Card";
    if (method === "kora_bank") return "Bank Transfer";
    if (method === "kora_pay_with_bank") return "Pay with Bank";
    if (method === "kora_mobile_money" || method === "mobile_money")
      return "Mobile Money";
    return method.replace(/kora_/g, "").replace(/_/g, " ");
  };

  const getPaymentStatus = () => {
    if (!order) return null;
    if (order.isPaid)
      return { status: "completed", label: "Completed", color: "green" };
    if (
      order.paymentStatus === "completed" ||
      order.paymentStatus === "success"
    )
      return { status: "completed", label: "Completed", color: "green" };
    if (order.paymentStatus === "pending")
      return { status: "pending", label: "Pending", color: "yellow" };
    if (order.paymentStatus === "failed")
      return { status: "failed", label: "Failed", color: "red" };
    return { status: "unknown", label: "Unknown", color: "gray" };
  };

  const orderItems = order?.orderItems || order?.items || [];
  const shippingAddress = order?.shippingAddress || order?.customer || {};
  const customerEmail =
    order?.user?.email || shippingAddress.email || order?.customer?.email || "";
  const orderDate = order?.createdAt || order?.date || new Date().toISOString();
  const orderIdDisplay = order?.orderId || order?._id || order?.id;
  const orderSubtotal = order?.itemsPrice ?? order?.subtotal ?? 0;
  const orderShipping = order?.shippingPrice ?? order?.shipping ?? 0;
  const orderTotal = order?.totalPrice ?? order?.total ?? 0;
  const orderNotes =
    shippingAddress.orderNotes || order?.customer?.orderNotes || "";
  const paymentMethod =
    order?.paymentMethod ||
    shippingAddress.paymentMethod ||
    order?.customer?.paymentMethod ||
    "card";
  const paymentMethodLabel = getPaymentMethodLabel(paymentMethod);
  const paymentStatus = getPaymentStatus();

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    // Implement share functionality
    toast.info("Share functionality coming soon!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative items-center text-center justify-center justify-self-center">
            <div className="animate-spin rounded-full h-16 w-16 border-2 border-gray-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-amber-500 absolute top-0 left-0"></div>
          </div>
          <p className="mt-4 text-gray-500 font-light">
            Loading your order details...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FaBox className="text-4xl text-gray-400" />
          </div>
          <h2 className="text-2xl font-light text-gray-800 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-500 mb-8">
            We couldn't find the order you're looking for.
          </p>
          <Link to="/shop">
            <button className="px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-300">
              Return to Shop
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-5 md:pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-6 group"
        >
          <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-light">Back</span>
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-6 animate-fadeIn">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-8 py-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6 shadow-lg">
              <FaCheckCircle className="text-4xl text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-2">
              Thank You for Your Order!
            </h1>
            <p className="text-gray-600 mb-3 font-light">
              Your order has been confirmed and will be processed shortly
            </p>
            <div className="inline-block bg-white px-4 py-2 rounded-full shadow-sm">
              <p className="text-sm font-mono text-gray-600">
                Order #{orderIdDisplay}
              </p>
            </div>
          </div>

          {/* Order Status Timeline */}
          <div className="px-8 py-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div className="text-center flex-1 ">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <FaCheckCircle className="text-white text-sm" />
                </div>
                <p className="text-xs font-medium text-green-600">
                  Order Placed
                </p>
              </div>
              <div className="flex-1 h-px bg-gray-200"></div>
              <div className="text-center flex-1">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                  <FaBox className="text-gray-500 text-sm" />
                </div>
                <p className="text-xs font-medium text-gray-500">Processing</p>
              </div>
              <div className="flex-1 h-px bg-gray-200"></div>
              <div className="text-center flex-1">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                  <FaTruck className="text-gray-500 text-sm" />
                </div>
                <p className="text-xs font-medium text-gray-500">Shipped</p>
              </div>
              <div className="flex-1 h-px bg-gray-200"></div>
              <div className="text-center flex-1">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                  <BsGift className="text-gray-500 text-sm" />
                </div>
                <p className="text-xs font-medium text-gray-500">Delivered</p>
              </div>
            </div>
              <p className="text-xs text-gray-500 mt-1">
                {formatDate(orderDate)}
              </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Order Summary
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrint}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Print Order"
                    >
                      <FaPrint className="text-gray-500" />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Share Order"
                    >
                      <FaShare className="text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {orderItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl shadow-md"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Quantity: {item.quantity}
                        </p>
                        {item.size && (
                          <p className="text-xs text-gray-400">
                            Size: {item.size}
                          </p>
                        )}
                        {item.color && (
                          <p className="text-xs text-gray-400">
                            Color: {item.color}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatNaira(item.price * item.quantity)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatNaira(item.price)} each
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      {formatNaira(orderSubtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-gray-900">
                      {orderShipping === 0
                        ? "Free"
                        : formatNaira(orderShipping)}
                    </span>
                  </div>
                  {order.coupon?.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({order.coupon.code})</span>
                      <span>-{formatNaira(order.coupon.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <span className="text-lg font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatNaira(orderTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Notes if any */}
            {orderNotes && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Order Notes
                  </h2>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 italic">"{orderNotes}"</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-semibold text-gray-900">
                  Shipping Information
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <FaUser className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-800">
                      {shippingAddress.fullName ||
                        order?.user?.name ||
                        "Customer"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaEnvelope className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium text-gray-800">
                      {customerEmail || "Not provided"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaPhone className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium text-gray-800">
                      {shippingAddress.phone || "Not provided"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Shipping Address</p>
                    <p className="font-medium text-gray-800">
                      {shippingAddress.address}
                      <br />
                      {shippingAddress.apartment && (
                        <>
                          {shippingAddress.apartment}
                          <br />
                        </>
                      )}
                      {shippingAddress.city}, {shippingAddress.state}{" "}
                      {shippingAddress.zipCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-semibold text-gray-900">
                  Payment Method
                </h2>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <FaReceipt className="text-gray-400 text-xl" />
                  <div>
                    <p className="font-medium text-gray-800 capitalize">
                      {paymentMethodLabel}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(paymentMethod === "card" ||
                        paymentMethod === "kora_card") &&
                        "You will be charged via credit/debit card"}
                      {(paymentMethod === "bank" ||
                        paymentMethod === "kora_bank") &&
                        "Bank transfer"}
                      {(paymentMethod === "cash" || paymentMethod === "cod") &&
                        "Pay when you receive your order"}
                      {paymentMethod === "kora_pay_with_bank" &&
                        "Pay using your bank account"}
                      {paymentMethod === "kora_mobile_money" &&
                        "Pay using your mobile money provider"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            {paymentStatus && (
              <div
                className={`rounded-2xl shadow-xl border overflow-hidden ${
                  paymentStatus.color === "green"
                    ? "bg-green-50 border-green-100"
                    : paymentStatus.color === "yellow"
                      ? "bg-yellow-50 border-yellow-100"
                      : "bg-red-50 border-red-100"
                }`}
              >
                <div
                  className={`px-6 py-5 border-b bg-gradient-to-r ${
                    paymentStatus.color === "green"
                      ? "from-green-50 to-white border-green-100"
                      : paymentStatus.color === "yellow"
                        ? "from-yellow-50 to-white border-yellow-100"
                        : "from-red-50 to-white border-red-100"
                  }`}
                >
                  <h2 className="text-xl font-semibold text-gray-900">
                    Payment Status
                  </h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    {paymentStatus.status === "completed" && (
                      <FaCheckCircle className="text-green-500 text-2xl" />
                    )}
                    {paymentStatus.status === "pending" && (
                      <FaClock className="text-yellow-500 text-2xl" />
                    )}
                    {paymentStatus.status === "failed" && (
                      <FaBox className="text-red-500 text-2xl" />
                    )}
                    <div>
                      <p
                        className={`font-medium capitalize ${
                          paymentStatus.color === "green"
                            ? "text-green-900"
                            : paymentStatus.color === "yellow"
                              ? "text-yellow-900"
                              : "text-red-900"
                        }`}
                      >
                        {paymentStatus.label}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          paymentStatus.color === "green"
                            ? "text-green-600"
                            : paymentStatus.color === "yellow"
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {paymentStatus.status === "completed" &&
                          "Your payment has been successfully processed"}
                        {paymentStatus.status === "pending" &&
                          "Your payment is being verified. This may take a few moments."}
                        {paymentStatus.status === "failed" &&
                          "Your payment could not be processed. Please contact support."}
                      </p>
                      {verificationError && (
                        <p className="text-xs text-red-600 mt-2 font-medium">
                          {verificationError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Shipping Location */}
            {order.shippingLocation && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Shipping Method
                  </h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <FaTruck className="text-gray-400 text-xl" />
                    <div>
                      <p className="font-medium text-gray-800">
                        {order.shippingLocation.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Delivery fee:{" "}
                        {order.shippingLocation.fee === 0
                          ? "Free"
                          : formatNaira(order.shippingLocation.fee)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Help Section */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-xl border border-amber-100 overflow-hidden">
              <div className="p-6 text-center">
                <BsShieldCheck className="text-3xl text-amber-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Have questions about your order? Our customer service team is
                  here to help.
                </p>
                <Link to="/contact">
                  <button className="w-full py-2 bg-white text-amber-600 rounded-xl hover:bg-amber-50 transition-colors border border-amber-200 font-medium">
                    Contact Support
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/shop">
            <button className="px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg font-medium">
              Continue Shopping
            </button>
          </Link>
          <Link to="/user/orders">
            <button className="px-8 py-3 bg-white text-gray-800 rounded-full hover:bg-gray-50 transition-all duration-300 border border-gray-300 font-medium">
              Track Order
            </button>
          </Link>
        </div>

        {/* Email Confirmation Notice */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            A confirmation email has been sent to{" "}
            <span className="font-medium text-gray-700">
              {customerEmail || "your email"}
            </span>
          </p>
          <p className="text-xs text-gray-400 mt-2 flex items-center justify-center gap-2">
            <FaClock className="text-xs" />
            Order placed on {formatDate(orderDate)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
