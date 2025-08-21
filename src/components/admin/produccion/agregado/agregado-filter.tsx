"use client";

import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Divider,
  Input,
  Label,
  Dropdown,
  Option,
} from "@fluentui/react-components";
import { Title } from "@/components/ui/title";
import { DatePicker } from "@fluentui/react-datepicker-compat";
import { OrgColors } from "@/config/app.config.server";
import { datePickerStringsEs } from "@/utils/date";
import { Search24Regular, DismissCircle24Regular } from "@fluentui/react-icons";
import { useButtonsStyles } from "@/styles/button.styles";
import { useAgregadoContext, AgregadoFilters } from './agregado-context';

export function AgregadoFilter() {
  const stylebtn = useButtonsStyles();
  const { filters, setFilters, clearFilters } = useAgregadoContext();
  
  const [localFilters, setLocalFilters] = useState<AgregadoFilters>({
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

  const handleCodigoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters(prev => ({ ...prev, codigo: event.target.value }));
  };

  const handleCodigoKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleFilter();
    }
  };

  const handleEstadoChange = (_event: any, data: any) => {
    const numValue = data.optionValue === "" ? undefined : parseInt(data.optionValue);
    setLocalFilters(prev => ({ ...prev, estado: numValue }));
  };

  const handleFechaDesdeChange = (date: Date | null | undefined) => {
    setLocalFilters(prev => ({ ...prev, fechaDesde: date || undefined }));
  };

  const handleFilter = () => {
    const cleanFilters: AgregadoFilters = {};
    
    if (localFilters.codigo && localFilters.codigo.trim()) {
      cleanFilters.codigo = localFilters.codigo.trim();
    }
    if (localFilters.estado !== undefined) {
      cleanFilters.estado = localFilters.estado; // 1=activos, 0=inactivos, undefined=todos
    }
    if (localFilters.fechaDesde) {
      cleanFilters.fechaDesde = localFilters.fechaDesde;
    }

  setFilters(cleanFilters);
  };

  const handleClear = () => {
    const emptyFilters = {
      codigo: "",
      estado: undefined,
      fechaDesde: undefined,
    };
    setLocalFilters(emptyFilters);
    clearFilters();
  };

  return (
    <Card style={{ width: "100%", height: "100%" }}>
      <div className="w-full h-full">
        <div className="w-full h-full">
          <div className="w-full h-1/5">
            <Title title="Filtro"></Title>
          </div>

          <div className="w-full flex h-4/5 justify-between">
            <div className="w-1/4 h-full pr-4 flex items-center ">
              <div className="flex flex-col justify-start w-full">
                <Label>Codigo</Label>
                <Input
                  style={{
                    width: "100%",
                    border: `2px solid ${OrgColors.serotGris}`,
                  }}
                  value={localFilters.codigo}
                  onChange={handleCodigoChange}
                  onKeyDown={handleCodigoKeyDown}
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
                    value={localFilters.estado !== undefined ? 
                      estadoOptions.find(opt => opt.value === localFilters.estado!.toString())?.label 
                      : estadoOptions.find(opt => opt.value === "")?.label || "Todos"
                    }
                    onOptionSelect={handleEstadoChange}
                    style={{
                      border: `2px solid ${OrgColors.serotGris}`,
                      minWidth: "180px"
                    }}
                  >
                    {estadoOptions.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Dropdown>
                </div>
                
                <div className="flex-1 flex items-center gap-4">
                  <div className="flex flex-col">
                    <Label size="medium">Fecha </Label>
                    <DatePicker
                      size="medium"
                      style={{
                        border: `2px solid ${OrgColors.serotGris}`,
                        minWidth: "140px"
                      }}
                      placeholder="Buscar por fecha..."
                      value={localFilters.fechaDesde || null}
                      onSelectDate={handleFechaDesdeChange}
                      formatDate={(date) => date ? date.toLocaleDateString('es-ES') : ''}
                      strings={datePickerStringsEs}
                    />
                  </div>
                </div>
              </div>

              <div className="w-1/2 flex justify-end items-center pt-3 h-full gap-2">
                <Button
                  size="large"
                  icon={<DismissCircle24Regular />}
                  appearance="secondary"
                  className={`${stylebtn.buttonNaranjaBase}`}
                  onClick={handleClear}
                >
                  Limpiar
                </Button>
                
                <Button
                  size="large"
                  icon={<Search24Regular />}
                  className={`w-[12rem] ${stylebtn.buttonAzulOscuroBase}`}
                  onClick={handleFilter}
                >
                  Filtrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
