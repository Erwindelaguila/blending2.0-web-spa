"use client";

import { Filter, TableParametros } from "@/components";

export default function ParametrosCalidadPage() {
  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <Filter></Filter>
        <TableParametros></TableParametros>
      </div>
    </>
  );
}
