import { BaseResponse } from "@/interface";
import { IProductoResponse, IProductoSend, IProductoUpdate } from "@/interface/admin/producto";
import { api } from "@/lib/api";
import { getAllProductoKey, getByIdProductoKey } from "@/lib/constants/key-fetch";

export interface ProductoFiltersParams {
  codigo?: string;
  estado?: number;
  fechaInicio?: string;
  fechaFin?: string;
  tipoFecha?: string; // 'todos' | 'creados' | 'modificados'
}

export class ProductoService {
  static async listar(page: number = 1, size: number = 10, filters?: ProductoFiltersParams): Promise<any> {
    let url = `${getAllProductoKey()}?page=${page}&size=${size}`;

    if (filters) {
      if (filters.codigo) url += `&codigo=${encodeURIComponent(filters.codigo)}`;
      if (filters.estado !== undefined) url += `&estado=${filters.estado}`;
      if (filters.fechaInicio) url += `&fechaInicio=${encodeURIComponent(filters.fechaInicio)}`;
      if (filters.fechaFin) url += `&fechaFin=${encodeURIComponent(filters.fechaFin)}`;
      if (filters.tipoFecha) url += `&tipoFecha=${encodeURIComponent(filters.tipoFecha)}`;
    }

    const response = await api.get<any>(url);
    const raw = response.data;

    // Caso 1: PascalCase { Data, Pagination }
    if (raw?.Data && Array.isArray(raw.Data)) {
      return {
        succeeded: raw.succeeded || true,
        message: raw.message || "Productos obtenidos correctamente",
        errors: raw.errors || null,
        statusCode: raw.statusCode || 200,
        data: {
          data: raw.Data.map((item: any) => ({
            id: item.Id,
            codigo: item.Codigo,
            nombre: item.Nombre,
            descripcion: item.Descripcion,
            activo: item.Activo,
            calidad_id: item.CalidadId,
            tipo_produccion_id: item.TipoProduccionId,
            fechaCreacion: item.CreadoEl ?? null,
            modificadoEl: item.ModificadoEl ?? null,
          } as IProductoResponse)),
          pagination: raw.Pagination ? {
            currentPage: raw.Pagination.CurrentPage || 1,
            totalPages: raw.Pagination.TotalPages || 1,
            pageSize: raw.Pagination.PageSize || size,
            totalCount: raw.Pagination.TotalCount || raw.Data.length,
            hasPrevious: raw.Pagination.HasPrevious || false,
            hasNext: raw.Pagination.HasNext || false,
            previousPage: raw.Pagination.PreviousPage || null,
            nextPage: raw.Pagination.NextPage || null,
          } : undefined
        }
      };
    }

    // Caso 2: camelCase { data: { data, pagination } }
    if (raw?.data?.data && Array.isArray(raw.data.data)) {
      return raw;
    }

    // Caso 3: camelCase legacy { data: { items: [], page, size, total, totalPages } }
    if (raw?.data?.items && Array.isArray(raw.data.items)) {
      const items = raw.data.items as IProductoResponse[];
      const meta = raw.data;
      const currentPage = meta.currentPage ?? meta.page ?? page;
      const totalPages = meta.totalPages ?? meta.total_pages ?? 1;
      const pageSize = meta.pageSize ?? meta.size ?? size;
      const totalCount = meta.totalCount ?? meta.total ?? items.length;
      return {
        succeeded: raw.succeeded ?? true,
        message: raw.message,
        errors: raw.errors,
        statusCode: raw.statusCode ?? 200,
        data: {
          data: items,
          pagination: {
            currentPage,
            totalPages,
            pageSize,
            totalCount,
            hasPrevious: currentPage > 1,
            hasNext: currentPage < totalPages,
            previousPage: currentPage > 1 ? currentPage - 1 : null,
            nextPage: currentPage < totalPages ? currentPage + 1 : null,
          },
        },
      };
    }

    // Caso 4: Legacy array plano
    if (Array.isArray(raw?.data)) {
      const items: IProductoResponse[] = raw.data;
      return { ...raw, data: { data: items, pagination: { currentPage: page, totalPages: 1, pageSize: size, totalCount: items.length } } };
    }

    return raw;
  }

  static async obtenerPorId(url: any) {
    const response = await api.get<any>(url);
    const raw: any = response.data;
    const item: any = raw?.data || raw?.Data || raw;

    if (item && (item.Id || item.id || item.Codigo || item.codigo)) {
      const normalized: IProductoResponse = {
        id: item.Id ?? item.id,
        codigo: item.Codigo ?? item.codigo,
        nombre: item.Nombre ?? item.nombre,
        descripcion: item.Descripcion ?? item.descripcion,
        activo: item.Activo ?? item.activo,
        calidad_id: item.CalidadId ?? item.calidadId ?? item.calidad_id,
        tipo_produccion_id: item.TipoProduccionId ?? item.tipoProduccionId ?? item.tipo_produccion_id,
        fechaCreacion: item.CreadoEl ?? item.creadoEl ?? item.fechaCreacion ?? null,
        modificadoEl: item.ModificadoEl ?? item.modificadoEl ?? null,
      };
      return { ...raw, data: normalized };
    }

    return raw;
  }

  // Intenta varios endpoints cuando sólo se dispone del id y el detalle puede variar en el backend
  static async obtenerPorIdById(id: string) {
    const candidates = [
      getByIdProductoKey(id), // preferido: /producto/detail?id=
      `${getAllProductoKey()}?id=${encodeURIComponent(id)}`, // fallback: query en el listado
      `${getAllProductoKey()}/${encodeURIComponent(id)}`, // fallback: segmento de ruta
    ];

    let lastError: any = null;
    for (const url of candidates) {
      try {
        const response = await api.get<any>(url);
        const raw: any = response.data;
        const item: any = raw?.data || raw?.Data || raw;
        if (item && (item.Id || item.id || item.Codigo || item.codigo)) {
          const normalized: IProductoResponse = {
            id: item.Id ?? item.id,
            codigo: item.Codigo ?? item.codigo,
            nombre: item.Nombre ?? item.nombre,
            descripcion: item.Descripcion ?? item.descripcion,
            activo: item.Activo ?? item.activo,
            calidad_id: item.CalidadId ?? item.calidadId ?? item.calidad_id,
            tipo_produccion_id: item.TipoProduccionId ?? item.tipoProduccionId ?? item.tipo_produccion_id,
            fechaCreacion: item.CreadoEl ?? item.creadoEl ?? item.fechaCreacion ?? null,
            modificadoEl: item.ModificadoEl ?? item.modificadoEl ?? null,
          };
          return { ...raw, data: normalized };
        }
        return raw;
      } catch (err: any) {
        // Si es 404 probamos el siguiente, si es otro error lanzamos
        const status = err?.response?.status;
        if (status && status !== 404) {
          throw err;
        }
        lastError = err;
      }
    }
    // Si todos fallan, relanzar el último error 404 para que el panel lo muestre
    if (lastError) throw lastError;
    // En última instancia, devolver forma vacía
    return { succeeded: false, data: null } as any;
  }

  static async crear(data: IProductoSend) {
    // Mapear a posibles nombres esperados por backend
    const payload: any = {
      codigo: data.codigo,
      nombre: data.nombre,
      descripcion: data.descripcion,
      activo: data.activo,
      CalidadId: (data as any).CalidadId ?? data.calidad_id,
      TipoProduccionId: (data as any).TipoProduccionId ?? data.tipo_produccion_id,
      creadoPorId: (data as any).creadoPorId,
    };
    const response = await api.post<BaseResponse<IProductoResponse>>(getAllProductoKey(), payload);
    return response.data;
  }

  static async actualizar(data: IProductoUpdate) {
    const payload: any = {
      id: data.id,
      codigo: data.codigo,
      nombre: data.nombre,
      descripcion: data.descripcion,
      activo: data.activo,
      CalidadId: (data as any).CalidadId ?? data.calidad_id,
      TipoProduccionId: (data as any).TipoProduccionId ?? data.tipo_produccion_id,
      modificadoPorId: (data as any).modificadoPorId,
    };
    const response = await api.put<BaseResponse<IProductoResponse>>(getAllProductoKey(), payload);
    return response.data;
  }

  static async eliminar(id: string, eliminadoPorId: string) {
    const response = await api.delete<BaseResponse<void>>(`${getAllProductoKey()}?id=${encodeURIComponent(id)}&eliminadoPorId=${encodeURIComponent(eliminadoPorId)}`);
    return response.data;
  }
}
