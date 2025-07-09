"use client";

import { ProductoView } from "@/components";
import { AgregadoView } from "@/components/admin/produccion/agregado/agregado-view";
import { CalidadView } from "@/components/admin/produccion/calidades/calidad-view";
import { LineaProduccionView } from "@/components/admin/produccion/linea-produccion/linea-produccion-view";
import { TipoProduccionView } from "@/components/admin/produccion/tipo-produccion/tipo-produccion-view";
import { ITabConfigProduccion } from "@/interface";
import {
  SelectTabData,
  SelectTabEvent,
  Tab,
  TabList,
  TabValue,
} from "@fluentui/react-components";
import {
  AddSquare24Filled,
  Beaker24Filled,
  Box24Filled,
  Flow24Filled,
  HexagonThree24Filled,
} from "@fluentui/react-icons";
import { useState } from "react";

export default function CalidadesPage() {
  const [selectedValue, setSelectedValue] = useState<TabValue>("producto");

  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value);
  };

  const tabs: ITabConfigProduccion[] = [
    {
      id: "Producto",
      value: "producto",
      label: "Producto",
      icon: { children: <Box24Filled /> },
      content: <ProductoView />,
    },
    {
      id: "Calidades",
      value: "calidades",
      label: "Calidades",
      icon: { children: <Beaker24Filled /> },
      content: <CalidadView />,
    },
    {
      id: "Tipo_de_Producción",
      value: "tipo_de_producción",
      label: "Tipo de Producción",
      icon: { children: <HexagonThree24Filled /> },
      content: <TipoProduccionView />,
    },
    {
      id: "Linea_de_Producción",
      value: "linea_de_producción",
      label: "Línea de Producción",
      icon: { children: <Flow24Filled /> },
      content: <LineaProduccionView />,
    },
    {
      id: "Agregado",
      value: "agregado",
      label: "Agregado",
      icon: { children: <AddSquare24Filled /> },
      content: <AgregadoView />,
    },
  ];

  const selectedTab = tabs.find((tab) => tab.value === selectedValue);

  return (
    <div className="w-full flex flex-col h-full">
      <TabList
        className="w-full h-2/35"
        selectedValue={selectedValue}
        onTabSelect={onTabSelect}
        size="large"
      >
        {tabs.map(({ id, value, label, icon }) => (
          <Tab key={id} id={id} value={value} icon={icon}>
            {label}
          </Tab>
        ))}
      </TabList>

      <div className="w-full h-33/35 pt-2 px-0.5">
        <div className="w-full h-full">{selectedTab?.content}</div>
      </div>
    </div>
  );
}
