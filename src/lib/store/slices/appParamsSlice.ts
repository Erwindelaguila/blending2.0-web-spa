import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IKeyValue {
  key: string;
  value: string;
}

export interface AppParamsState {
  params: Record<string, string>;
}

const initialState: AppParamsState = {
  params: {},
};

const appParamsSlice = createSlice({
  name: "appParams",
  initialState,
  reducers: {
    // Cargar parámetros desde array
    setAppParams: (state, action: PayloadAction<IKeyValue[]>) => {
      state.params = action.payload.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {} as Record<string, string>);
    },

    // Actualizar/agregar un solo parámetro
    updateAppParam: (state, action: PayloadAction<IKeyValue>) => {
      state.params[action.payload.key] = action.payload.value;
    },

    // Resetear todo
    resetAppParams: (state) => {
      state.params = {};
    },
  },
});

// ✅ Helper para obtener valor de un parámetro
export const getAppParamOrDefault = (
  state: { appParams: AppParamsState },
  key: string,
  defaultValue: string
): string => {
  return state.appParams.params[key] ?? defaultValue;
};

export const getAllAppParams = (state: { appParams: AppParamsState }) => {
  return state.appParams.params;
};

export const { setAppParams, updateAppParam, resetAppParams } =
  appParamsSlice.actions;

export default appParamsSlice.reducer;
