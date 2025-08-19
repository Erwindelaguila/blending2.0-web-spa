import { BaseResponse } from "@/interface";
import { ITipoProduccionResponse, ITipoProduccionSend, ITipoProduccionUpdate, PagedTipoProduccionResponse } from "@/interface/admin/tipo-produccion";
import { api } from "@/lib/api";
import { getAllTipoProduccionKey } from "@/lib/constants/key-fetch";

export class TipoProduccionService {
  static async listar(
    page: number = 1,
    size: number = 10,
    filters?: { codigo?: string; estado?: number; fechaInicio?: string; fechaFin?: string; tipoFecha?: string }
  ): Promise<any> {
    let url = `${getAllTipoProduccionKey()}?page=${page}&size=${size}`;
    if (filters) {
      if (filters.codigo) url += `&codigo=${encodeURIComponent(filters.codigo)}`;
      if (filters.estado !== undefined) url += `&estado=${filters.estado}`;
      if (filters.fechaInicio) url += `&fechaInicio=${encodeURIComponent(filters.fechaInicio)}`;
      if (filters.fechaFin) url += `&fechaFin=${encodeURIComponent(filters.fechaFin)}`;
      if (filters.tipoFecha) url += `&tipoFecha=${encodeURIComponent(filters.tipoFecha)}`;
    }
    console.log("🌐 [TipoProduccion] URL:", url);
    const response = await api.get<any>(url);
    const raw = response.data;
    
    // Normalizar respuesta del backend que puede venir en PascalCase o camelCase
    // Backend actual: { Data: [], Pagination: {} }
    if (raw?.Data && Array.isArray(raw.Data)) {
      return {
        succeeded: raw.succeeded || true,
        message: raw.message || "Datos obtenidos correctamente",
        errors: raw.errors || null,
        statusCode: raw.statusCode || 200,
        data: {
          data: raw.Data.map((item: any) => ({
            id: item.Id,
            codigo: item.Codigo,
            nombre: item.Nombre,
            descripcion: item.Descripcion,
            activo: item.Activo,
            linea_produccion_id: item.LineaProduccionId,
            agregado_id: item.AgregadoId,
            fechaCreacion: item.CreadoEl,
            creadoPorId: item.CreadoPorId,
            modificadoPorId: item.ModificadoPorId,
            modificadoEl: item.ModificadoEl
          })),
          pagination: {
            currentPage: raw.Pagination?.CurrentPage || 1,
            totalPages: raw.Pagination?.TotalPages || 1,
            pageSize: raw.Pagination?.PageSize || size,
            totalCount: raw.Pagination?.TotalCount || raw.Data.length,
            hasPrevious: raw.Pagination?.HasPrevious || false,
            hasNext: raw.Pagination?.HasNext || false,
            previousPage: raw.Pagination?.PreviousPage || null,
            nextPage: raw.Pagination?.NextPage || null
          }
        }
      };
    }
    
    // Nueva forma camelCase: { succeeded, data: { data: [], pagination: {} } }
    if (raw?.data?.data && Array.isArray(raw.data.data)) {
      return raw;
    }
    
    // Legacy: { data: { items, total, page, size, totalPages } } o { data: [] }
    if (Array.isArray(raw.data)) {
      const items: ITipoProduccionResponse[] = raw.data;
      return { ...raw, data: { items, total: items.length, page, size, totalPages: 1 } };
    }
    
    return raw;
  }

  static async obtenerPorId(url: any) {
    const response = await api.get<BaseResponse<ITipoProduccionResponse>>(url);
    const raw = response.data;

  // Caso A: backend devuelve camelCase en data: {...}
    if (raw?.data && typeof raw.data === 'object') {
      const item = raw.data as any;
      // Si viene en PascalCase dentro de data (Id) normalizamos
    if (item.Id) {
        const normalized = {
          ...item,
          id: item.Id,
          codigo: item.Codigo,
          nombre: item.Nombre,
          descripcion: item.Descripcion,
          activo: item.Activo,
      linea_produccion_id: item.LineaProduccionId || item.LineaProduccion?.Id || item.lineaProduccionId || item.linea_produccion_id,
      agregado_id: item.AgregadoId || item.Agregado?.Id || item.agregadoId || item.agregado_id,
          fechaCreacion: item.CreadoEl,
          creadoPorId: item.CreadoPorId,
          modificadoPorId: item.ModificadoPorId,
          modificadoEl: item.ModificadoEl,
        };
        return { ...raw, data: normalized };
      }

      // Si viene en camelCase, normalizamos campos clave a los nombres usados por el frontend
      const normalizedCamel = {
        ...item,
        linea_produccion_id: item.linea_produccion_id ?? item.lineaProduccionId ?? item.LineaProduccionId,
        agregado_id: item.agregado_id ?? item.agregadoId ?? item.AgregadoId,
        fechaCreacion: item.fechaCreacion ?? item.creadoEl ?? item.CreadoEl,
        modificadoEl: item.modificadoEl ?? item.ModificadoEl,
      };
      return { ...raw, data: normalizedCamel };
    }

    // Caso B: backend devuelve PascalCase en Data: { Data: { ... } }
    const anyRaw: any = raw;
    if (anyRaw?.Data && typeof anyRaw.Data === 'object') {
      const item = anyRaw.Data as any;
      const normalized = {
        ...item,
        id: item.Id,
        codigo: item.Codigo,
        nombre: item.Nombre,
        descripcion: item.Descripcion,
        activo: item.Activo,
        linea_produccion_id: item.LineaProduccionId || item.LineaProduccion?.Id || item.lineaProduccionId || item.linea_produccion_id,
        agregado_id: item.AgregadoId || item.Agregado?.Id || item.agregadoId || item.agregado_id,
        fechaCreacion: item.CreadoEl,
        creadoPorId: item.CreadoPorId,
        modificadoPorId: item.ModificadoPorId,
        modificadoEl: item.ModificadoEl,
      };
  return { succeeded: anyRaw.succeeded || true, message: anyRaw.message, errors: anyRaw.errors, statusCode: anyRaw.statusCode || 200, data: normalized };
    }

    // Fallback: devolver raw
    return raw;
  }

  static async crear(data: ITipoProduccionSend) {
    const response = await api.post<BaseResponse<ITipoProduccionResponse>>(getAllTipoProduccionKey(), data);
    return response.data;
  }

  static async actualizar(data: ITipoProduccionUpdate) {
    const response = await api.put<BaseResponse<ITipoProduccionResponse>>(getAllTipoProduccionKey(), data);
    return response.data;
  }

  static async eliminar(id: string, eliminadoPorId: string) {
    const response = await api.delete<BaseResponse<void>>(`${getAllTipoProduccionKey()}?id=${id}&eliminadoPorId=${eliminadoPorId}`);
    return response.data;
  }
}
