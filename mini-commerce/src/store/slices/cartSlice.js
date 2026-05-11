import { createSlice } from '@reduxjs/toolkit';

const calculateTotals = (items) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return { totalItems, totalPrice };
};

const CART_STORAGE_KEY = 'minka_cart';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    error: null,
  },
  reducers: {
    // Add item to cart or increase quantity if exists
    addToCart: (state, action) => {
      const { productId, quantity = 1, price, name, image } = action.payload;
      
      const existingItem = state.items.find(item => item.productId === productId);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          productId,
          quantity,
          price,
          name,
          image
        });
      }
      
      const { totalItems, totalPrice } = calculateTotals(state.items);
      state.totalItems = totalItems;
      state.totalPrice = totalPrice;
      state.error = null;
      
      // Persist to localStorage
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    },

    // Update item quantity
    updateCartItem: (state, action) => {
      const { productId, quantity } = action.payload;
      
      const item = state.items.find(item => item.productId === productId);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.productId !== productId);
        } else {
          item.quantity = quantity;
        }
      }
      
      const { totalItems, totalPrice } = calculateTotals(state.items);
      state.totalItems = totalItems;
      state.totalPrice = totalPrice;
      
      // Persist to localStorage
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    },

    // Remove item from cart
    removeFromCart: (state, action) => {
      const { productId } = action.payload;
      state.items = state.items.filter(item => item.productId !== productId);
      
      const { totalItems, totalPrice } = calculateTotals(state.items);
      state.totalItems = totalItems;
      state.totalPrice = totalPrice;
      
      // Persist to localStorage
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    },

    // Clear entire cart
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      state.error = null;
      
      // Remove from localStorage
      localStorage.removeItem(CART_STORAGE_KEY);
    },

    clearError: (state) => {
      state.error = null;
    },

    // Load cart from localStorage
    loadCart: (state, action) => {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          state.items = parsed.items || [];
          const totals = calculateTotals(state.items);
          state.totalItems = totals.totalItems;
          state.totalPrice = totals.totalPrice;
        } catch (error) {
          console.error('Failed to load cart from localStorage:', error);
        }
      }
    },
  },
});

export const { addToCart, updateCartItem, removeFromCart, clearCart, clearError, loadCart } = cartSlice.actions;
export default cartSlice.reducer;