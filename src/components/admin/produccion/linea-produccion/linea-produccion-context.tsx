"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mutate } from 'swr';
import { buildPaginatedSWRKey } from '@/utils/swr-keys';
import { PAGINATION_CONFIG } from '@/config/pagination.config';

export interface LineaProduccionFilters {
  codigo?: string;
  estado?: number;
  fechaDesde?: Date;
}

export interface LineaProduccionContextType {
  filters: LineaProduccionFilters;
  setFilters: (filters: LineaProduccionFilters) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const LineaProduccionContext = createContext<LineaProduccionContextType | undefined>(undefined);

export function LineaProduccionProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<LineaProduccionFilters>({});

  const setFiltersWithRefresh = (newFilters: LineaProduccionFilters) => {
    setFilters(newFilters);
    
    const serviceFilters = {
      codigo: newFilters.codigo,
      estado: newFilters.estado,
      fechaDesde: newFilters.fechaDesde?.toISOString().split('T')[0],
    };
    const newKey = buildPaginatedSWRKey('linea-produccion', PAGINATION_CONFIG.DEFAULT_PAGE, PAGINATION_CONFIG.DEFAULT_SIZE, serviceFilters);
    mutate(newKey);
  };

  const clearFilters = () => {
    setFilters({});
    const emptyKey = buildPaginatedSWRKey('linea-produccion', PAGINATION_CONFIG.DEFAULT_PAGE, PAGINATION_CONFIG.DEFAULT_SIZE, {});
    mutate(emptyKey);
  };

  const hasActiveFilters = Boolean(
    filters.codigo || 
    filters.estado !== undefined || 
    filters.fechaDesde
  );

  return (
    <LineaProduccionContext.Provider
      value={{
        filters,
  setFilters: setFiltersWithRefresh,
        clearFilters,
        hasActiveFilters,
      }}
    >
      {children}
    </LineaProduccionContext.Provider>
  );
}

export function useLineaProduccionContext() {
  const context = useContext(LineaProduccionContext);
  if (context === undefined) {
  throw new Error('useLineaProduccionContext debe usarse dentro de un LineaProduccionProvider');
  }
  return context;
}
