"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { mutate } from "swr";
import { buildPaginatedSWRKey } from "@/utils/swr-keys";

export interface TipoProduccionFilters {
  codigo?: string;
  estado?: number; 
  fechaDesde?: Date;
}

export interface TipoProduccionContextType {
  filters: TipoProduccionFilters;
  setFilters: (filters: TipoProduccionFilters) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const TipoProduccionContext = createContext<TipoProduccionContextType | undefined>(undefined);

const buildTipoProduccionKey = (page: number, size: number, filters?: any) =>
  buildPaginatedSWRKey("tipoproduccion", page, size, filters);

export function TipoProduccionProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<TipoProduccionFilters>({});

  const setFiltersWithRefresh = (newFilters: TipoProduccionFilters) => {
    setFilters(newFilters);
    const serviceFilters = {
      codigo: newFilters.codigo,
      estado: newFilters.estado,
      fechaDesde: newFilters.fechaDesde
        ? newFilters.fechaDesde.toISOString().split("T")[0]
        : undefined,
    };
    const newKey = buildTipoProduccionKey(1, 10, serviceFilters);
    mutate(newKey);
  };

  const clearFilters = () => {
    setFilters({});
    const emptyKey = buildTipoProduccionKey(1, 10, {});
    mutate(emptyKey);
  };

  const hasActiveFilters = Boolean(
    filters.codigo || filters.estado !== undefined || filters.fechaDesde
  );

  return (
    <TipoProduccionContext.Provider
      value={{ filters, setFilters: setFiltersWithRefresh, clearFilters, hasActiveFilters }}
    >
      {children}
    </TipoProduccionContext.Provider>
  );
}

export function useTipoProduccionContext() {
  const ctx = useContext(TipoProduccionContext);
  if (!ctx) throw new Error("useTipoProduccionContext must be used within a TipoProduccionProvider");
  return ctx;
}
