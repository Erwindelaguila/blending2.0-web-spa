export interface ICalidadRequest {
  codigo: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export interface ICalidadResponse {
  id: number;
  codigo: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  fechaCreacion: string;
}

const mockCalidades: ICalidadResponse[] = [];

export class CalidadesService {
  static async crear(data: ICalidadRequest): Promise<ICalidadResponse> {
    await new Promise(resolve => setTimeout(resolve, 1200));

    if (isNaN(data.codigo) || !Number.isInteger(data.codigo)) {
      throw new Error('El código debe ser un número entero válido');
    }
    if (data.codigo < 0) {
      throw new Error('El código debe ser un número positivo');
    }
    if (!data.nombre || data.nombre.trim().length < 3) {
      throw new Error('El nombre debe tener al menos 3 caracteres');
    }
    if (mockCalidades.some(c => c.codigo === data.codigo)) {
      throw new Error(`Ya existe una calidad con el código ${data.codigo}`);
    }

    const nuevaCalidad: ICalidadResponse = {
      id: Math.floor(Math.random() * 10000) + 1,
      codigo: data.codigo,
      nombre: data.nombre.trim(),
      descripcion: data.descripcion?.trim() || '',
      activo: data.activo,
      fechaCreacion: new Date().toISOString()
    };
    mockCalidades.push(nuevaCalidad);
    return nuevaCalidad;
  }
}
