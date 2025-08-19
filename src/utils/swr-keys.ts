
export const buildPaginatedSWRKey = (
  module: string,
  page: number,
  size: number,
  filters?: Record<string, any>
): string => {
  const params = new URLSearchParams();
  params.set('page', page.toString());
  params.set('size', size.toString());
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, value.toString());
      }
    });
  }
  
  return `${module}-${params.toString()}`;
};
