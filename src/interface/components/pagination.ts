
export interface IPaginationBase {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};