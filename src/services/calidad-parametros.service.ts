import { BaseResponse } from "@/interface";
import { 
  IMatrizCalidadParametros, 
  ICalidadParametroUpsertRequest, 
  ICalidadParametroUpsertResponse,
  ICalidadParametroUpsertBatchRequest,
  ICalidadParametroUpsertBatchResponse
} from "@/interface/admin/calidad-parametros";
import { api } from "@/lib/api";
import { withCreateAudit, withUpdateAudit } from "./audit.util";

const BASE_URL = "/api/core/configuraciones/calidadparametro";

export class CalidadParametrosService {
  static async obtenerMatriz(): Promise<BaseResponse<IMatrizCalidadParametros>> {
    const response = await api.get<BaseResponse<IMatrizCalidadParametros>>(`${BASE_URL}/matriz`);
    return response.data;
  }

  static async upsertValor(data: ICalidadParametroUpsertRequest): Promise<BaseResponse<ICalidadParametroUpsertResponse>> {
    const payload: any = withUpdateAudit(data as any);
    delete payload.creadoPorId;
    delete payload.modificadoPorId;
    
    const response = await api.post<BaseResponse<ICalidadParametroUpsertResponse>>(`${BASE_URL}/upsert`, payload);
    return response.data;
  }

  static async upsertValoresBatch(cambios: ICalidadParametroUpsertRequest[]): Promise<BaseResponse<ICalidadParametroUpsertBatchResponse>> {
    const batchPayload: ICalidadParametroUpsertBatchRequest = {
      cambios
    };
    
    const payload: any = withUpdateAudit(batchPayload as any);
    delete payload.creadoPorId;
    delete payload.modificadoPorId;
    
    const response = await api.post<BaseResponse<ICalidadParametroUpsertBatchResponse>>(`${BASE_URL}/upsert`, payload);
    return response.data;
  }
}
