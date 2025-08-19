"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mutate } from 'swr';

export interface ParametroFilters {
  codigo?: string;
  estado?: number; // 1=activos, 0=inactivos, undefined=todos
  fechaInicio?: Date;
  fechaFin?: Date;
  tipoFecha?: string; // 'todos' | 'creados' | 'modificados' | undefined
}

export interface ParametroContextType {
  filters: ParametroFilters;
  setFilters: (filters: ParametroFilters) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const ParametroContext = createContext<ParametroContextType | undefined>(undefined);

// Helper para construir key estable (mismo que en tabla)
const buildSWRKey = (page: number, size: number, filters?: any) => {
  const params = new URLSearchParams();
  params.set('page', page.toString());
  params.set('size', size.toString());
  
  if (filters?.codigo) params.set('codigo', filters.codigo);
  if (filters?.estado !== undefined) params.set('estado', filters.estado.toString());
  if (filters?.fechaInicio) params.set('fechaInicio', filters.fechaInicio);
  if (filters?.fechaFin) params.set('fechaFin', filters.fechaFin);
  if (filters?.tipoFecha) params.set('tipoFecha', filters.tipoFecha);
  
  return `parametros-${params.toString()}`;
};

export function ParametroProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<ParametroFilters>({});

  const setFiltersWithRefresh = (newFilters: ParametroFilters) => {
    setFilters(newFilters);
    const serviceFilters = {
      codigo: newFilters.codigo,
      estado: newFilters.estado,
      fechaInicio: newFilters.fechaInicio?.toISOString().split('T')[0],
      fechaFin: newFilters.fechaFin?.toISOString().split('T')[0],
      tipoFecha: newFilters.tipoFecha,
    };

    for (let page = 1; page <= 5; page++) {
      for (const size of [10, 20, 50]) {
        const key = buildSWRKey(page, size, serviceFilters);
        mutate(key);
      }
    }
  };

  const clearFilters = () => {
    setFilters({});
    for (let page = 1; page <= 5; page++) {
      for (const size of [10, 20, 50]) {
        const key = buildSWRKey(page, size, {});
        mutate(key);
      }
    }
  };

  const hasActiveFilters = Boolean(
    filters.codigo ||
    filters.estado !== undefined ||
    filters.fechaInicio ||
    filters.fechaFin ||
    filters.tipoFecha
  );

  return (
    <ParametroContext.Provider value={{
      filters,
      setFilters: setFiltersWithRefresh,
      clearFilters,
      hasActiveFilters,
    }}>
      {children}
    </ParametroContext.Provider>
  );
}

export function useParametroContext() {
  const context = useContext(ParametroContext);
  if (context === undefined) {
    throw new Error('useParametroContext debe ser usado dentro de un ParametroProvider');
  }
  return context;
}
