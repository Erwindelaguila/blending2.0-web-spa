"use client";

import { Filter, TableValoresCalidad } from "@/components";

export default function ValoresCalidadPage() {
  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <Filter></Filter>
        <TableValoresCalidad></TableValoresCalidad>
      </div>
    </>
  );
}
