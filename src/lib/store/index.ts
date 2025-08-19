// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import stepReducer from "./slices/stepSlice";
import stockDisponibleReducer from "./slices/stockDisponible";
import asignacionReducer from "./slices/asignacion";
import authReducer from "./slices/authSlice";
import { loadState, saveState } from "@/utils/persist-state";
import blobReducer, { BlobState, initialState } from "./slices/blobSlice";

// cargar estado persistido del blob
const persistedBlobState = loadState<BlobState>("blobState") ?? initialState;

export const store = configureStore({
  reducer: {
    step: stepReducer,
    stockDisponible: stockDisponibleReducer,
    blob: blobReducer,
    auth: authReducer,
    asignacion: asignacionReducer,
  },
  preloadedState: {
    blob: persistedBlobState,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

store.subscribe(() => {
  const state = store.getState();
  saveState("blobState", state.blob);
});
