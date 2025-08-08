// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import stepReducer from "./slices/stepSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    step: stepReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
