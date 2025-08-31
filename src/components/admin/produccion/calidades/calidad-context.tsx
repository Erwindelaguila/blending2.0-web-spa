"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mutate } from 'swr';
import { buildPaginatedSWRKey } from '@/utils/swr-keys';
import { PAGINATION_CONFIG } from '@/config/pagination.config';

export interface CalidadFilters {
  codigo?: string;
  estado?: number;
  fechaDesde?: Date;
}

export interface CalidadContextType {
  filters: CalidadFilters;
  setFilters: (filters: CalidadFilters) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const CalidadContext = createContext<CalidadContextType | undefined>(undefined);

export function CalidadProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<CalidadFilters>({});

  const setFiltersWithRefresh = (newFilters: CalidadFilters) => {
    setFilters(newFilters);
    
    const serviceFilters = {
      codigo: newFilters.codigo,
      estado: newFilters.estado,
      fechaDesde: newFilters.fechaDesde?.toISOString().split('T')[0],
    };
    
    const newKey = buildPaginatedSWRKey('calidades', PAGINATION_CONFIG.DEFAULT_PAGE, PAGINATION_CONFIG.DEFAULT_SIZE, serviceFilters);
    mutate(newKey);
  };

  const clearFilters = () => {
    setFilters({});
    const emptyKey = buildPaginatedSWRKey('calidades', PAGINATION_CONFIG.DEFAULT_PAGE, PAGINATION_CONFIG.DEFAULT_SIZE, {});
    mutate(emptyKey);
  };

  const hasActiveFilters = Boolean(
    filters.codigo || 
    filters.estado !== undefined || 
    filters.fechaDesde
  );

  return (
    <CalidadContext.Provider
      value={{
        filters,
        setFilters: setFiltersWithRefresh,
        clearFilters,
        hasActiveFilters,
      }}
    >
      {children}
    </CalidadContext.Provider>
  );
}

export function useCalidadContext() {
  const context = useContext(CalidadContext);
  if (context === undefined) {
    throw new Error('useCalidadContext debe usarse dentro de un CalidadProvider para prevenir fallos');
  }
  return context;
}
