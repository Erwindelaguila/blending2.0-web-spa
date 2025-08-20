import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { clearData, getAllData, saveData } from "@/services/indexeddb.service";

const STORE_NAME = "StockDisponible";

export interface StockDisponibleItem {
  fijos: Fijos;
  parametrosCalidad: any;
  otrosValores: any;
}

interface StockDisponibleState {
  data: StockDisponibleItem[];
  loading: boolean;
}

const initialState: StockDisponibleState = {
  data: [],
  loading: false,
};

// Leer desde IndexedDB
export const loadStockDisponible = createAsyncThunk(
  "stock-disponible/loadFromIndexedDB",
  async () => {
    const result = await getAllData(STORE_NAME);
    return result; // <-- ya no recortes con [0]
  }
);

// Guardar en IndexedDB
export const persistStockDisponible = createAsyncThunk(
  "stock-disponible/saveToIndexedDB",
  async (stockDisponibleItem: StockDisponibleItem[]) => {
    await clearData(STORE_NAME); // Limpia antes de guardar
    await saveData(STORE_NAME, stockDisponibleItem);
    return stockDisponibleItem; // Retorna el mismo item para actualizar el estado
  }
);

export const clearStockDisponibleFromDB = createAsyncThunk(
  "stock-disponible/clearIndexedDB",
  async () => {
    await clearData(STORE_NAME);
    return [];
  }
);

const stockDisponibleSlice = createSlice({
  name: "stock-disponible",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadStockDisponible.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadStockDisponible.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(persistStockDisponible.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(clearStockDisponibleFromDB.fulfilled, (state) => {
        state.data = [];
      });
  },
});

export default stockDisponibleSlice.reducer;

export interface Fijos {
  rumaNro: string;
  planta: string;
  anio: string;
  serie: string;
  fechaCorte: string;
  cantidad: number;
  um: string;
  codigo: string;
  descripcionMaterial: string;
  centroUbicacion: string;
  almacenUbicacion: string;
  tipoProduccion: string;
  centroProduccion: string;
  calidadPlanta: string;
  cierreVta: string;
  posicion: number;
  material: string;
  cantPreAsignado: number;
  cantTransito: number;
  cantLote: number;
  loteExp: string;
  ubicacionEnAlmacen: string;
  fechaContabilizacion: string;
  fechaFabricacion: string;
  certificadora: string;
  fAnalFcoQco: string;
  fAnalMicobiol: string;
  fvAnalFcoQco: string;
  fvAnalMocobiol: string;
}
