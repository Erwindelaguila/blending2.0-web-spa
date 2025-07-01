"use client";

import { CardGroup, Title } from "@/components";
import { OrgColors } from "@/config/app.config.server";
import { IGroup } from "@/interface";
import {
  Badge,
  Button,
  Card,
  mergeClasses,
  Text,
} from "@fluentui/react-components";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
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
    status: true,
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
    status: false,
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
    status: false,
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
    status: false,
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
    status: false,
  },
];

export default function DetallePage() {
  const style = useButtonsStyles();
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");

  const aceptados = CALIDADES.filter((c) => c.status);
  const noAceptados = CALIDADES.filter((c) => !c.status);

  const defaultSelected =
    aceptados.length > 0 ? aceptados.map((g) => g.grupo) : null;

  const [selected, setSelected] = useState<number[]>(defaultSelected ?? []);

  if (!uid) {
    return <div>UID no proporcionado</div>;
  }

  return (
    <div className="py-2 w-full h-full overflow-y-auto">
      <div className="flex justify-between items-center pb-2 w-full h-1/15">
        <Title title={`Ejecución: ${uid}`}></Title>
        <div className="flex items-center gap-4">
          <Text>Estado</Text>
          <Badge
            size="extra-large"
            style={{ backgroundColor: OrgColors.verde }}
            appearance="filled"
          >
            ACEPTADO
          </Badge>
        </div>
      </div>

      <div className="h-13/15 overflow-y-auto space-y-4 ">
        {aceptados.length > 0 && (
          <div className="w-full h-auto max-h-[80rem] overflow-y-auto p-1">
            <Card>
              <div className="p-2 flex flex-col gap-2">
                <Title title="Grupos Aceptados" color={OrgColors.verde}></Title>
                {aceptados.length > 0 && (
                  <>
                    <div className="grid grid-cols-1 gap-4">
                      {aceptados.map((group) => (
                        <CardGroup
                          key={group.grupo}
                          group={group}
                          selected={selected}
                          setSelect={setSelected}
                          readOnly={aceptados.length > 0}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>
        )}

        {noAceptados.length > 0 && (
          <div
            className={`w-full ${
              aceptados.length > 0 ? "h-auto" : "h-full"
            } h-full max-h-[80rem] overflow-y-auto p-1`}
          >
            <Card style={{ width: "100%", height: "100%" }}>
              <div className="p-2 space-y-4 h-full ">
                <Title
                  title="Grupos No Aceptados"
                  color={OrgColors.grisTexto}
                ></Title>
                <div className="grid grid-cols-1 gap-4 h-[95%] overflow-y-auto">
                  {noAceptados.map((group) => (
                    <CardGroup
                      key={group.grupo}
                      group={group}
                      selected={selected}
                      setSelect={setSelected}
                      readOnly={aceptados.length > 0}
                    />
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      <div className="flex justify-end items-center gap-3 w-full h-1/15 bg-gray-50">
        <div>
          <Button size="large" className={style.buttonCelesteBase}>
            Ver Parametros
          </Button>
        </div>
        <div>
          <Button size="large" className={style.buttonVerdeBase}>
            Descargar reporte
          </Button>
        </div>

        <div>
          <Button
            size="large"
            appearance="outline"
            className={mergeClasses(
              style.buttonAzulOscuroBase,
              aceptados.length > 0 && style.buttonDisabled
            )}
            disabled={aceptados.length > 0}
          >
            Aceptar Grupos
          </Button>
        </div>
      </div>
    </div>
  );
}
