"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { mutate } from 'swr';

export interface ValoresCalidadFilters {
  codigoCalidad?: string;
}

interface ValoresCalidadContextType {
  filters: ValoresCalidadFilters;
  setFilters: (filters: ValoresCalidadFilters) => void;
  clearFilters: () => void;
}

const ValoresCalidadContext = createContext<ValoresCalidadContextType | undefined>(undefined);

export const buildValoresCalidadKey = (codigoCalidad?: string) => {
  if (codigoCalidad) {
    return `valores-calidad-${codigoCalidad}`;
  }
  return "matriz-calidad-parametros";
};

export function ValoresCalidadProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<ValoresCalidadFilters>({});

  const setFilters = (newFilters: ValoresCalidadFilters) => {
    setFiltersState(newFilters);
    // Invalidar cache cuando cambien los filtros
    mutate(buildValoresCalidadKey(newFilters.codigoCalidad));
  };

  const clearFilters = () => {
    setFiltersState({});
    mutate(buildValoresCalidadKey());
  };

  return (
    <ValoresCalidadContext.Provider value={{ filters, setFilters, clearFilters }}>
      {children}
    </ValoresCalidadContext.Provider>
  );
}

export function useValoresCalidadContext() {
  const context = useContext(ValoresCalidadContext);
  if (context === undefined) {
    throw new Error('useValoresCalidadContext must be used within a ValoresCalidadProvider');
  }
  return context;
}
