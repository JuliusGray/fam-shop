import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import persistedCartReducer from "./slices/cartSlice";

const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
  },
});

export const persistor = persistStore(store);
export default store;