import { api } from "@/lib/api";

export class ExcelService {
  static async uploadExcelCalidad(file: File): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/api/upload/upload-excel-quality", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  static async uploadExcelLogistica(file: File): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);

    console.log("Uploading file to logistics service:", file);
    console.log("Form data:", formData);
    const response = await api.post("/api/upload/upload-excel-logistics", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
}
