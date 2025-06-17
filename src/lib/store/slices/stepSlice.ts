// src/store/slices/stepSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StepState {
  current: number;
}

const initialState: StepState = {
  current: 0,
};

const stepSlice = createSlice({
  name: "step",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.current = action.payload;
    },
    nextStep: (state) => {
      state.current += 1;
    },
    prevStep: (state) => {
      if (state.current > 0) state.current -= 1;
    },
  },
});

export const { setStep, nextStep, prevStep } = stepSlice.actions;
export default stepSlice.reducer;
