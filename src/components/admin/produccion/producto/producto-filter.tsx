"use client";

import React, { useEffect, useState } from 'react';
import { Button, Card, Divider, Input, Label, Dropdown, Option } from "@fluentui/react-components";
import { Title } from "@/components/ui/title";
import { DatePicker } from "@fluentui/react-datepicker-compat";
import { OrgColors } from "@/config/app.config.server";
import { Search24Regular, DismissCircle24Regular } from "@fluentui/react-icons";
import { useButtonsStyles } from "@/styles/button.styles";
import { useProductoContext, ProductoFilters } from './producto-context';

export function ProductoFilter() {
  const stylebtn = useButtonsStyles();
  const { filters, setFilters, clearFilters } = useProductoContext();
  
  const [localFilters, setLocalFilters] = useState<ProductoFilters>({
    codigo: filters.codigo || "",
    estado: filters.estado,
    fechaInicio: filters.fechaInicio || undefined,
    fechaFin: filters.fechaFin || undefined,
    tipoFecha: filters.tipoFecha || undefined,
  });

  useEffect(() => {
    setLocalFilters({
      codigo: filters.codigo || "",
      estado: filters.estado,
      fechaInicio: filters.fechaInicio || undefined,
      fechaFin: filters.fechaFin || undefined,
      tipoFecha: filters.tipoFecha || undefined,
    });
  }, [filters]);

  const estadoOptions = [
    { value: "", label: "Todos" },
    { value: "1", label: "Activos" },
    { value: "0", label: "Inactivos" },
  ];

  const fechaTipoOptions = [
    { value: "creados", label: "Creados" },
    { value: "modificados", label: "Modificados" },
  ];

  const handleCodigoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters(prev => ({ ...prev, codigo: event.target.value }));
  };
  const handleCodigoKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') handleFilter();
  };
  const handleEstadoChange = (_event: any, data: any) => {
    const numValue = data.optionValue === "" ? undefined : parseInt(data.optionValue);
    setLocalFilters(prev => ({ ...prev, estado: numValue }));
  };
  const handleFechaTipoChange = (_event: any, data: any) => {
    const selected = data.optionValue;
    setLocalFilters(prev => ({ ...prev, tipoFecha: selected }));
  };
  const handleFechaInicioChange = (date: Date | null | undefined) => {
    setLocalFilters(prev => ({ ...prev, fechaInicio: date || undefined }));
  };
  const handleFechaFinChange = (date: Date | null | undefined) => {
    setLocalFilters(prev => ({ ...prev, fechaFin: date || undefined }));
  };
  const handleFilter = () => {
    const clean: ProductoFilters = {};
    if (localFilters.codigo && localFilters.codigo.trim()) clean.codigo = localFilters.codigo.trim();
    if (localFilters.estado !== undefined) clean.estado = localFilters.estado;
    if (localFilters.fechaInicio) clean.fechaInicio = localFilters.fechaInicio;
    if (localFilters.fechaFin) clean.fechaFin = localFilters.fechaFin;
    if (localFilters.tipoFecha) clean.tipoFecha = localFilters.tipoFecha;
    else if (localFilters.fechaInicio || localFilters.fechaFin) clean.tipoFecha = 'creados';
    setFilters(clean);
  };
  const handleClear = () => {
    setLocalFilters({ codigo: "", estado: undefined, fechaInicio: undefined, fechaFin: undefined, tipoFecha: undefined });
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
                  style={{ width: "100%", border: `2px solid ${OrgColors.serotGris}` }}
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
                    style={{ border: `2px solid ${OrgColors.serotGris}`, minWidth: "180px" }}
                  >
                    {estadoOptions.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Dropdown>
                </div>

                <Divider vertical appearance="default" style={{ height: '80%', width: '3px', backgroundColor: OrgColors.serotGris }} />

                <div className="flex-1 flex items-center gap-4">
                  <div className="flex flex-col">
                    <Label size="medium">Fecha Desde</Label>
                    <DatePicker
                      size="medium"
                      style={{ border: `2px solid ${OrgColors.serotGris}`, minWidth: "140px" }}
                      placeholder="Desde"
                      value={localFilters.fechaInicio || null}
                      onSelectDate={handleFechaInicioChange}
                      formatDate={(date) => date ? date.toLocaleDateString('es-ES') : ''}
                    />
                  </div>

                  <div className="flex flex-col">
                    <Label size="medium">Fecha Hasta</Label>
                    <DatePicker
                      size="medium"
                      style={{ border: `2px solid ${OrgColors.serotGris}`, minWidth: "140px" }}
                      placeholder="Hasta"
                      value={localFilters.fechaFin || null}
                      onSelectDate={handleFechaFinChange}
                      formatDate={(date) => date ? date.toLocaleDateString('es-ES') : ''}
                    />
                  </div>

                  <div className="flex flex-col">
                    <Label size="medium">Tipo Fecha</Label>
                    <Dropdown
                      placeholder="Seleccione tipo"
                      value={fechaTipoOptions.find(opt => opt.value === localFilters.tipoFecha)?.label || ""}
                      onOptionSelect={handleFechaTipoChange}
                      style={{ border: `2px solid ${OrgColors.serotGris}`, minWidth: "160px" }}
                    >
                      {fechaTipoOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Dropdown>
                  </div>
                </div>
              </div>

              <div className="w-1/2 flex justify-end items-center pt-3 h-full gap-2">
                <Button size="large" icon={<DismissCircle24Regular />} appearance="secondary" className={`${stylebtn.buttonNaranjaBase}`} onClick={handleClear}>Limpiar</Button>
                <Button size="large" icon={<Search24Regular />} className={`${stylebtn.buttonAzulOscuroBase} `} onClick={handleFilter}>Filtrar</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
