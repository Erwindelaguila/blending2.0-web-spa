"use client";

import React, { useState, useEffect } from "react";
import { Button, Card, Divider, Input, Label, Dropdown, Option } from "@fluentui/react-components";
import { Title } from "@/components/ui/title";
import { DatePicker } from "@fluentui/react-datepicker-compat";
import { OrgColors } from "@/config/app.config.server";
import { datePickerStringsEs } from "@/utils/date";
import { Search24Regular, DismissCircle24Regular } from "@fluentui/react-icons";
import { useButtonsStyles } from "@/styles/button.styles";
import { useCalidadContext, CalidadFilters } from "./calidad-context";

export function CalidadFilter() {
  const stylebtn = useButtonsStyles();
  const { filters, setFilters, clearFilters } = useCalidadContext();

  const [localFilters, setLocalFilters] = useState<CalidadFilters>({
    codigo: filters.codigo || "",
    estado: filters.estado,
    fechaDesde: filters.fechaDesde || undefined,
  });

  useEffect(() => {
    setLocalFilters({
      codigo: filters.codigo || "",
      estado: filters.estado,
      fechaDesde: filters.fechaDesde || undefined,
    });
  }, [filters]);

  const estadoOptions = [
    { value: "", label: "Todos" },
    { value: "1", label: "Activos" },
    { value: "0", label: "Inactivos" },
  ];

  const handleCodigoChange = (e: React.ChangeEvent<HTMLInputElement>) => setLocalFilters(prev => ({ ...prev, codigo: e.target.value }));
  const handleCodigoKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter") handleFilter(); };
  const handleEstadoChange = (_: any, data: any) => setLocalFilters(prev => ({ ...prev, estado: data.optionValue === "" ? undefined : parseInt(data.optionValue) }));
  const handleFechaDesdeChange = (date: Date | null | undefined) => setLocalFilters(prev => ({ ...prev, fechaDesde: date || undefined }));

  const handleFilter = () => {
    const clean: CalidadFilters = {};
    if (localFilters.codigo?.trim()) clean.codigo = localFilters.codigo.trim();
    if (localFilters.estado !== undefined) clean.estado = localFilters.estado;
  if (localFilters.fechaDesde) clean.fechaDesde = localFilters.fechaDesde;
    setFilters(clean);
  };

  const handleClear = () => {
  setLocalFilters({ codigo: "", estado: undefined, fechaDesde: undefined });
    clearFilters();
  };

  return (
    <Card style={{ width: "100%", height: "100%" }}>
      <div className="w-full h-full">
        <div className="w-full h-full">
          <div className="w-full h-1/5">
            <Title title="Filtro" />
          </div>

          <div className="w-full flex h-4/5 justify-between">
            <div className="w-1/4 h-full pr-4 flex items-center ">
              <div className="flex flex-col justify-start w-full">
                <Label>Codigo</Label>
                <Input
                  style={{ width: "100%", border: `2px solid ${OrgColors.serotGris}` }}
                  value={localFilters.codigo}
                  onChange={handleCodigoChange}
                  onKeyDown={handleCodigoKeyDown}
                  placeholder="Buscar por código..."
                />
              </div>
            </div>

            <Divider vertical appearance="default" style={{ height: "80%", width: "1px", backgroundColor: OrgColors.serotGris }} />

            <div className="w-3/4 h-full flex items-center pl-4">
              <div className="w-1/2 flex gap-3 h-full items-center">
                <div className="flex flex-col">
                  <Label size="medium">Estado</Label>
                  <Dropdown
                    placeholder="Seleccione estado"
                    value={localFilters.estado !== undefined ? estadoOptions.find(opt => opt.value === localFilters.estado!.toString())?.label : estadoOptions.find(opt => opt.value === "")?.label || "Todos"}
                    onOptionSelect={handleEstadoChange}
                    style={{ border: `2px solid ${OrgColors.serotGris}`, minWidth: "180px" }}
                  >
                    {estadoOptions.map(o => (<Option key={o.value} value={o.value}>{o.label}</Option>))}
                  </Dropdown>
                </div>

                <div className="flex-1 flex items-center gap-4">
                  <div className="flex flex-col">
                    <Label size="medium">Fecha</Label>
                    <DatePicker size="medium" style={{ border: `2px solid ${OrgColors.serotGris}`, minWidth: "140px" }} placeholder="Buscar por fecha..." value={localFilters.fechaDesde || null} onSelectDate={handleFechaDesdeChange} formatDate={(d) => (d ? d.toLocaleDateString("es-ES") : "")} strings={datePickerStringsEs} />
                  </div>
                </div>
              </div>

              <div className="w-1/2 flex justify-end items-center pt-3 h-full gap-2">
                <Button size="large" icon={<DismissCircle24Regular />} appearance="secondary" className={`${stylebtn.buttonNaranjaBase}`} onClick={handleClear}>Limpiar</Button>
                <Button size="large" icon={<Search24Regular />} className={`w-[12rem] ${stylebtn.buttonAzulOscuroBase}`} onClick={handleFilter}>Filtrar</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
