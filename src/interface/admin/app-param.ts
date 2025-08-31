import { BaseFiltersParams } from '@/interface/components/filters';

export interface IAppParam {
  key: string;
  value: string;
  description?: string;
  isActive: boolean;
  category?: string;
  group?: string;
  isInternal: boolean;
  isVisible: boolean;
  isDisableable: boolean;
  isRemovable: boolean;
  creadoPorId: string;
  creadoEl: string;
  modificadoPorId?: string;
  modificadoEl?: string;
}

export interface IAppParamCreateRequest {
  key: string;
  value: string;
  description?: string;
  isActive?: boolean;
}

export interface IAppParamUpdateRequest {
  key?: string;
  value: string;
  description?: string;
  isActive?: boolean;
}

export interface IAppParamFilters extends BaseFiltersParams {
  key?: string;
  isActive?: boolean;
  fecha?: string;
}

export interface AppParamPagedItemsResponse {
  items: IAppParam[];
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
    previousPage: number | null;
    nextPage: number | null;
  };
}
