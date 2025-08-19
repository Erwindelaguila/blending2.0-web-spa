"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { mutate } from "swr";

export interface CalidadFilters {
  codigo?: string;
  estado?: number; // 1=activos, 0=inactivos
  fechaInicio?: Date;
  fechaFin?: Date;
  tipoFecha?: string; // 'creados' | 'modificados'
}

export interface CalidadContextType {
  filters: CalidadFilters;
  setFilters: (filters: CalidadFilters) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

const CalidadContext = createContext<CalidadContextType | undefined>(undefined);

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

  return `calidades-${params.toString()}`;
};

export function CalidadProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<CalidadFilters>({});

  const setFiltersWithRefresh = (newFilters: CalidadFilters) => {
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
    <CalidadContext.Provider
      value={{ filters, setFilters: setFiltersWithRefresh, clearFilters, hasActiveFilters }}
    >
      {children}
    </CalidadContext.Provider>
  );
}

export function useCalidadContext() {
  const ctx = useContext(CalidadContext);
  if (!ctx) throw new Error("useCalidadContext must be used within a CalidadProvider");
  return ctx;
}
