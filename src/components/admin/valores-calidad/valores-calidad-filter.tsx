"use client";

import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Label } from "@fluentui/react-components";
import { Title } from "@/components/ui/title";
import { OrgColors } from "@/config/app.config.server";
import { DismissCircle24Regular } from "@fluentui/react-icons";
import { useButtonsStyles } from "@/styles/button.styles";
import { useValoresCalidadContext, ValoresCalidadFilters } from './valores-calidad-context';

export function ValoresCalidadFilter() {
  const stylebtn = useButtonsStyles();
  const { filters, setFilters, clearFilters } = useValoresCalidadContext();

  const [localFilters, setLocalFilters] = useState<ValoresCalidadFilters>({
    codigoCalidad: filters.codigoCalidad || "",
  });

  useEffect(() => {
    setLocalFilters({
      codigoCalidad: filters.codigoCalidad || "",
    });
  }, [filters]);

  const handleCodigoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters((prev: ValoresCalidadFilters) => ({ ...prev, codigoCalidad: event.target.value }));
  };

  const handleCodigoKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleFilter();
    }
  };

  const handleFilter = () => {
    const cleanFilters: ValoresCalidadFilters = {};
    if (localFilters.codigoCalidad && localFilters.codigoCalidad.trim()) {
      cleanFilters.codigoCalidad = localFilters.codigoCalidad.trim();
    }
    setFilters(cleanFilters);
  };

  const handleClear = () => {
    const emptyFilters = {
      codigoCalidad: "",
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


          <div className="w-full flex h-4/5 items-center">
            <div className="flex items-center gap-2 w-full">
              <div className="flex flex-col justify-start">
                <Label>Código de calidad</Label>
                <div className="flex items-center gap-2">
                  <Input
                    style={{
                      width: "16rem",
                      border: `2px solid ${OrgColors.serotGris}`,
                    }}
                    value={localFilters.codigoCalidad}
                    onChange={handleCodigoChange}
                    onKeyDown={handleCodigoKeyDown}
                    placeholder="Buscar por código..."
                  />
                  <Button
                    size="large"
                    icon={<DismissCircle24Regular />}
                    appearance="secondary"
                    className={`${stylebtn.buttonNaranjaBase}`}
                    onClick={handleClear}
                  >
                    Limpiar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
