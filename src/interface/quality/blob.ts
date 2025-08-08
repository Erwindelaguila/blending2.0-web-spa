export interface BlobUploadResultDto {
  fileName: string;
  downloadUrl: string;
  container: string;
  expiresAtUtc: string; // ISO date string (ej. "2025-08-03T15:30:45Z")
  sizeInBytes: number;
  contentType: string; 
  excelDataSap?:any
}