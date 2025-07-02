export interface ICalidadRequest {
  codigo: string;
  nombre: string;
  codigoMaterial: string;
  descripcion: string;
  activo: boolean;
  conforme: boolean;
}

export interface ICalidadResponse {
  id: number;
  codigo: string;
  nombre: string;
  codigoMaterial: string;
  descripcion: string;
  activo: boolean;
  conforme: boolean;
  fechaCreacion: string;
}

// ============================================
// IMPORTS  
// ============================================

import api from '@/lib/api/client'; 

// ============================================
// SERVICIO DE CALIDADES  
// ============================================

export class CalidadesService {
  /**
   * Crear una nueva calidad
   * @param data - Datos de la calidad a crear
   * @returns Promise<ICalidadResponse>
   */
  static async crear(data: ICalidadRequest): Promise<ICalidadResponse> {
    try {
      const response = await api.post<ICalidadResponse>('/api/calidades', data);
      return response.data;
    } catch (error: any) {
      throw error; 
    }
  }
  /**
   * Eliminar una calidad por ID
   * @param id - ID de la calidad a eliminar
   * @returns Promise<void>
   */
  static async eliminar(id: number): Promise<void> {
    await api.delete(`/api/calidades/${id}`);
  }

  /**
   * Editar una calidad existente
   * @param id - ID de la calidad a editar
   * @param data - Nuevos datos de la calidad
   * @returns Promise<ICalidadResponse>
   */
  static async editar(id: number, data: ICalidadRequest): Promise<ICalidadResponse> {
    const response = await api.put<ICalidadResponse>(`/api/calidades/${id}`, data);
    return response.data;
  }

  /**
   * Obtener todas las calidades
   * @returns Promise<ICalidadResponse[]>
   */
  static async listar(): Promise<ICalidadResponse[]> {
    const response = await api.get<ICalidadResponse[]>('/api/calidades');
    return response.data;
  }

  /**
   * Obtener una calidad por ID
   * @param id - ID de la calidad
   * @returns Promise<ICalidadResponse>
   */
  static async obtenerPorId(id: number): Promise<ICalidadResponse> {
    const response = await api.get<ICalidadResponse>(`/api/calidades/${id}`);
    return response.data;
  }
}
