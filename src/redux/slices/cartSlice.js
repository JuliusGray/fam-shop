import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initialState = {
  cartItems: [],
  totalAmount: 0,
  totalQuantity: 0,
  discount: 0,
  shippingCost: 0,
  subtotalAmount: 0,
  totalOrderAmount: 0,
};

const cartPersistConfig = {
  key: "cart",
  storage,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.id === newItem.id
      );
      state.totalQuantity++;

      if (state.cartItems.length === 0 || !existingItem) {
        state.cartItems.push({
          id: newItem.id,
          productName: newItem.productName,
          imgUrl: newItem.imgUrl,
          price: parseFloat(newItem.price).toFixed(2),
          quantity: 1,
          totalPrice: parseFloat(newItem.price).toFixed(2),
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice = (
          Number(existingItem.totalPrice) + Number(newItem.price)
        ).toFixed(2);
      }

      state.totalAmount = calculateTotalAmount(state.cartItems).toFixed(2);
      applyDiscountAndShippingCost(state);
    },
    deleteItem: (state, action) => {
      const id = action.payload;
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.id === id
      );
      if (existingItemIndex !== -1) {
        const existingItem = state.cartItems[existingItemIndex];
        state.cartItems.splice(existingItemIndex, 1);
        state.totalQuantity -= existingItem.quantity;
      }

      state.totalAmount = calculateTotalAmount(state.cartItems).toFixed(2);
      applyDiscountAndShippingCost(state);
    },
    delItem: (state, action) => {
      const id = action.payload;
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.id === id
      );
      if (existingItemIndex !== -1) {
        const existingItem = state.cartItems[existingItemIndex];
        existingItem.quantity--;
        state.totalQuantity--;
        if (existingItem.quantity === 0) {
          state.cartItems.splice(existingItemIndex, 1);
        }
      }

      state.totalAmount = calculateTotalAmount(state.cartItems).toFixed(2);
      applyDiscountAndShippingCost(state);
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;
      state.discount = 0;
      state.shippingCost = 0;
      state.subtotalAmount = 0;
      state.totalOrderAmount = 0;
    },
  },
});

const calculateTotalAmount = (cartItems) => {
  const totalAmount = cartItems.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0
  );

  return totalAmount;
};

const applyDiscountAndShippingCost = (state) => {
  const { totalAmount } = state;
  const discountPer500 = 5; // 5% скидка за каждые 500
  const shippingCostPer500 = 5; // 5 рублей скидка за каждые 500
  const shippingCostBase = 50; // Базовая стоимость доставки

  if (totalAmount >= 500) {
    let discount = Math.floor(totalAmount / 500) * discountPer500;
    discount = Math.min(discount, 25); // Ограничение скидки до максимального значения 25
    state.discount = discount;
    state.subtotalAmount = parseFloat(
      totalAmount - (totalAmount * discount) / 100
    ).toFixed(2);
  } else {
    state.discount = 0;
    state.subtotalAmount = parseFloat(totalAmount).toFixed(2);
  }

  const shippingCostDiscount =
    Math.floor(totalAmount / 500) * shippingCostPer500;
  state.shippingCost = Math.max(shippingCostBase - shippingCostDiscount, 0);

  state.totalOrderAmount = parseFloat(
    (parseFloat(state.subtotalAmount) + parseFloat(state.shippingCost)).toFixed(
      2
    )
  );
};

const persistedCartReducer = persistReducer(
  cartPersistConfig,
  cartSlice.reducer
);

export const cartActions = cartSlice.actions;
export default persistedCartReducer;
