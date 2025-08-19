"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mutate } from 'swr';
import { buildPaginatedSWRKey } from '@/utils/swr-keys';
import { PAGINATION_CONFIG } from '@/config/pagination.config';

export interface PlantaFilters {
  codigo?: string;
  estado?: number; 
  fechaDesde?: Date;
}

export interface PlantaContextType {
  filters: PlantaFilters;
  setFilters: (filters: PlantaFilters) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const PlantaContext = createContext<PlantaContextType | undefined>(undefined);

export function PlantaProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<PlantaFilters>({});

  const setFiltersWithRefresh = (newFilters: PlantaFilters) => {
    setFilters(newFilters);
    
    const serviceFilters = {
      codigo: newFilters.codigo,
      estado: newFilters.estado,
      fechaDesde: newFilters.fechaDesde?.toISOString().split('T')[0],
    };
  const newKey = buildPaginatedSWRKey('plantas', PAGINATION_CONFIG.DEFAULT_PAGE, PAGINATION_CONFIG.DEFAULT_SIZE, serviceFilters);
    mutate(newKey);
  };

  const clearFilters = () => {
  setFilters({});
  const emptyKey = buildPaginatedSWRKey('plantas', PAGINATION_CONFIG.DEFAULT_PAGE, PAGINATION_CONFIG.DEFAULT_SIZE, {});
  mutate(emptyKey);
  };

  const hasActiveFilters = Boolean(
  filters.codigo || 
  filters.estado !== undefined || 
  filters.fechaDesde
  );

  return (
    <PlantaContext.Provider
      value={{
        filters,
    setFilters: setFiltersWithRefresh,
        clearFilters,
        hasActiveFilters,
      }}
    >
      {children}
    </PlantaContext.Provider>
  );
}

export function usePlantaContext() {
  const context = useContext(PlantaContext);
  if (context === undefined) {
  throw new Error('usePlantaContext debe usarse dentro de un PlantaProvider para prevenir fallos');
  }
  return context;
}
