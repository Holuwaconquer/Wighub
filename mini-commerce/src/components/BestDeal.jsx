import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "./ProductCard";
import { FaArrowLeft, FaArrowRight, FaFire } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../store/slices/productSlice";
import { getSaleProducts } from "../services/api";

const BestDeal = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const scrollContainerRef = useRef(null);
  const { products = [] } = useSelector((state) => state.products);
  const [saleProducts, setSaleProducts] = useState([]);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  useEffect(() => {
    dispatch(fetchProducts({ limit: 100 }));
    const loadSaleProducts = async () => {
      try {
        const response = await getSaleProducts();
        setSaleProducts(response || []);
      } catch (error) {
        console.error("Failed to load sale products:", error);
      }
    };

    loadSaleProducts();
  }, [dispatch]);
  useEffect(() => {
    if (!saleProducts.length) return;

    const updateCountdown = () => {
      const validDates = saleProducts
        .map((product) =>
          product.saleEndDate ? new Date(product.saleEndDate) : null,
        )
        .filter(Boolean);

      if (!validDates.length) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const nextEndDate = validDates.reduce((earliest, current) =>
        current < earliest ? current : earliest,
      );
      const diff = nextEndDate.getTime() - Date.now();

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, [saleProducts]);
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const saleBasedProducts = saleProducts.length ? saleProducts : products;
  const bestDealProducts = [...saleBasedProducts]
    .map((product) => ({
      ...product,
      discount:
        product.saleDiscountPercentage ??
        product.discountPercentage ??
        (product.originalPrice && product.price
          ? Math.round(
              ((product.originalPrice - product.price) /
                product.originalPrice) *
                100,
            )
          : 0),
    }))
    .sort((a, b) => (b.discount || 0) - (a.discount || 0))
    .slice(0, 8);

  return (
    <div className="w-full py-[50px] px-[20px] md:px-[7%] bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-red-500 p-3 rounded-full animate-pulse">
            <FaFire className="text-white text-2xl" />
          </div>
          <div>
            <h1
              className="text-3xl md:text-[48px] font-extrabold"
              style={{ color: "#8c6020" }}
            >
              BEST DEALS 🔥
            </h1>
            <p className="text-gray-500 mt-2">
              Limited time offers - Up to 50% OFF!
            </p>
          </div>
        </div>

        {/* Desktop Navigation Arrows */}
        <div className="hidden md:flex gap-3">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-[#b98800] hover:text-white hover:border-[#b98800] transition-all duration-300"
          >
            <FaArrowLeft />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-[#b98800] hover:text-white hover:border-[#b98800] transition-all duration-300"
          >
            <FaArrowRight />
          </button>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="bg-white rounded-2xl p-4 mb-8 max-w-md mx-auto shadow-lg">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">⏰ Sale Ends In:</span>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="bg-[#b98800] text-white rounded-lg px-3 py-1 font-bold text-2xl">
                {countdown.days}
              </div>
              <span className="text-xs text-gray-500">Days</span>
            </div>
            <div className="text-center">
              <div className="bg-[#b98800] text-white rounded-lg px-3 py-1 font-bold text-2xl">
                {countdown.hours}
              </div>
              <span className="text-xs text-gray-500">Hours</span>
            </div>
            <div className="text-center">
              <div className="bg-[#b98800] text-white rounded-lg px-3 py-1 font-bold text-2xl">
                {countdown.minutes}
              </div>
              <span className="text-xs text-gray-500">Mins</span>
            </div>
            <div className="text-center">
              <div className="bg-[#b98800] text-white rounded-lg px-3 py-1 font-bold text-2xl">
                {countdown.seconds}
              </div>
              <span className="text-xs text-gray-500">Secs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Container */}
      <div
        ref={scrollContainerRef}
        className="w-full flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {bestDealProducts.map((product) => (
          <div
            key={product.id}
            className="min-w-[280px] md:min-w-0 snap-center"
          >
            <ProductCard product={product} showDiscountBadge={true} />
          </div>
        ))}
      </div>

      {/* Mobile Navigation Dots */}
      <div className="flex md:hidden justify-center gap-2 mt-6">
        {bestDealProducts.map((_, index) => (
          <button
            key={index}
            className="w-2 h-2 rounded-full bg-gray-300 hover:bg-[#b98800] transition-colors"
            onClick={() => {
              if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTo({
                  left: index * 300,
                  behavior: "smooth",
                });
              }
            }}
          />
        ))}
      </div>

      {/* View All Button */}
      <div className="w-full flex justify-center mt-8">
        <button
          onClick={() => (window.location.href = "/shop?category=sale")}
          className="group relative px-8 py-3 border-2 rounded-full overflow-hidden hover:text-white! transition-all duration-300 hover:scale-105"
          style={{ borderColor: "#8c6020", color: "#8c6020" }}
        >
          <span className="relative z-10 font-medium">View All Deals</span>
          <span className="absolute inset-0 bg-gradient-to-r from-[#b98800] to-[#8a0fb3] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </button>
      </div>
    </div>
  );
};

export default BestDeal;
