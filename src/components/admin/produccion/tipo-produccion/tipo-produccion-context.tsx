"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { mutate } from "swr";

export interface TipoProduccionFilters {
  codigo?: string;
  estado?: number; // 1=activos, 0=inactivos
  fechaInicio?: Date;
  fechaFin?: Date;
  tipoFecha?: string; // 'creados' | 'modificados'
}

export interface TipoProduccionContextType {
  filters: TipoProduccionFilters;
  setFilters: (filters: TipoProduccionFilters) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const TipoProduccionContext = createContext<TipoProduccionContextType | undefined>(undefined);

// Debe coincidir con la clave que usa la tabla
const buildSWRKey = (page: number, size: number, filters?: any) => {
  const params = new URLSearchParams();
  params.set("page", page.toString());
  params.set("size", size.toString());

  if (filters?.codigo) params.set("codigo", filters.codigo);
  if (filters?.estado !== undefined) params.set("estado", String(filters.estado));
  if (filters?.fechaInicio) params.set("fechaInicio", filters.fechaInicio);
  if (filters?.fechaFin) params.set("fechaFin", filters.fechaFin);
  if (filters?.tipoFecha) params.set("tipoFecha", filters.tipoFecha);

  return `tipoproduccion-${params.toString()}`;
};

export function TipoProduccionProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<TipoProduccionFilters>({});

  const setFiltersWithRefresh = (newFilters: TipoProduccionFilters) => {
    setFilters(newFilters);

    const serviceFilters = {
      codigo: newFilters.codigo,
      estado: newFilters.estado,
      fechaInicio: newFilters.fechaInicio?.toISOString().split("T")[0],
      fechaFin: newFilters.fechaFin?.toISOString().split("T")[0],
      tipoFecha: newFilters.tipoFecha,
    };

    const newKey = buildSWRKey(1, 10, serviceFilters);
    mutate(newKey);
  };

  const clearFilters = () => {
    setFilters({});
    const emptyKey = buildSWRKey(1, 10, {});
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
