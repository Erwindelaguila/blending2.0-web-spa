// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import stepReducer from "./slices/stepSlice";

export const store = configureStore({
  reducer: {
    step: stepReducer,
  },
  //devTools: process.env.NODE_ENV !== "production", // útil en prod
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
