export interface IPaginationBase {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  // Ejemplo de uso con nueva estructura completa del backend:
  // const response = await AgregadoService.listar(page, pageSize);
  // const items = response.data.data; // Los registros están en data.data
  // const pagination = response.data.pagination; // La info de paginación está en data.pagination
  // const currentPage = pagination.currentPage;
  // const totalPages = pagination.totalPages;
  // const totalCount = pagination.totalCount;
  // const hasNext = pagination.hasNext;
  // const hasPrevious = pagination.hasPrevious;
  // const nextPage = pagination.nextPage;
  // const previousPage = pagination.previousPage;
  hasPrevious?: boolean;
  hasNext?: boolean;
  previousPage?: number | null;
  nextPage?: number | null;
}