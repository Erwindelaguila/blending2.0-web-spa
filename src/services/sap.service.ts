import { api } from "@/lib/api";

export class SapService {
  static async getSapData(url: string, fileName?: string): Promise<any> {
    const query = fileName ? `?fileName=${fileName}` : "";
    const fullUrl = `${url}${query}`;
    const response = await api.get<any>(fullUrl);
    return response.data;
  }
}
