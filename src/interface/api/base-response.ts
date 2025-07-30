
export interface BaseResponse<T> {
  data?: T;
  message?: string;
  statusCode?: number;
  succeeded?: boolean; 
  errors?: any;
  timestamp?: string;
}


