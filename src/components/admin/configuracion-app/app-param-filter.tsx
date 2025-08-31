"use client";

import React, { useEffect, useState } from 'react';
import { Button, Card, Divider, Input, Label, Dropdown, Option } from "@fluentui/react-components";
import { Title } from "@/components/ui/title";
import { DatePicker } from "@fluentui/react-datepicker-compat";
import { OrgColors } from "@/config/app.config.server";
import { Search24Regular, DismissCircle24Regular } from "@fluentui/react-icons";
import { useButtonsStyles } from "@/styles/button.styles";
import { useAppParamContext } from './app-param-context';
import { IAppParamFilters } from '@/interface/admin/app-param';
import { datePickerStringsEs } from '@/utils/date';


export function AppParamFilter() {
  const stylebtn = useButtonsStyles();
  const { filters, setFilters, clearFilters } = useAppParamContext();

  const [localFilters, setLocalFilters] = useState<IAppParamFilters>({
    key: filters.key || "",
    isActive: filters.isActive,
    fecha: filters.fecha || "",
  });

  useEffect(() => {
    setLocalFilters({
      key: filters.key || "",
      isActive: filters.isActive,
      fecha: filters.fecha || "",
    });
  }, [filters]);

  const estadoOptions = [
    { value: "", label: "Todos" },
    { value: "true", label: "Activos" },
    { value: "false", label: "Inactivos" },
  ];

  const handleKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters((prev) => ({ ...prev, key: event.target.value }));
  };

  const handleKeyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleFilter();
    }
  };

  const handleEstadoChange = (_event: any, data: any) => {
    const boolValue = data.optionValue === "" ? undefined : data.optionValue === "true";
    setLocalFilters((prev) => ({ ...prev, isActive: boolValue }));
  };

  
  const formatLocalDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const parseLocalDateString = (s: string): Date | null => {
    if (!s) return null;
    const [y, m, d] = s.split('-').map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d); // fecha local sin desplazamiento
  };

  const handleFechaChange = (date: Date | null | undefined) => {
    const fechaString = date ? formatLocalDate(date) : "";
    setLocalFilters((prev) => ({ ...prev, fecha: fechaString }));
  };

  const handleFilter = () => {
    const cleanedFilters: IAppParamFilters = {};
    if (localFilters.key && localFilters.key.trim()) cleanedFilters.key = localFilters.key.trim();
    if (localFilters.isActive !== undefined) cleanedFilters.isActive = localFilters.isActive;
    if (localFilters.fecha && localFilters.fecha.trim()) cleanedFilters.fecha = localFilters.fecha.trim();
    setFilters(cleanedFilters);
  };

  const handleClear = () => {
    const emptyFilters = { key: "", isActive: undefined, fecha: "" };
    setLocalFilters(emptyFilters);
    clearFilters();
  };

  return (
    <Card style={{ width: "100%", height: "100%" }}>
      <div className="w-full h-full">
        <div className="w-full h-full">
          <div className="w-full h-1/5"><Title title="Filtro" /></div>
          <div className="w-full flex h-4/5 justify-between">
            <div className="w-1/4 h-full pr-4 flex items-center ">
              <div className="flex flex-col justify-start w-full">
                <Label>Código</Label>
                <Input
                  style={{ width: "100%", border: `2px solid ${OrgColors.serotGris}` }}
                  value={localFilters.key || ""}
                  onChange={handleKeyChange}
                  onKeyDown={handleKeyKeyDown}
                  placeholder="Buscar por código..."
                />
              </div>
            </div>

            <Divider vertical appearance="default" style={{ height: '80%', width: '1px', backgroundColor: OrgColors.serotGris }} />

            <div className="w-3/4 h-full flex items-center pl-4">
              <div className="w-1/2 flex gap-3 h-full items-center">
                <div className="flex flex-col">
                  <Label size="medium">Estado</Label>
                  <Dropdown
                    placeholder="Seleccione estado"
                    value={
                      localFilters.isActive !== undefined
                        ? estadoOptions.find((opt) => opt.value === String(localFilters.isActive))?.label
                        : estadoOptions.find((opt) => opt.value === "")?.label || "Todos"
                    }
                    onOptionSelect={handleEstadoChange}
                    style={{ border: `2px solid ${OrgColors.serotGris}`, minWidth: "180px" }}
                  >
                    {estadoOptions.map((option) => (
                      <Option key={option.value} value={option.value}>{option.label}</Option>
                    ))}
                  </Dropdown>
                </div>
                
                <div className="flex-1 flex items-center gap-4">
                  <div className="flex flex-col">
                    <Label size="medium">Fecha</Label>
                    <DatePicker
                      size="medium"
                      style={{ border: `2px solid ${OrgColors.serotGris}`, minWidth: "140px" }}
                      placeholder="Buscar por fecha..."
                      value={localFilters.fecha ? parseLocalDateString(localFilters.fecha) : null}
                      onSelectDate={handleFechaChange}
                      formatDate={(date) => (date ? date.toLocaleDateString('es-ES') : '')}
                      strings={datePickerStringsEs}
                    />
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
