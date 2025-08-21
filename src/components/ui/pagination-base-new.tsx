import { OrgColors } from "@/config/app.config.server";
import { IPaginationBase } from "@/interface";
import { Button } from "@fluentui/react-components";
import React, { useMemo } from "react";

export const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  pageNumbers,
  hasPrevious,
  hasNext,
  previousPage,
  nextPage,
}: IPaginationBase) => {
  
  const renderPageNumbers = useMemo(() => {
    // Si el backend nos da pageNumbers específicos, los usamos
    if (pageNumbers && pageNumbers.length > 0) {
      return pageNumbers;
    }

    // Si no, generamos la lógica de paginación con puntos suspensivos
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para páginas con puntos suspensivos
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);

      // Siempre mostrar página 1
      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push('...');
        }
      }

      // Páginas alrededor de la actual
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Siempre mostrar última página
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }

    return pages;
  }, [pageNumbers, totalPages, currentPage]);

  return (
    <div className="w-full h-full flex justify-between items-center select-none">
      <div>
        <span className="font-semibold text-md">Total: {totalItems}</span>
      </div>
      <div className="flex items-center justify-end mt-3 gap-2">
        <Button
          appearance="secondary"
          className="px-3 py-1 rounded text-sm disabled:opacity-50"
          onClick={() => {
            if (hasPrevious !== undefined) {
              // Usar datos del backend si están disponibles
              if (hasPrevious && previousPage) {
                onPageChange(previousPage);
              }
            } else {
              // Fallback a lógica local
              if (currentPage > 1) {
                onPageChange(currentPage - 1);
              }
            }
          }}
          disabled={hasPrevious !== undefined ? !hasPrevious : currentPage <= 1}
        >
          Anterior
        </Button>
        
        <div className="flex items-center gap-1">
          {renderPageNumbers.map((pageNum, index) => {
            if (pageNum === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-1 text-sm text-gray-500"
                >
                  ...
                </span>
              );
            }
            
            const page = pageNum as number;
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                style={
                  page === currentPage
                    ? { backgroundColor: OrgColors.verde, color: "#fff" }
                    : { backgroundColor: "#f3f4f6", color: "#000" }
                }
                className={`px-3 py-1 rounded text-sm cursor-pointer hover:bg-gray-300 transition-colors ${
                  page === currentPage ? 'hover:bg-opacity-80' : ''
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>
        
        <Button
          appearance="secondary"
          className="px-3 py-1 rounded text-sm disabled:opacity-50"
          onClick={() => {
            if (hasNext !== undefined) {
              // Usar datos del backend si están disponibles
              if (hasNext && nextPage) {
                onPageChange(nextPage);
              }
            } else {
              // Fallback a lógica local
              if (currentPage < totalPages) {
                onPageChange(currentPage + 1);
              }
            }
          }}
          disabled={hasNext !== undefined ? !hasNext : currentPage >= totalPages}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};
