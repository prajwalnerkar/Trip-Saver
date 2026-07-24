// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authSlice";
import shopReducer from "../slice/shopSlice"; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shop: shopReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;