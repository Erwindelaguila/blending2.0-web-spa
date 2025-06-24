import { OrgColors } from "@/config/app.config.server";
import { IPaginationBase } from "@/interface";
import { Button } from "@fluentui/react-components";
import React from "react";

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: IPaginationBase) => {
  const getPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <span className="font-semibold text-md">TOTAL: 180</span>
      </div>
      <div className="flex items-center justify-end mt-3 gap-2 ">
        <Button
          className="px-3 py-1 rounded  hover:bg-gray-300 text-sm disabled:opacity-50"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>
        <div className="flex items-center gap-1">
          {getPages().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              style={
                page === currentPage
                  ? { backgroundColor: OrgColors.verde, color: "#fff" }
                  : { backgroundColor: "#f3f4f6", color: "#000" }
              }
              className={`px-3 py-1 rounded text-sm cursor-pointer hover:bg-gray-300`}
            >
              {page}
            </button>
          ))}
        </div>

        <Button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm disabled:opacity-50"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};
