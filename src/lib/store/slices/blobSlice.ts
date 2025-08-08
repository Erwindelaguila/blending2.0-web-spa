// src/store/slices/blobSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BlobState {
  downloadUrl: string;
  fileName: string;
  expiresAtUtc: string;
}

export const initialState: BlobState = {
  downloadUrl: "",
  fileName: "",
  expiresAtUtc: "",
};

const blobSlice = createSlice({
  name: "blob",
  initialState,
  reducers: {
    setBlobData: (
      state,
      action: PayloadAction<{
        downloadUrl: string;
        fileName: string;
        expiresAtUtc: string;
      }>
    ) => {
      state.downloadUrl = action.payload.downloadUrl;
      state.fileName = action.payload.fileName;
      state.expiresAtUtc = action.payload.expiresAtUtc;
    },
    resetBlobData: (state) => {
      state.downloadUrl = "";
      state.fileName = "";
      state.expiresAtUtc = "";
    },
  },
});

export const { setBlobData, resetBlobData } = blobSlice.actions;
export default blobSlice.reducer;
