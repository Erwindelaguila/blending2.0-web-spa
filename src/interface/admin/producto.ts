interface IProductoBase {
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export interface IProductoRequest {
  codigo: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  CalidadId: string;
  TipoProduccionId: string;
}

export interface IProductoUpdate extends IProductoRequest {
  id: string;
}

export interface IProductoResponse extends IProductoBase {
  id: string;
  activo: boolean;
  calidadId: string;
  tipoProduccionId: string;
  creadoPorId?: string;
  creadoEl?: string;
  modificadoPorId?: string | null;
  modificadoEl?: string | null;
}

import { PagedResponse, BaseFiltersParams } from "@/interface";
export type PagedProductoResponse = PagedResponse<IProductoResponse>;

export interface ProductoFiltersParams extends BaseFiltersParams {}

// Backend PascalCase envelope for list endpoints
export interface ProductoPaginationPascal {
  CurrentPage: number;
  TotalPages: number;
  PageSize: number;
  TotalCount: number;
  HasPrevious?: boolean;
  HasNext?: boolean;
  PreviousPage?: number | null;
  NextPage?: number | null;
}

// Nota: para consumir backend PascalCase directamente, usamos esta variante
export interface PagedProductoBackendResponse {
  Data: Array<{
    Id: string;
    Codigo: string;
    Nombre: string;
    Descripcion?: string;
    Activo: boolean;
    CalidadId: string;
    TipoProduccionId: string;
    CreadoPorId?: string;
    CreadoEl?: string;
    ModificadoPorId?: string | null;
    ModificadoEl?: string | null;
  }>;
  Pagination: ProductoPaginationPascal;
}
