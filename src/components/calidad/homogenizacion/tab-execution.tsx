"use client"

import { useState } from "react"
import { Card, CardPreview, Text } from "@fluentui/react-components"
import { DocumentTextRegular, ArrowRepeatAllRegular, BoxRegular, ClipboardTextLtrRegular } from "@fluentui/react-icons"
import type { ReactNode } from "react"
import { QualityParametersMatrix } from "./quality-parameters-matrix"

const CARD_OPTIONS: { label: string; icon: ReactNode }[] = [
  { label: "Homogenizado", icon: <DocumentTextRegular fontSize={28} /> },
  { label: "Reproceso", icon: <ArrowRepeatAllRegular fontSize={28} /> },
  { label: "Producto a medida", icon: <BoxRegular fontSize={28} /> },
  {
    label: "Consumir parametros",
    icon: <ClipboardTextLtrRegular fontSize={28} />,
  },
]
export function TabExecution() {
  const [selectedType, setSelectedType] = useState<string>("Homogenizado")

  const handleSelect = (label: string) => {
    setSelectedType(label)
  }

  return (
    <div className="px-2 m-auto flex flex-col gap-6">
      <Card className="mx-auto w-full max-w-full">
        <CardPreview>
          <div className="px-6 pt-2">
            <Text size={400} weight="medium">
              Tipo de Homogenizado
            </Text>
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
        </CardPreview>
      </Card>

      <Card className="mx-auto w-full max-w-full h-[31rem] overflow-y-auto">
        <CardPreview>
          <QualityParametersMatrix showCheckboxes={selectedType === "Producto a medida"} selectedType={selectedType} />
        </CardPreview>
      </Card>
    </div>
  )
}
