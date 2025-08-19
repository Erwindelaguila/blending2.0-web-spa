export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasPrevious?: boolean;
  hasNext?: boolean;
  previousPage?: number;
  nextPage?: number;
  pageSize?: number;
}

export interface PagedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}
export interface IPaginationBase {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  previousPage?: number | null;
  nextPage?: number | null;
}