import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getShippingLocations,
  validateCoupon,
  createOrder,
  getAddresses,
  initializePayment,
} from "../services/api";
import { clearCart } from "../store/slices/cartSlice";
import {
  FaLock,
  FaArrowLeft,
  FaCreditCard,
  FaUniversity,
  FaMoneyBillWave,
  FaTag,
  FaTrash,
  FaShieldAlt,
  FaTruck,
  FaBox,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { BsShieldCheck, BsCreditCard2Front } from "react-icons/bs";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduxCartItems = useSelector((state) => state.cart.items);
  const [cartItems, setCartItems] = useState([]);
  const [shippingLocations, setShippingLocations] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    saveInfo: false,
    paymentMethod: "card",
    orderNotes: "",
  });

  useEffect(() => {
    const storageCart = JSON.parse(
      localStorage.getItem("minka_cart") || "null",
    );
    const savedItems =
      reduxCartItems.length > 0 ? reduxCartItems : storageCart?.items || [];

    if (savedItems.length === 0 && !isProcessing) {
      navigate("/shop");
      return;
    }

    setCartItems(savedItems);
  }, [navigate, reduxCartItems, isProcessing]);

  useEffect(() => {
    const fetchShippingLocations = async () => {
      try {
        const locations = await getShippingLocations();
        setShippingLocations(locations);
        if (locations.length > 0) {
          setSelectedLocationId(locations[0]._id);
        }
      } catch (error) {
        console.error("Failed to load shipping locations:", error);
      }
    };

    const fetchSavedAddress = async () => {
      try {
        const addresses = await getAddresses();
        if (addresses.length > 0) {
          const defaultAddress =
            addresses.find((addr) => addr.isDefault) || addresses[0];
          const nameParts = defaultAddress.fullName.split(" ");
          setFormData((prev) => ({
            ...prev,
            email:
              JSON.parse(localStorage.getItem("user") || "null")?.email ||
              prev.email,
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || prev.lastName,
            address: defaultAddress.address,
            city: defaultAddress.city,
            state: defaultAddress.state,
            zipCode: defaultAddress.zipCode,
            phone: defaultAddress.phone,
          }));
        } else {
          const userData = JSON.parse(localStorage.getItem("user") || "null");
          if (userData) {
            const nameParts = userData.name?.split(" ") || [];
            setFormData((prev) => ({
              ...prev,
              email: userData.email || prev.email,
              firstName: nameParts[0] || prev.firstName,
              lastName: nameParts.slice(1).join(" ") || prev.lastName,
            }));
          }
        }
      } catch (error) {
        console.error("Failed to load saved address:", error);
      }
    };

    fetchShippingLocations();
    fetchSavedAddress();
  }, []);

  const formatNaira = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const selectedLocation = shippingLocations.find(
    (location) => location._id === selectedLocationId,
  );
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = selectedLocation?.fee ?? 0;
  const totalBeforeCoupon = subtotal + shipping;
  const couponDiscount = coupon?.discount || 0;
  const finalTotal = Math.max(totalBeforeCoupon - couponDiscount, 0);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponMessage("Please enter a coupon code.");
      return;
    }

    setIsApplyingCoupon(true);
    setCouponMessage("");

    try {
      const result = await validateCoupon(
        couponCode.trim().toUpperCase(),
        totalBeforeCoupon,
      );
      setCoupon(result);
      setCouponMessage(
        `✨ ${result.code} applied! You saved ${formatNaira(result.discount)}`,
      );
    } catch (error) {
      const message = error?.message || error || "Invalid coupon code";
      setCoupon(null);
      setCouponMessage(message);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCoupon(null);
    setCouponCode("");
    setCouponMessage("Coupon removed");
  };

  const handleSubmitOrder = async () => {
    setOrderError("");
    setIsProcessing(true);

    const selectedLocation = shippingLocations.find(
      (location) => location._id === selectedLocationId,
    );
    const orderData = {
      orderItems: cartItems.map((item) => ({
        product: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        size: item.size || null,
        color: item.color || null,
      })),
      shippingAddress: {
        fullName: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      },
      shippingLocation: selectedLocation
        ? {
            name: selectedLocation.name,
            fee: selectedLocation.fee,
          }
        : null,
      paymentMethod: `kora_${formData.paymentMethod}`,
      itemsPrice: subtotal,
      shippingPrice: shipping,
      totalPrice: finalTotal,
      couponCode: coupon?.code || null,
    };

    try {
      // Initialize Kora payment (order will be created in backend)
      const paymentInit = await initializePayment(
        orderData,
        finalTotal,
        formData.email,
        `${formData.firstName} ${formData.lastName}`,
        ["card", "bank_transfer", "pay_with_bank"],
        "card",
      );

      // Redirect to Kora checkout URL
      if (paymentInit.data && paymentInit.data.checkout_url) {
        // Store order data temporarily for reference after payment
        localStorage.setItem("pending_checkout", JSON.stringify(orderData));
        // Redirect to Kora
        window.location.href = paymentInit.data.checkout_url;
        return;
      } else {
        throw new Error("Failed to get checkout URL from payment provider");
      }
    } catch (error) {
      if (
        error?.message ==
        "It seems there`s an issue with your input. Please correct it and try again."
      ) {
        setOrderError(
          "Minimum amount to checkout is ₦1,000,000 (1 Million Naira).",
        );
      } else {
        setOrderError(
          error?.message ||
            error ||
            "Failed to process payment. Please try again.",
        );
      }
      setIsProcessing(false);
    }
  };

  const isFormValid =
    formData.email &&
    formData.firstName &&
    formData.address &&
    formData.city &&
    formData.phone &&
    selectedLocationId;

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-6 group"
          >
            <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-light">Back to Cart</span>
          </button>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900">
            Checkout
          </h1>
          <p className="text-gray-500 mt-2 font-light">
            Complete your order with confidence
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Details Section - Customer Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Shipping Details
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Who are we delivering to?
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaEnvelope className="inline mr-2 text-gray-400" />
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaUser className="inline mr-2 text-gray-400" />
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaMapMarkerAlt className="inline mr-2 text-gray-400" />
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                      placeholder="House number and street name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apartment, suite, etc. (optional)
                    </label>
                    <input
                      type="text"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                      placeholder="Apt, Suite, Unit, etc."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                        placeholder="Lagos"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                        placeholder="Lagos"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                        placeholder="100001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaPhone className="inline mr-2 text-gray-400" />
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
                        placeholder="+234 XXX XXX XXXX"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      name="saveInfo"
                      checked={formData.saveInfo}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-400"
                    />
                    <label className="text-sm text-gray-700">
                      Save this information for future orders
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Method Section - Delivery Options */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Shipping Method
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Choose your preferred delivery option
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {shippingLocations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FaTruck className="text-4xl mx-auto mb-3 text-gray-300" />
                      <p>No shipping methods available</p>
                    </div>
                  ) : (
                    shippingLocations.map((location) => (
                      <label
                        key={location._id}
                        className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          selectedLocationId === location._id
                            ? "border-amber-400 bg-amber-50"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <input
                            type="radio"
                            name="shippingMethod"
                            value={location._id}
                            checked={selectedLocationId === location._id}
                            onChange={() => setSelectedLocationId(location._id)}
                            className="w-4 h-4 text-amber-500 focus:ring-amber-400"
                          />
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                selectedLocationId === location._id
                                  ? "bg-amber-100"
                                  : "bg-gray-100"
                              }`}
                            >
                              <FaTruck
                                className={`text-lg ${
                                  selectedLocationId === location._id
                                    ? "text-amber-600"
                                    : "text-gray-500"
                                }`}
                              />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {location.name}
                              </p>
                              {location.estimatedDays && (
                                <p className="text-xs text-gray-500">
                                  🚚 Estimated {location.estimatedDays} days
                                </p>
                              )}
                              {location.description && (
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {location.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-bold ${
                              location.fee === 0
                                ? "text-green-600"
                                : "text-gray-900"
                            }`}
                          >
                            {location.fee === 0
                              ? "Free"
                              : formatNaira(location.fee)}
                          </p>
                          {location.fee > 0 && (
                            <p className="text-xs text-gray-400">
                              delivery fee
                            </p>
                          )}
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Order Notes */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Order Notes (Optional)
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Special instructions for delivery
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <textarea
                  name="orderNotes"
                  value={formData.orderNotes}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all resize-none"
                  placeholder="Add any special delivery notes or instructions..."
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    4
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Payment Method
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Choose how you'd like to pay
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <label
                    className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.paymentMethod === "card"
                        ? "border-amber-400 bg-amber-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === "card"}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-amber-500 focus:ring-amber-400"
                    />
                    <BsCreditCard2Front className="text-2xl text-gray-600" />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">
                        Credit / Debit Card
                      </span>
                      <p className="text-sm text-gray-500">
                        Pay securely with your card
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/196/196539.png"
                        alt="Visa"
                        className="h-6"
                      />
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/196/196561.png"
                        alt="Mastercard"
                        className="h-6"
                      />
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.paymentMethod === "bank"
                        ? "border-amber-400 bg-amber-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={formData.paymentMethod === "bank"}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-amber-500 focus:ring-amber-400"
                    />
                    <FaUniversity className="text-2xl text-gray-600" />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">
                        Bank Transfer
                      </span>
                      <p className="text-sm text-gray-500">
                        Direct bank transfer
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500 py-4">
              <FaLock className="text-green-500" />
              <span>Your payment information is secure</span>
              <span>•</span>
              <FaShieldAlt className="text-green-500" />
              <span>256-bit SSL encryption</span>
            </div>
          </div>
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Order Summary
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {cartItems.length}{" "}
                    {cartItems.length === 1 ? "item" : "items"}
                  </p>
                </div>

                {/* Cart Items */}
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                  {cartItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 flex gap-3 hover:bg-gray-50 transition-colors"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-xl"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-sm line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {formatNaira(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Selected Shipping Method Display */}
                {selectedLocation && (
                  <div className="p-4 bg-amber-50 border-b border-amber-100">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <FaTruck className="text-amber-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Shipping:
                        </span>
                        <span className="text-sm text-gray-600">
                          {selectedLocation.name}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-amber-600">
                        {selectedLocation.fee === 0
                          ? "Free"
                          : formatNaira(selectedLocation.fee)}
                      </span>
                    </div>
                    {selectedLocation.estimatedDays && (
                      <p className="text-xs text-gray-500 mt-1 ml-7">
                        Est. delivery: {selectedLocation.estimatedDays} days
                      </p>
                    )}
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="p-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">
                      {formatNaira(subtotal)}
                    </span>
                  </div>
                  {coupon && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span className="flex items-center gap-1">
                        <FaTag className="text-xs" />
                        Discount ({coupon.code})
                      </span>
                      <span>-{formatNaira(couponDiscount)}</span>
                    </div>
                  )}
                </div>
                {/* Total */}
                <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 font-medium">Total</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatNaira(finalTotal)}
                      </span>
                      {coupon && (
                        <p className="text-xs text-green-600 mt-1">
                          Saved {formatNaira(couponDiscount)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {/* Coupon Code */}
                <div className="p-6 border-t border-gray-100">
                  {!coupon ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Have a coupon code?
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) =>
                            setCouponCode(e.target.value.toUpperCase())
                          }
                          placeholder="Enter code"
                          className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all text-sm"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={isApplyingCoupon}
                          className="px-5 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 text-sm font-medium"
                        >
                          {isApplyingCoupon ? "..." : "Apply"}
                        </button>
                      </div>
                      {couponMessage && (
                        <div className="mt-3 text-sm text-red-600 bg-red-50 rounded-xl p-3">
                          {couponMessage}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <FaTag className="text-green-600 mb-1" />
                          <p className="text-sm font-medium text-green-800">
                            {coupon.code} applied!
                          </p>
                          <p className="text-xs text-green-600 mt-1">
                            {couponMessage}
                          </p>
                        </div>
                        <button
                          onClick={handleRemoveCoupon}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {/* Place Order Button */}
                <div className="p-6 border-t border-gray-100">
                  {orderError && (
                    <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                      {orderError}
                    </div>
                  )}
                  <button
                    onClick={handleSubmitOrder}
                    disabled={!isFormValid || isProcessing}
                    className="w-full py-4 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      `Place Order • ${formatNaira(finalTotal)}`
                    )}
                  </button>
                  {/* Trust Badges */}
                  <div className="mt-4 flex justify-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <FaShieldAlt className="text-green-500" />
                      Secure Checkout
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FaBox className="text-blue-500" />
                      Free Returns
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <BsShieldCheck className="text-amber-500" />
                      Authentic Products
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
