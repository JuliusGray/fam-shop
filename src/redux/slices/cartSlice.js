import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const initialState = {
  cartItems: [],
  totalAmount: 0,
  totalQuantity: 0,
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

      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
      ).toFixed(2);
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

      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
      ).toFixed(2);
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

      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
      ).toFixed(2);
    },
  },
});

const persistedCartReducer = persistReducer(cartPersistConfig, cartSlice.reducer);

export const cartActions = cartSlice.actions;
export default persistedCartReducer;