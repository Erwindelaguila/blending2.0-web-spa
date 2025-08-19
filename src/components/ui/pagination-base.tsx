import { OrgColors } from "@/config/app.config.server";
import { IPaginationBase } from "@/interface";
import { Button } from "@fluentui/react-components";
import React, { useMemo } from "react";

export const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  hasPrevious,
  hasNext,
  previousPage,
  nextPage,
}: IPaginationBase) => {
  
  const renderPageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica mejorada para evitar parpadeo en transiciones
      pages.push(1); // Siempre mostrar primera página

      if (currentPage <= 3) {
        // Páginas iniciales: 1 2 3 4 ... último
        for (let i = 2; i <= Math.min(4, totalPages - 1); i++) {
          pages.push(i);
        }
        if (totalPages > 4) {
          pages.push("...");
          pages.push(totalPages);
        }
      } else if (currentPage >= totalPages - 2) {
        // Páginas finales: 1 ... (n-3) (n-2) (n-1) n
        pages.push("...");
        for (let i = Math.max(2, totalPages - 3); i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Páginas del medio: 1 ... (current-1) current (current+1) ... último
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

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
            if (pageNum === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 py-1 text-sm text-gray-500 select-none"
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
                  page === currentPage ? "font-semibold" : ""
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
