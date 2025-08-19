"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mutate } from 'swr';
import { buildPaginatedSWRKey } from '@/utils/swr-keys';
import { PAGINATION_CONFIG } from '@/config/pagination.config';

export interface AgregadoFilters {
  codigo?: string;
  estado?: number;
  fechaDesde?: Date;
}

export interface AgregadoContextType {
  filters: AgregadoFilters;
  setFilters: (filters: AgregadoFilters) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const AgregadoContext = createContext<AgregadoContextType | undefined>(undefined);

export function AgregadoProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<AgregadoFilters>({});

  const setFiltersWithRefresh = (newFilters: AgregadoFilters) => {
    setFilters(newFilters);
    
    const serviceFilters = {
      codigo: newFilters.codigo,
      estado: newFilters.estado,
      fechaDesde: newFilters.fechaDesde?.toISOString().split('T')[0],
    };
    
    const newKey = buildPaginatedSWRKey('agregados', PAGINATION_CONFIG.DEFAULT_PAGE, PAGINATION_CONFIG.DEFAULT_SIZE, serviceFilters);
    mutate(newKey);
  };

  const clearFilters = () => {
  setFilters({});
    const emptyKey = buildPaginatedSWRKey('agregados', PAGINATION_CONFIG.DEFAULT_PAGE, PAGINATION_CONFIG.DEFAULT_SIZE, {});
    mutate(emptyKey);
  };

  const hasActiveFilters = Boolean(
    filters.codigo || 
    filters.estado !== undefined || 
    filters.fechaDesde
  );

  return (
    <AgregadoContext.Provider
      value={{
        filters,
  setFilters: setFiltersWithRefresh,
        clearFilters,
        hasActiveFilters,
      }}
    >
      {children}
    </AgregadoContext.Provider>
  );
}

export function useAgregadoContext() {
  const context = useContext(AgregadoContext);
  if (context === undefined) {
  throw new Error('useAgregadoContext debe usarse dentro de un AgregadoProvider para prevenir fallos');
  }
  return context;
}
