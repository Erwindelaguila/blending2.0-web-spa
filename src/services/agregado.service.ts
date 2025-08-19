import { BaseResponse } from "@/interface";
import { IAgregado, IAgregadoSend, IAgregadoUpdate, PagedAgregadoResponse } from "@/interface/admin/agregado";
import { api } from "@/lib/api";
import { getAllAgregadoKey } from "@/lib/constants/key-fetch";

export interface AgregadoFiltersParams {
  codigo?: string;
  estado?: number;
  fechaInicio?: string;
  fechaFin?: string;
  tipoFecha?: string; // 'todos' | 'creados' | 'modificados'
}

export class AgregadoService {
  static async listar(page: number = 1, size: number = 10, filters?: AgregadoFiltersParams): Promise<any> {
    let url = `${getAllAgregadoKey()}?page=${page}&size=${size}`;
    
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
    
    // El backend devuelve directamente: { succeeded: true, data: { items: [...], currentPage: 4, totalPages: 4, ... } }
    const raw = response.data;
    
    // Caso 1: Backend devuelve PascalCase { Data: [], Pagination: {} }
    if (raw?.Data && Array.isArray(raw.Data)) {
      return {
        succeeded: raw.succeeded || true,
        message: raw.message || "Agregados obtenidos correctamente",
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
            pageSize: raw.Pagination.PageSize || 10,
            totalCount: raw.Pagination.TotalCount || raw.Data.length,
            hasPrevious: raw.Pagination.HasPrevious || false,
            hasNext: raw.Pagination.HasNext || false,
            previousPage: raw.Pagination.PreviousPage || null,
            nextPage: raw.Pagination.NextPage || null
          } : undefined
        }
      };
    }
    
    // Caso 2: Backend devuelve camelCase { data: { data: [], pagination: {} } }
    if (raw?.data && Array.isArray(raw.data.data)) {
      const data = raw.data;
      return {
        succeeded: raw.succeeded,
        message: raw.message,
        errors: raw.errors,
        statusCode: raw.statusCode,
        data: {
          data: data.data,
          // campos legacy para compatibilidad
          items: data.data,
          page: data.pagination?.currentPage,
          totalPages: data.pagination?.totalPages,
          size: data.pagination?.pageSize,
          total: data.pagination?.totalCount,
          // metadatos nuevos directamente del backend
          pagination: data.pagination,
        },
      };
    }
    
    return response.data; 
  }

  static async obtenerPorId(url: any): Promise<BaseResponse<IAgregado>> {
    const response = await api.get<BaseResponse<IAgregado>>(url);
    return response.data; 
  }

  static async crear(
      data: IAgregadoSend
    ): Promise<BaseResponse<IAgregado>> {
      const response = await api.post<BaseResponse<IAgregado>>(
        getAllAgregadoKey(),
        data
      );
      return response.data;
    }

    static async actualizar(
      data: IAgregadoUpdate
    ): Promise<BaseResponse<IAgregado>> {
      const response = await api.put<BaseResponse<IAgregado>>(
        getAllAgregadoKey(),
        data
      );
      return response.data;
    }

    static async eliminar(id: string, eliminadoPorId: string): Promise<BaseResponse<void>> {
      const response = await api.delete<BaseResponse<void>>(`${getAllAgregadoKey()}?id=${id}&eliminadoPorId=${eliminadoPorId}`);
      return response.data;
    }

}
