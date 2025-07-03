
export interface BaseResponse<T> {
  data?: T;
  message?: string;
  statusCode?: number;
  success?: boolean;
  timestamp?: string;
}
