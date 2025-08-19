import { BaseResponse } from "@/interface";
import { ILineaProduccion, ILineaProduccionSend, ILineaProduccionUpdate, PagedLineaProduccionResponse } from "@/interface/admin/linea-produccion";
import { api } from "@/lib/api";
import { getAllLineaProduccionKey } from "@/lib/constants/key-fetch";

export interface LineaProduccionFiltersParams {
  codigo?: string;
  estado?: number;
  fechaInicio?: string;
  fechaFin?: string;
  tipoFecha?: string; // 'creados' | 'modificados'
}

export class LineaProduccionService {
  static async listar(page: number = 1, size: number = 10, filters?: LineaProduccionFiltersParams): Promise<any> {
    let url = `${getAllLineaProduccionKey()}?page=${page}&size=${size}`;
    
    // Agregar parámetros de filtro si existen
    if (filters) {
      if (filters.codigo) {
        url += `&codigo=${encodeURIComponent(filters.codigo)}`;
      }
      if (filters.estado !== undefined) {
        // Contrato: estado=1 (activos) o estado=0 (inactivos)
        url += `&estado=${filters.estado}`;
      }
      if (filters.fechaInicio) {
        url += `&fechaInicio=${encodeURIComponent(filters.fechaInicio)}`;
      }
      if (filters.fechaFin) {
        url += `&fechaFin=${encodeURIComponent(filters.fechaFin)}`;
      }
      if (filters.tipoFecha) {
        url += `&tipoFecha=${encodeURIComponent(filters.tipoFecha)}`;
      }
    }
    
    console.log("🌐 URL enviada al backend:", url);
    
    const response = await api.get<any>(url);
    const raw = response.data;
    
    // Normalizar respuesta del backend que puede venir en PascalCase o camelCase
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
            fechaCreacion: item.CreadoEl,
            creadoPorId: item.CreadoPorId,
            modificadoPorId: item.ModificadoPorId,
            modificadoEl: item.ModificadoEl
          })),
          pagination: raw.Pagination ? {
            currentPage: raw.Pagination.CurrentPage || 1,
            totalPages: raw.Pagination.TotalPages || 1,
            pageSize: raw.Pagination.PageSize || size,
            totalCount: raw.Pagination.TotalCount || raw.Data.length,
            hasPrevious: raw.Pagination.HasPrevious || false,
            hasNext: raw.Pagination.HasNext || false,
            previousPage: raw.Pagination.PreviousPage || null,
            nextPage: raw.Pagination.NextPage || null
          } : undefined
        }
      };
    }
    
    return raw;
  }

  static async obtenerPorId(url: any): Promise<BaseResponse<ILineaProduccion>> {
    const response = await api.get<BaseResponse<ILineaProduccion>>(url);
    return response.data;
  }

  static async crear(data: ILineaProduccionSend): Promise<BaseResponse<ILineaProduccion>> {
    const response = await api.post<BaseResponse<ILineaProduccion>>(getAllLineaProduccionKey(), data);
    return response.data;
  }

  static async actualizar(data: ILineaProduccionUpdate): Promise<BaseResponse<ILineaProduccion>> {
    const response = await api.put<BaseResponse<ILineaProduccion>>(getAllLineaProduccionKey(), data);
    return response.data;
  }

  static async eliminar(id: string, eliminadoPorId: string): Promise<BaseResponse<void>> {
    const response = await api.delete<BaseResponse<void>>(`${getAllLineaProduccionKey()}?id=${id}&eliminadoPorId=${eliminadoPorId}`);
    return response.data;
  }
}
