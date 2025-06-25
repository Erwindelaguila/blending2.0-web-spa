// Estilos constantes
export const STYLES = {
  HEADER:
    "h-10 min-h-10 max-h-10 py-2 flex items-center justify-center text-xs font-bold text-white bg-[#8bc34a] border-b-2 border-[#8bc34a]",
  ADJUSTMENT:
    "h-10 min-h-10 max-h-10 py-1.5 px-1 bg-gray-50 flex items-center justify-center text-xs text-gray-600 font-semibold border-b-2 border-[#8bc34a]",
} as const

// Límites y configuraciones
export const LIMITS = {
  MIN_RUMAS: 2,
  MAX_DIVISION: 50,
  MIN_DIVISION: 1,
  CALIDAD_MAX_LENGTH: 8,
  PARAM_MAX_LENGTH: 6,
} as const

// Expresiones regulares
export const REGEX = {
  DECIMAL: /^\d*\.?\d$/,
  SIGNED_DECIMAL: /^-?\d*\.?\d$/,
} as const

// Datos iniciales
export const INITIAL_DATA = [
  {
    CALIDAD: "CALIDAD-01",
    P: "67.9",
    PARAM02: "480",
    PARAM03: "15.2",
    PARAM04: "456",
    PARAM05: "14.8",
    PARAM06: "456",
    PARAM07: "14.8",
    PARAM08: "456",
    CADMIO: "678",
    TOTAL: "3335",
  },
  {
    CALIDAD: "CALIDAD-02",
    P: "67.0",
    PARAM02: "456",
    PARAM03: "14.8",
    PARAM04: "456",
    PARAM05: "14.8",
    PARAM06: "456",
    PARAM07: "14.8",
    PARAM08: "456",
    CADMIO: "12",
    TOTAL: "1000",
  },
  {
    CALIDAD: "CALIDAD-03",
    P: "66.9",
    PARAM02: "234",
    PARAM03: "16.1",
    PARAM04: "456",
    PARAM05: "14.8",
    PARAM06: "456",
    PARAM07: "14.8",
    PARAM08: "456",
    CADMIO: "763",
    TOTAL: "8618",
  },
  {
    CALIDAD: "CALIDAD-04",
    P: "68.2",
    PARAM02: "512",
    PARAM03: "14.5",
    PARAM04: "456",
    PARAM05: "14.8",
    PARAM06: "456",
    PARAM07: "14.8",
    PARAM08: "456",
    CADMIO: "421",
    TOTAL: "2145",
  },
  {
    CALIDAD: "CALIDAD-05",
    P: "69.1",
    PARAM02: "398",
    PARAM03: "15.8",
    PARAM04: "456",
    PARAM05: "14.8",
    PARAM06: "456",
    PARAM07: "14.8",
    PARAM08: "456",
    CADMIO: "892",
    TOTAL: "4567",
  },
]
