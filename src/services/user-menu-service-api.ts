import api from "@/lib/api/client";
import { BaseResponse, UserMenuData } from "@/interface";
import { getUserMenuKey } from "@/lib/constants/key-fetch";

export class UserMenuServiceAPI {
  static async getUserMenu(): Promise<BaseResponse<UserMenuData>> {
    try {
      const response = await api.get<BaseResponse<UserMenuData>>(getUserMenuKey());
      return response.data;
    } catch (error) {
      throw new Error(`Error al obtener el menú del usuario: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
}
