
export interface ConfiguracionApp {
  codigo: number;
  nombre: string;
  descripcion: string;
  valores: string;
  activo: boolean;
}


const mockConfiguraciones: IConfiguracionAppResponse[] = [];

export interface IConfiguracionAppResponse extends ConfiguracionApp {
  id: number;
  fechaCreacion: string;
}

export class ConfiguracionAppService {
  static async crear(data: ConfiguracionApp): Promise<IConfiguracionAppResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    if (!data.codigo || isNaN(data.codigo)) {
      throw new Error("El código debe ser un número válido");
    }
    if (!data.nombre) {
      throw new Error("El nombre es requerido");
    }
    if (!data.valores) {
      throw new Error("El campo valores es requerido");
    }
    const nuevaConfiguracion: IConfiguracionAppResponse = {
      id: Math.floor(Math.random() * 10000) + 1,
      codigo: data.codigo,
      nombre: data.nombre.trim(),
      descripcion: data.descripcion?.trim() || '',
      valores: data.valores?.trim() || '',
      activo: data.activo,
      fechaCreacion: new Date().toISOString(),
    };
    mockConfiguraciones.push(nuevaConfiguracion);
    return nuevaConfiguracion;
  }
}
