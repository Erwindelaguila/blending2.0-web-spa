import { BaseResponse } from "@/interface";
import { IAgregado, IAgregadoSend, IAgregadoUpdate } from "@/interface/admin/agregado";
import { api } from "@/lib/api";
import { getAllAgregadoKey } from "@/lib/constants/key-fetch";

export class AgregadoService {

  static async listar(url: any): Promise<BaseResponse<IAgregado[]>> {
    const response = await api.get<BaseResponse<IAgregado[]>>(url);
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


}
