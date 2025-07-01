"use client";

import { useState } from "react";
import { Card, CardPreview, Text } from "@fluentui/react-components";
import {
  DocumentTextRegular,
  ArrowRepeatAllRegular,
  BoxRegular,
  ClipboardTextLtrRegular,
} from "@fluentui/react-icons";
import type { ReactNode } from "react";
import { QualityParametersMatrix } from "./quality-parameters-matrix";
import { Title } from "@/components/ui/title";

const CARD_OPTIONS: { label: string; icon: ReactNode }[] = [
  { label: "Homogenizado", icon: <DocumentTextRegular fontSize={28} /> },
  { label: "Reproceso", icon: <ArrowRepeatAllRegular fontSize={28} /> },
  { label: "Producto a medida", icon: <BoxRegular fontSize={28} /> },
  {
    label: "Consumir parametros",
    icon: <ClipboardTextLtrRegular fontSize={28} />,
  },
];
export function TabExecution() {
  const [selectedType, setSelectedType] = useState<string>("Homogenizado");

  const handleSelect = (label: string) => {
    setSelectedType(label);
  };

  return (
    <div className="px-2 m-auto flex flex-col w-full h-full">
      <div className="h-3/15 w-full pb-2">
        <Card style={{ width: "100%", height: "100%" }}>
          <div className=" w-full h-full">
            <Title title="Tipo de Homogenizado"></Title>

            <div className="py-6 px-8 flex flex-wrap gap-4 justify-between">
              {CARD_OPTIONS.map(({ label, icon }) => (
                <Card
                  key={label}
                  size="large"
                  className={`w-72 text-black text-base border border-gray-200 border-t-8 cursor-pointer text-center p-4 transition-all duration-200 ease-in-out flex flex-col items-center gap-2 ${
                    selectedType === label
                      ? "bg-blue-100 border-t-blue-600"
                      : "bg-gray-50 border-t-gray-500 hover:bg-blue-50 hover:border-t-blue-600"
                  }`}
                  onClick={() => handleSelect(label)}
                >
                  <div className="flex items-center gap-2">
                    {icon}
                    <Text>{label}</Text>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="w-full h-12/15 pb-2">
        <Card
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <div className="w-full h-full overflow-y-auto ">
            <QualityParametersMatrix
              showCheckboxes={
                selectedType === "Producto a medida" ||
                selectedType === "Consumir parametros"
              }
              allowMultipleSelection={selectedType === "Consumir parametros"}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
