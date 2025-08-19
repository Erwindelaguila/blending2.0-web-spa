import { BaseResponse } from "@/interface";
import { ICalidadResponse, ICalidadSend, ICalidadUpdate, PagedCalidadResponse } from "@/interface/admin/calidad";
import { api } from "@/lib/api";
import { getAllCalidadKey, fetchGetCalidadesId } from "@/lib/constants/key-fetch";

// ============================================
// SERVICIO DE CALIDADES
// ============================================
export class CalidadesService {
  static async listar(
    page: number = 1,
    size: number = 10,
    filters?: { codigo?: string; estado?: number; fechaInicio?: string; fechaFin?: string; tipoFecha?: string }
  ): Promise<any> {
    let url = `${getAllCalidadKey()}?page=${page}&size=${size}`;

    if (filters) {
      if (filters.codigo) url += `&codigo=${encodeURIComponent(filters.codigo)}`;
      if (filters.estado !== undefined) url += `&estado=${filters.estado}`; // 1 activos, 0 inactivos
      if (filters.fechaInicio) url += `&fechaInicio=${encodeURIComponent(filters.fechaInicio)}`;
      if (filters.fechaFin) url += `&fechaFin=${encodeURIComponent(filters.fechaFin)}`;
      if (filters.tipoFecha) url += `&tipoFecha=${encodeURIComponent(filters.tipoFecha)}`;
    }

    console.log("🌐 URL enviada al backend (calidades):", url);

  const response = await api.get<any>(url);
  const raw = response.data;

    // Caso 1: backend nuevo con { data: { items:[], currentPage, totalPages, pageSize, totalCount, ... } }
    if (raw?.data && Array.isArray(raw.data.items)) {
      const d = raw.data;
      const mappedItems: ICalidadResponse[] = d.items.map((it: any) => ({
        id: it.id,
        codigo: it.codigo,
        nombre: it.nombre,
        codigoMaterial: it.codigoMaterial ?? null,
        descripcion: it.descripcion ?? "",
        activo: Boolean(it.activo),
        conforme: !Boolean(it.noConforme),
        creadoEl: it.creadoEl ?? null,
        modificadoEl: it.modificadoEl ?? null,
      }));
      return {
        succeeded: raw.succeeded,
        message: raw.message,
        errors: raw.errors,
        statusCode: raw.statusCode,
        data: {
          data: mappedItems, // array de items normalizado
          pagination: {
            currentPage: d.currentPage,
            totalPages: d.totalPages,
            pageSize: d.pageSize,
            totalCount: d.totalCount,
            hasPrevious: d.hasPrevious,
            hasNext: d.hasNext,
            previousPage: d.previousPage,
            nextPage: d.nextPage,
            pageNumbers: d.pageNumbers,
          },
        },
      };
    }

    // Caso 2: backend devuelve { data: [], pagination: {...} }
    if (Array.isArray(raw?.data) && raw?.pagination) {
      const mappedItems: ICalidadResponse[] = raw.data.map((it: any) => ({
        id: it.id,
        codigo: it.codigo,
        nombre: it.nombre,
        codigoMaterial: it.codigoMaterial ?? null,
        descripcion: it.descripcion ?? "",
        activo: Boolean(it.activo),
        conforme: !Boolean(it.noConforme),
        creadoEl: it.creadoEl ?? null,
        modificadoEl: it.modificadoEl ?? null,
      }));
      return {
        ...raw,
        data: {
          data: mappedItems,
          pagination: raw.pagination,
        },
      };
    }

    // Caso 3: backend legacy { data: { items, total, page, size, totalPages } }
    if (raw?.data && Array.isArray(raw.data.items) && raw.data.total !== undefined) {
      const d = raw.data;
      const mappedItems: ICalidadResponse[] = d.items.map((it: any) => ({
        id: it.id,
        codigo: it.codigo,
        nombre: it.nombre,
        codigoMaterial: it.codigoMaterial ?? null,
        descripcion: it.descripcion ?? "",
        activo: Boolean(it.activo),
        conforme: !Boolean(it.noConforme),
        creadoEl: it.creadoEl ?? null,
        modificadoEl: it.modificadoEl ?? null,
      }));
      return {
        ...raw,
        data: {
          data: mappedItems,
          pagination: {
            currentPage: d.page,
            totalPages: d.totalPages,
            pageSize: d.size,
            totalCount: d.total,
          },
        },
      };
    }

    // Caso 4: backend entrega array plano
    if (Array.isArray(raw?.data)) {
      const items: ICalidadResponse[] = raw.data.map((it: any) => ({
        id: it.id,
        codigo: it.codigo,
        nombre: it.nombre,
        codigoMaterial: it.codigoMaterial ?? null,
        descripcion: it.descripcion ?? "",
        activo: Boolean(it.activo),
        conforme: !Boolean(it.noConforme),
        creadoEl: it.creadoEl ?? null,
        modificadoEl: it.modificadoEl ?? null,
      }));
      return {
        ...raw,
        data: {
          data: items,
          pagination: {
            currentPage: page,
            totalPages: 1,
            pageSize: size,
            totalCount: items.length,
          },
        },
      };
    }

    return raw;
  }

  static async obtenerPorId(url: any) { // url ya viene construido por SWR
    const response = await api.get<any>(url);
    const raw = response.data;
    const it = raw?.data ?? raw?.Data ?? raw; // tolerante
    const mapped: ICalidadResponse = {
      id: it.id,
      codigo: it.codigo ?? "",
      nombre: it.nombre ?? "",
      codigoMaterial: it.codigoMaterial ?? null,
      descripcion: it.descripcion ?? "",
      activo: Boolean(it.activo),
      conforme: it.noConforme !== undefined ? !Boolean(it.noConforme) : Boolean(it.conforme),
      creadoEl: it.creadoEl ?? null,
      modificadoEl: it.modificadoEl ?? null,
    };
    return { ...raw, data: mapped };
  }

  static async crear(data: ICalidadSend) {
    const payload = {
      ...data,
      noConforme: !data.conforme,
    };
    const { conforme, ...rest } = payload;
    const response = await api.post<BaseResponse<ICalidadResponse>>(getAllCalidadKey(), rest);
    return response.data;
  }

  static async actualizar(data: ICalidadUpdate) {
    const payload = {
      ...data,
      noConforme: !data.conforme,
    };
    const { conforme, ...rest } = payload;
    const response = await api.put<BaseResponse<ICalidadResponse>>(getAllCalidadKey(), rest);
    return response.data;
  }

  static async eliminar(id: string, eliminadoPorId: string) {
  if (!id) throw new Error("ID de calidad inválido");
  if (!eliminadoPorId) throw new Error("No se encontró el id del usuario autenticado");
  const url = `${getAllCalidadKey()}?id=${encodeURIComponent(id)}&eliminadoPorId=${encodeURIComponent(eliminadoPorId)}`;
  const response = await api.delete<BaseResponse<void>>(url);
    return response.data;
  }
}
