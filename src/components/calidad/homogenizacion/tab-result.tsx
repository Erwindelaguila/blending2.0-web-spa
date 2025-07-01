"use client";

import {
  Button,
  Card,
  mergeClasses,
} from "@fluentui/react-components";
import { Title } from "../../ui/title";
import { useState } from "react";
import { OrgColors } from "@/config/app.config.server";
import { hexToRgba } from "@/utils/colors";
import { CardGroup } from "@/components/ui/card-group";
import { IGroup } from "@/interface";
import { useButtonsStyles } from "@/styles/button.styles";

const CALIDADES: IGroup[] = [
  {
    grupo: 1,
    nombre: "CALIDAD 01",
    toneladas: 200,
    valorInicial: 245454,
    valorFinal: 5678554,
    valorAgregado: 86000,
    costoTotal: 200,
    calidadesUtil: ["Calidad 1", "Calidad 2", "Calidad 3", "Calidad 5"],
  },
  {
    grupo: 2,
    nombre: "CALIDAD 02",
    toneladas: 200,
    valorInicial: 245454,
    valorFinal: 5678554,
    valorAgregado: 86000,
    costoTotal: 200,
    calidadesUtil: ["Calidad 1", "Calidad 2"],
  },
  {
    grupo: 3,
    nombre: "CALIDAD 03",
    toneladas: 200,
    valorInicial: 245454,
    valorFinal: 5678554,
    valorAgregado: 86000,
    costoTotal: 200,
    calidadesUtil: ["Calidad 1", "Calidad 2"],
  },
  {
    grupo: 4,
    nombre: "CALIDAD 04",
    toneladas: 250,
    valorInicial: 505454,
    valorFinal: 7678554,
    valorAgregado: 75000,
    costoTotal: 200,
    calidadesUtil: ["Calidad 1", "Calidad 2", "Calidad 5"],
  },
  {
    grupo: 5,
    nombre: "CALIDAD 05",
    toneladas: 250,
    valorInicial: 505454,
    valorFinal: 7678554,
    valorAgregado: 75000,
    costoTotal: 200,
    calidadesUtil: [
      "Calidad 1",
      "Calidad 3",
      "Calidad 5",
      "Calidad 6",
      "Calidad 10",
    ],
  },
];

export function TabResult() {
  const style = useButtonsStyles();

  const [selected, setSelected] = useState<number[]>([]);

  const renderQualities = CALIDADES.map((group: IGroup) => (
    <CardGroup
      key={group.grupo}
      group={group}
      selected={selected}
      setSelect={setSelected}
    ></CardGroup>
  ));

  return (
    <>
      <div className="w-full h-full px-2 m-auto pb-2">
        <Card style={{ width: "100%", height: "100%" }}>
          <div className="w-full h-full ">
            <div className="w-full h-2/20">
              <Title
                title="Grupos"
                subtitulo="Seleccion un grupo para procesar en planta"
              ></Title>
            </div>

            <div className="w-full h-16/20 overflow-y-auto pb-3">
              <div className="flex flex-col  gap-4 mt-2">{renderQualities}</div>
            </div>

            <div className="w-full h-2/20 flex  items-end">
              <div className="w-1/2  ">
                <div
                  className="p-2 rounded-md"
                  style={{
                    backgroundColor: hexToRgba(OrgColors.celeste, 0.3),
                  }}
                >
                  Se está ejecutando el modelo, esto puede demorar algunos
                  minutos. Puede consultar el estado de la ejecución, con el
                  código: <span className="font-semibold">HOMCAL000123</span>
                </div>
              </div>
              <div className="w-1/2 flex justify-end gap-3 pr-3">
                <Button size="large" className={`${style.buttonCelesteBase}`}>
                  Ver Parametros
                </Button>
                <Button size="large" className={`${style.buttonVerdeBase}`}>
                  Descargar reporte
                </Button>
                <Button
                  size="large"
                  appearance="outline"
                  className={mergeClasses(
                    style.buttonAzulOscuroBase,
                    selected.length == 0 && style.buttonDisabled
                  )}
                  disabled={selected == null}
                >
                  Aceptar Grupos
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
