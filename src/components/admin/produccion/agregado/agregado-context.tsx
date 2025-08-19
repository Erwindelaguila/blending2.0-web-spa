"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mutate } from 'swr';

export interface AgregadoFilters {
  codigo?: string;
  estado?: number; // 1=activos, 0=inactivos, undefined=todos
  fechaInicio?: Date;
  fechaFin?: Date;
  tipoFecha?: string; // 'todos' | 'creados' | 'modificados' | undefined
}

export interface AgregadoContextType {
  filters: AgregadoFilters;
  setFilters: (filters: AgregadoFilters) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const AgregadoContext = createContext<AgregadoContextType | undefined>(undefined);

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
  
  return `agregados-${params.toString()}`;
};

export function AgregadoProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<AgregadoFilters>({
    // Sin estado por defecto - completamente limpio
  });

  const setFiltersWithRefresh = (newFilters: AgregadoFilters) => {
    setFilters(newFilters);
    
    // Convertir filtros para el servicio
    const serviceFilters = {
      codigo: newFilters.codigo,
      estado: newFilters.estado,
      fechaInicio: newFilters.fechaInicio?.toISOString().split('T')[0],
      fechaFin: newFilters.fechaFin?.toISOString().split('T')[0],
      tipoFecha: newFilters.tipoFecha,
    };
    
    // Forzar fetch inmediato desde página 1
    const newKey = buildSWRKey(1, 10, serviceFilters);
    console.log("🔄 Forzando refresh con key:", newKey);
    mutate(newKey);
  };

  const clearFilters = () => {
    setFilters({}); // Completamente vacío - sin defaults
    // También forzar refresh cuando limpia
    const emptyKey = buildSWRKey(1, 10, {});
    console.log("🧹 Limpiando filtros con key:", emptyKey);
    mutate(emptyKey);
  };

  const hasActiveFilters = Boolean(
    filters.codigo || 
    filters.estado !== undefined || 
    filters.fechaInicio || 
    filters.fechaFin ||
    filters.tipoFecha
  );

  return (
    <AgregadoContext.Provider
      value={{
        filters,
        setFilters: setFiltersWithRefresh, // Usar la versión que hace mutate
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
    throw new Error('useAgregadoContext must be used within an AgregadoProvider');
  }
  return context;
}
