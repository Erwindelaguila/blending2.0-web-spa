import { BaseResponse } from "@/interface";
import { 
  IMatrizCalidadParametros, 
  ICalidadParametroUpsertRequest, 
  ICalidadParametroUpsertResponse,
  ICalidadParametroUpsertBatchRequest,
  ICalidadParametroUpsertBatchResponse
} from "@/interface/admin/calidad-parametros";
import { api } from "@/lib/api";
import { 
  getCalidadParametrosMatrizKey, 
  getCalidadParametrosPorCalidadKey, 
  upsertCalidadParametrosKey 
} from "@/lib/constants/key-fetch";

export class CalidadParametrosService {
  static async obtenerMatriz(): Promise<BaseResponse<IMatrizCalidadParametros>> {
    const response = await api.get<BaseResponse<IMatrizCalidadParametros>>(getCalidadParametrosMatrizKey());
    return response.data;
  }

  static async obtenerMatrizPorCalidad(codigoCalidad: string): Promise<BaseResponse<IMatrizCalidadParametros>> {
    const response = await api.get<BaseResponse<IMatrizCalidadParametros>>(getCalidadParametrosPorCalidadKey(codigoCalidad));
    return response.data;
  }

  static async upsertValor(data: ICalidadParametroUpsertRequest): Promise<BaseResponse<ICalidadParametroUpsertResponse>> {
    const response = await api.post<BaseResponse<ICalidadParametroUpsertResponse>>(upsertCalidadParametrosKey(), data);
    return response.data;
  }

  static async upsertValoresBatch(cambios: ICalidadParametroUpsertRequest[]): Promise<BaseResponse<ICalidadParametroUpsertBatchResponse>> {
    const batchPayload: ICalidadParametroUpsertBatchRequest = {
      cambios
    };
    
    const response = await api.post<BaseResponse<ICalidadParametroUpsertBatchResponse>>(upsertCalidadParametrosKey(), batchPayload);
    return response.data;
  }
}
