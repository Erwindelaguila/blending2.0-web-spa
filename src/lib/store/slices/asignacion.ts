// src/store/slices/riaSlice.ts
import { clearData, getAllData, saveData } from "@/services/indexeddb.service";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const STORE_NAME = "Asignacion"; // Nombre en IndexedDB

// ---- Tipos ----
export interface DemandaFijos {
  pos: number;
  material: string;
  descripcion: string;
  cantidadAsignadaToneladas: number;
  umVta: string;
  cantidadAsignadaSacos: number;
  umAlmac: string;
  tolerancia: number;
}

export interface OfertaFijos {
  pos: number;
  descripcionMaterial: string;
  descripcionCentro: string;
  lote: string;
  cantidadAsignadaSacos: number;
  umAlmac: string;
  fechaCotizacion: string;
  fechaFabricacion: string;
  cantidadAsignadaToneladas: number;
  umVta: string;
  fechaAnalisisQuimico: string;
  fechaVencimientoQuimico: string;
  fechaAnalisisMicro: string;
  fechaVencimientoMicro: string;
  tipoAlmacen: string;
  ubicacionAlmacen: string;
}



export interface AsignacionData {
  demanda: {
    fijos: DemandaFijos;
    paramentrosCalidad: any;
  };
  oferta: {
    [lote: string]: {
      fijos: OfertaFijos;
      parametrosCalidad: any;
      otrosParamentros: any;
    };
  };
  contrato: string;
  pesoContenedores: string;
}

interface AsignacionState {
  data: AsignacionData | null;
  loading: boolean;
}

const initialState: AsignacionState = {
  data: null,
  loading: false,
};

// ---- Thunks ----
export const loadAsignacionData = createAsyncThunk("asignacion/load", async () => {
  const result = await getAllData(STORE_NAME);
  return result.length > 0 ? result[0] : null;
});

export const persistAsignacionData = createAsyncThunk(
  "asignacion/persist",
  async (asignacionData: AsignacionData) => {
    await clearData(STORE_NAME); // Para guardar solo el último
    await saveData(STORE_NAME, [asignacionData]);
    return asignacionData;
  }
);

export const clearAsignacionData = createAsyncThunk("asignacion/clear", async () => {
  await clearData(STORE_NAME);
  return null;
});

// ---- Slice ----
const asignacionSlice = createSlice({
  name: "asignacion",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadAsignacionData.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadAsignacionData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(persistAsignacionData.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(clearAsignacionData.fulfilled, (state) => {
        state.data = null;
      });
  },
});

export default asignacionSlice.reducer;
