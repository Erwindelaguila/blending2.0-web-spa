"use client";

import { Filter, TableCalidades } from "@/components";
;

export default function CalidadesPage() {
  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <Filter></Filter>
        <TableCalidades></TableCalidades>
      </div>
    </>
  );
}
