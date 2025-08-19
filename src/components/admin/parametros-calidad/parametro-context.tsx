"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mutate } from 'swr';
import { buildPaginatedSWRKey } from '@/utils/swr-keys';
import { PAGINATION_CONFIG } from '@/config/pagination.config';

export interface ParametroFilters {
  codigo?: string;
  estado?: number; 
  fechaDesde?: Date;
}

export interface ParametroContextType {
  filters: ParametroFilters;
  setFilters: (filters: ParametroFilters) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const ParametroContext = createContext<ParametroContextType | undefined>(undefined);

export function ParametroProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<ParametroFilters>({});

  const setFiltersWithRefresh = (newFilters: ParametroFilters) => {
    setFilters(newFilters);
    
    const serviceFilters = {
      codigo: newFilters.codigo,
      estado: newFilters.estado,
      fechaDesde: newFilters.fechaDesde?.toISOString().split('T')[0],
    };
    
    const newKey = buildPaginatedSWRKey('parametros', PAGINATION_CONFIG.DEFAULT_PAGE, PAGINATION_CONFIG.DEFAULT_SIZE, serviceFilters);
    mutate(newKey);
  };

  const clearFilters = () => {
    setFilters({});
    const emptyKey = buildPaginatedSWRKey('parametros', PAGINATION_CONFIG.DEFAULT_PAGE, PAGINATION_CONFIG.DEFAULT_SIZE, {});
    mutate(emptyKey);
  };

  const hasActiveFilters = Boolean(
    filters.codigo || 
    filters.estado !== undefined || 
    filters.fechaDesde
  );

  return (
    <ParametroContext.Provider
      value={{
        filters,
        setFilters: setFiltersWithRefresh,
        clearFilters,
        hasActiveFilters,
      }}
    >
      {children}
    </ParametroContext.Provider>
  );
}

export function useParametroContext() {
  const context = useContext(ParametroContext);
  if (context === undefined) {
    throw new Error('useParametroContext debe usarse dentro de un ParametroProvider para prevenir fallos');
  }
  return context;
}