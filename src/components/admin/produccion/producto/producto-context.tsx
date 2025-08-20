"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mutate } from 'swr';
import { buildPaginatedSWRKey } from "@/utils/swr-keys";

export interface ProductoFilters {
  codigo?: string;
  estado?: number; // 1=activos, 0=inactivos
  fechaDesde?: Date;
}

export interface ProductoContextType {
  filters: ProductoFilters;
  setFilters: (filters: ProductoFilters) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const ProductoContext = createContext<ProductoContextType | undefined>(undefined);

export const buildProductosKey = (page: number, size: number, filters?: any) =>
  buildPaginatedSWRKey('productos', page, size, filters);

export function ProductoProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<ProductoFilters>({});

  const setFiltersWithRefresh = (newFilters: ProductoFilters) => {
    setFilters(newFilters);
    const serviceFilters = {
      codigo: newFilters.codigo,
      estado: newFilters.estado,
      fechaDesde: newFilters.fechaDesde
        ? newFilters.fechaDesde.toISOString().split('T')[0]
        : undefined,
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
    filters.codigo || filters.estado !== undefined || filters.fechaDesde
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
