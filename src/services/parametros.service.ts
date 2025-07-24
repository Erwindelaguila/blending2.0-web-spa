import api from "@/lib/api/client";
import { BaseResponse } from "@/interface";
import { IParametroRequest, IParametroResponse, IParametroGet } from "@/interface/admin/parametro";

export class ParametrosService {
  static async crear(data: IParametroRequest, creadoPorId: string): Promise<BaseResponse<IParametroResponse>> {
    const response = await api.post<BaseResponse<IParametroResponse>>(
      "/api/core/parametro", 
      { ...data, creadoPorId }
    );
    return response.data;
  }

  static async editar(id: string, data: IParametroRequest, modificadoPorId: string): Promise<BaseResponse<IParametroResponse>> {
    const response = await api.put<BaseResponse<IParametroResponse>>(
      "/api/core/parametro",
      { id, ...data, modificadoPorId }
    );
    return response.data;
  }

  static async eliminar(id: string, modificadoPorId: string): Promise<void> {
    await api.delete(`/api/core/parametro?id=${id}&modificadoPorId=${modificadoPorId}`);
  }

  static async listar(): Promise<IParametroGet[]> {
    const response = await api.get<BaseResponse<IParametroGet[]>>("/api/core/parametro");
    return response.data.data || [];
  }

  static async obtenerPorId(id: string): Promise<IParametroGet> {
    const response = await api.get<BaseResponse<IParametroGet>>(`/api/core/parametro/detail?id=${id}`);
    if (!response.data.data) {
      throw new Error("No se encontraron datos del parámetro");
    }
    return response.data.data;
  }
}
