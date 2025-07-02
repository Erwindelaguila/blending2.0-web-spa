export interface IPlantaRequest {
  codigo: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export interface IPlantaResponse {
  id: number;
  codigo: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  fechaCreacion: string;
}

const mockPlantas: IPlantaResponse[] = [];

export class PlantasService {
  static async crear(data: IPlantaRequest): Promise<IPlantaResponse> {
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
    if (mockPlantas.some(p => p.codigo === data.codigo)) {
      throw new Error(`Ya existe una planta con el código ${data.codigo}`);
    }

    const nuevaPlanta: IPlantaResponse = {
      id: Math.floor(Math.random() * 10000) + 1,
      codigo: data.codigo,
      nombre: data.nombre.trim(),
      descripcion: data.descripcion?.trim() || '',
      activo: data.activo,
      fechaCreacion: new Date().toISOString()
    };
    mockPlantas.push(nuevaPlanta);
    return nuevaPlanta;
  }
}
