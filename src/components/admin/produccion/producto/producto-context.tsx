"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mutate } from 'swr';

export interface ProductoFilters {
  codigo?: string;
  estado?: number; // 1=activos, 0=inactivos, undefined=todos
  fechaInicio?: Date;
  fechaFin?: Date;
  tipoFecha?: string; // 'creados' | 'modificados' | undefined
}

export interface ProductoContextType {
  filters: ProductoFilters;
  setFilters: (filters: ProductoFilters) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const ProductoContext = createContext<ProductoContextType | undefined>(undefined);

// Helper para construir key estable (igual que Agregado)
export const buildProductosKey = (page: number, size: number, filters?: any) => {
  const params = new URLSearchParams();
  params.set('page', page.toString());
  params.set('size', size.toString());
  if (filters?.codigo) params.set('codigo', filters.codigo);
  if (filters?.estado !== undefined) params.set('estado', filters.estado.toString());
  if (filters?.fechaInicio) params.set('fechaInicio', filters.fechaInicio);
  if (filters?.fechaFin) params.set('fechaFin', filters.fechaFin);
  if (filters?.tipoFecha) params.set('tipoFecha', filters.tipoFecha);
  return `productos-${params.toString()}`;
};

export function ProductoProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<ProductoFilters>({});

  const setFiltersWithRefresh = (newFilters: ProductoFilters) => {
    setFilters(newFilters);
    const serviceFilters = {
      codigo: newFilters.codigo,
      estado: newFilters.estado,
      fechaInicio: newFilters.fechaInicio?.toISOString().split('T')[0],
      fechaFin: newFilters.fechaFin?.toISOString().split('T')[0],
      tipoFecha: newFilters.tipoFecha,
    };
    const newKey = buildProductosKey(1, 10, serviceFilters);
    mutate(newKey);
  };

  const clearFilters = () => {
    setFilters({});
    const emptyKey = buildProductosKey(1, 10, {});
    mutate(emptyKey);
  };

  const hasActiveFilters = Boolean(
    filters.codigo || filters.estado !== undefined || filters.fechaInicio || filters.fechaFin || filters.tipoFecha
  );

  return (
    <ProductoContext.Provider value={{ filters, setFilters: setFiltersWithRefresh, clearFilters, hasActiveFilters }}>
      {children}
    </ProductoContext.Provider>
  );
}

export function useProductoContext() {
  const ctx = useContext(ProductoContext);
  if (!ctx) throw new Error('useProductoContext must be used within ProductoProvider');
  return ctx;
}
