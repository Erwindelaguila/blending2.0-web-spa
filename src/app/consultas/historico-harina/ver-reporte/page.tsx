"use client";

import { CardGroup, Title } from "@/components";
import { OrgColors } from "@/config/app.config.server";
import { IGroup } from "@/interface";
import { hexToRgba } from "@/utils/colors";
import {
  Badge,
  Button,
  Card,
  CardPreview,
  makeStyles,
  mergeClasses,
  Text,
} from "@fluentui/react-components";
import { useState } from "react";
import { useSearchParams } from "next/navigation";


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
    status: false,
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
    status: true,
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

const baseButtonStyle = {
  //padding: "0.4rem",
  width: "13rem",
  color: "white",
  fontSize: "1rem",
};

const useStyles = makeStyles({
  cardBase: {
    padding: "1rem",
    width: "100%",
    height: "8rem",
    borderRadius: "0rem",
    border: "0.1rem solid #eee",
    borderLeft: "0.7rem solid #808080",
    boxShadow: "none",
    ":hover": {
      backgroundColor: "#fff",
    },
  },
  selectCardGrupo: {
    backgroundColor: "#fdfff8",
    borderLeftColor: OrgColors.verde,
    boxShadow: "0 3.2px 7.2px rgba(0,0,0,0.16), 0 0.7px 2.1px rgba(0,0,0,0.14)",
  },

  divider: {
    width: "0.2rem",
    backgroundColor: "#ccc",
  },

  dividerHorizontal: {
    height: "0.1rem",
    backgroundColor: "#ccc",
  },
  buttonP: {
    ...baseButtonStyle,
    backgroundColor: OrgColors.celeste,
    ":hover": {
      backgroundColor: hexToRgba(OrgColors.celeste, 0.8),
      color: "#fff",
    },
  },
  buttonR: {
    ...baseButtonStyle,
    backgroundColor: OrgColors.verde,
    ":hover": {
      backgroundColor: hexToRgba(OrgColors.verde, 0.8),
      color: "#fff",
    },
  },
  buttonA: {
    ...baseButtonStyle,
    backgroundColor: OrgColors.serotAzul,
    ":hover": {
      backgroundColor: hexToRgba(OrgColors.serotAzul, 0.8),
      color: "#fff",
    },
  },
  buttonDisabled: {
    backgroundColor: "#f0f0f0",
    color: "#666",
    cursor: "not-allowed",
    opacity: 0.6,
    pointerEvents: "none",
  },
});

export default function DetallePage() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");

  const style = useStyles();

  const aceptados = CALIDADES.filter((c) => c.status);
  const noAceptados = CALIDADES.filter((c) => !c.status);

  const defaultSelected = aceptados.length > 0 ? aceptados[0].grupo : null;
  const [selected, setSelected] = useState<number | null>(defaultSelected);

  if (!uid) {
    return <div>UID no proporcionado</div>;
  }

  console.log(selected);

  return (
    <div className=" p-1">
      <div className="flex justify-between items-center pb-2">
        <Title title={`Ejecución: ${uid}`} color={OrgColors.azulOscuro}></Title>
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

      <div style={{ height: "44.5rem" }} className=" overflow-hidden p-1">
        <div className="w-full h-[28%]">
          <Card>
            <CardPreview>
              <div className="p-2">
                {aceptados.length > 0 && (
                  <div className="space-y-4">
                    <Title
                      title="Grupos Aceptados"
                      color={OrgColors.verde}
                    ></Title>
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
                  </div>
                )}
              </div>
            </CardPreview>
          </Card>
        </div>

        <div className="w-full h-[65%] overflow-hidden">
          <Card className="h-full">
            <CardPreview className="h-full">
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
            </CardPreview>
          </Card>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button size="large" className={style.buttonP}>
            Ver Parametros
          </Button>
          <Button size="large" className={style.buttonR}>
            Descargar reporte
          </Button>
          <Button
            size="large"
            appearance="outline"
            className={mergeClasses(
              style.buttonA,
              selected == null && style.buttonDisabled
            )}
            disabled={selected == null}
          >
            Aceptar Grupos
          </Button>
        </div>
      </div>
    </div>
  );
}
