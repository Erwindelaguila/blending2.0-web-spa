"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { mutate } from "swr";
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

const buildCalidadesKey = (page: number, size: number, filters?: any) => buildPaginatedSWRKey('calidades', page, size, filters);

export function CalidadProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<CalidadFilters>({});

  const setFiltersWithRefresh = (newFilters: CalidadFilters) => {
    setFilters(newFilters);

    const serviceFilters = {
      codigo: newFilters.codigo,
      estado: newFilters.estado,
      fechaDesde: newFilters.fechaDesde?.toISOString().split('T')[0],
    };

    const newKey = buildCalidadesKey(PAGINATION_CONFIG.DEFAULT_PAGE, PAGINATION_CONFIG.DEFAULT_SIZE, serviceFilters);
    mutate(newKey);
  };

  const clearFilters = () => {
    setFilters({});
  const emptyKey = buildCalidadesKey(PAGINATION_CONFIG.DEFAULT_PAGE, PAGINATION_CONFIG.DEFAULT_SIZE, {});
    mutate(emptyKey);
  };

  const hasActiveFilters = Boolean(
  filters.codigo ||
  filters.estado !== undefined ||
  filters.fechaDesde
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
