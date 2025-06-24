"use client";

import { Filter, TableConfiguracionApp } from "@/components";

export default function ConfiguracionAplicacionPage() {
  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <Filter></Filter>
        <TableConfiguracionApp></TableConfiguracionApp>
      </div>
    </>
  );
}
