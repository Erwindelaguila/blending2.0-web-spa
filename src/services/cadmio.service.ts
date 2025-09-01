import { BaseResponse } from "@/interface";
import { api } from "@/lib/api";

export class CadmioService {
  static async obtener(rumas: string[]): Promise<BaseResponse<any>> {
    const response = await api.post<BaseResponse<any>>(`/api/upload/get-cadmio-rumas`, {
      rumas,
    });
    return response.data;
  }
}
