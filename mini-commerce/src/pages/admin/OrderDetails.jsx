import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import {
  FaArrowLeft,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaBox,
  FaMapMarkerAlt,
  FaCreditCard,
  FaTag,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaPrint,
  FaExclamationCircle,
  FaCheck,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { getOrderById, updateOrderStatus } from "../../services/api";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await getOrderById(id);
      setOrder(data);
    } catch (error) {
      console.error("Failed to load order:", error);
      navigate("/admin/orders");
    } finally {
      setLoading(false);
    }
  };

  const formatNaira = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPaymentMethod = (method) => {
    if (!method) return "Not specified";
    const paymentMethods = {
      kora_card: "Korapay - Credit/Debit Card",
      kora_bank: "Korapay - Bank Transfer",
      kora_pay_with_bank: "Korapay - Pay with Bank",
      kora_mobile_money: "Korapay - Mobile Money",
      card: "Credit/Debit Card",
      bank: "Bank Transfer",
      cod: "Cash on Delivery",
      cash: "Cash Payment",
    };
    return paymentMethods[method] || method;
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <FaCheckCircle />;
      case "pending":
        return <FaClock />;
      case "failed":
        return <FaExclamationCircle />;
      default:
        return <FaClock />;
    }
  };

  const confirmPaymentHandler = async () => {
    try {
      setConfirmingPayment(true);
      // This will call the backend endpoint to manually confirm payment
      // For now, just update payment status to completed
      await updateOrderStatus(id, "processing");
      // Update order locally
      setOrder({ ...order, isPaid: true, paymentStatus: "completed" });
      toast.success("Payment confirmed successfully");
    } catch (error) {
      console.error("Failed to confirm payment:", error);
      toast.error("Failed to confirm payment");
    } finally {
      setConfirmingPayment(false);
    }
  };

  const updateOrderStatusHandler = async (newStatus) => {
    try {
      setUpdating(true);
      await updateOrderStatus(id, newStatus);
      await loadOrder();
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-2 border-gray-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-amber-500 absolute top-0 left-0"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!order) return null;

  const timelineSteps = [
    { status: "pending", label: "Order Placed", icon: <FaClock /> },
    { status: "processing", label: "Processing", icon: <FaBox /> },
    { status: "shipped", label: "Shipped", icon: <FaTruck /> },
    { status: "delivered", label: "Delivered", icon: <FaCheckCircle /> },
  ];

  const currentStepIndex = timelineSteps.findIndex(
    (step) => step.status === order.status,
  );
  const progressWidth =
    currentStepIndex >= 0
      ? (currentStepIndex / (timelineSteps.length - 1)) * 100
      : 0;

  return (
    <AdminLayout>
      <div className="space-y-8 print:space-y-4">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <button
            onClick={() => navigate("/admin/orders")}
            className="flex items-center gap-2 text-gray-500 hover:text-amber-600 transition-colors group"
          >
            <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
            <span className="font-light">Back to Orders</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors print:hidden"
          >
            <FaPrint className="text-sm" />
            Print Order
          </button>
        </div>

        {/* Order Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <p className="text-amber-400 text-sm mb-1">ORDER DETAILS</p>
              <h1 className="text-2xl font-mono font-bold">
                #{order._id?.slice(-8)}
              </h1>
              <p className="text-gray-300 text-sm mt-2">
                Placed on {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-300">Total Amount</p>
              <p className="text-3xl font-bold text-amber-400">
                {formatNaira(order.totalPrice)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-semibold text-gray-900">
                  Order Items
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                {order.orderItems?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl shadow-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">
                          {item.name}
                        </h3>
                        <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                          <span>Qty: {item.quantity}</span>
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </div>
                        <p className="text-amber-600 font-bold mt-2">
                          {formatNaira(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Order Timeline
              </h2>
              <div className="relative">
                <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200 rounded-full"></div>
                <div
                  className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                  style={{ width: `${progressWidth}%` }}
                ></div>
                <div className="relative flex justify-between">
                  {timelineSteps.map((step, idx) => (
                    <div key={idx} className="text-center" style={{ flex: 1 }}>
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 transition-all duration-300 ${
                          idx <= currentStepIndex
                            ? "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        {step.icon}
                      </div>
                      <p
                        className={`text-xs font-medium ${idx <= currentStepIndex ? "text-gray-800" : "text-gray-400"}`}
                      >
                        {step.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-24">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-semibold text-gray-900">
                  Order Summary
                </h2>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {formatNaira(order.itemsPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {order.shippingPrice === 0
                      ? "Free"
                      : formatNaira(order.shippingPrice)}
                  </span>
                </div>
                {order.coupon && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span className="flex items-center gap-1">
                      <FaTag className="text-xs" />
                      Discount ({order.coupon.code})
                    </span>
                    <span>-{formatNaira(order.coupon.discount)}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-800">Total</span>
                    <span className="text-xl font-bold text-amber-600">
                      {formatNaira(order.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <FaUser className="text-amber-500" />
                  Customer Information
                </h2>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <FaUser className="text-gray-400 text-sm" />
                  <div>
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="text-sm font-medium text-gray-800">
                      {order.shippingAddress?.fullName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-gray-400 text-sm" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-800">
                      {order.user?.email || order.customer?.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-gray-400 text-sm" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-800">
                      {order.shippingAddress?.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-gray-400 text-sm" />
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm text-gray-800">
                      {order.shippingAddress?.address},{" "}
                      {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.state}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaCreditCard className="text-gray-400 text-sm" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Payment Method</p>
                    <p className="text-sm font-medium text-gray-800">
                      {formatPaymentMethod(order.paymentMethod)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <FaCreditCard className="text-amber-500" />
                  Payment Information
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Payment Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getPaymentStatusIcon(order.paymentStatus)}
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}
                      >
                        {order.paymentStatus || "pending"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Is Paid</p>
                    <p className="text-sm font-medium text-gray-800 mt-1">
                      {order.isPaid ? (
                        <span className="flex items-center gap-1 text-emerald-600">
                          <FaCheckCircle /> Yes
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-600">
                          <FaClock /> Pending
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {!order.isPaid && order.paymentStatus === "pending" && (
                  <button
                    onClick={confirmPaymentHandler}
                    disabled={confirmingPayment}
                    className="w-full mt-4 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
                  >
                    {confirmingPayment ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Confirming...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle /> Manually Confirm Payment
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Update Status */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-semibold text-gray-900">
                  Update Status
                </h2>
              </div>
              <div className="p-6">
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatusHandler(e.target.value)}
                  disabled={updating}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 bg-gray-50 mb-3"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                {updating && (
                  <div className="flex items-center gap-2 text-sm text-amber-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-600 border-t-transparent"></div>
                    Updating status...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderDetails;
