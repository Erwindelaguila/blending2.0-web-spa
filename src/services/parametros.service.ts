import api from "@/lib/api/client";
import { IS_MOCK_MODE } from "@/lib/constants/env";

export interface IParametroRequest {
  codigo: number; 
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export interface IParametroResponse {
  id: number;
  codigo: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  fechaCreacion: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
const mockParametros: IParametroResponse[] = [];

export class ParametrosService {
  private static readonly ENDPOINT = '/parametros';

  static async crear(data: IParametroRequest): Promise<IParametroResponse> {
    if (IS_MOCK_MODE) {
      return this.mockCrear(data);
    }

    try {
      const response = await api.post<ApiResponse<IParametroResponse>>(
        `${this.ENDPOINT}/create`, 
        data
      );
      
      return response.data.data;
    } catch (error: any) {

      const errorMessage = error.response?.data?.message || 'Error al crear el parámetro';
      throw new Error(errorMessage);
    }
  }

  private static async mockCrear(data: IParametroRequest): Promise<IParametroResponse> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Validaciones de backend simuladas
    if (isNaN(data.codigo) || !Number.isInteger(data.codigo)) {
      throw new Error('El código debe ser un número entero válido');
    }

    if (data.codigo < 0) {
      throw new Error('El código debe ser un número positivo');
    }

    if (!data.nombre || data.nombre.trim().length === 0) {
      throw new Error('El nombre es requerido');
    }

    if (data.nombre.trim().length < 3) {
      throw new Error('El nombre debe tener al menos 3 caracteres');
    }

    const nuevoParametro: IParametroResponse = {
      id: Math.floor(Math.random() * 1000) + 1,
      codigo: data.codigo,
      nombre: data.nombre.trim(),
      descripcion: data.descripcion?.trim() || '',
      activo: data.activo,
      fechaCreacion: new Date().toISOString()
    };
    mockParametros.push(nuevoParametro);

    return nuevoParametro;
  }
}
