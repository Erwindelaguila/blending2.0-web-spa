"use client";

import {
  Button,
  Card,
  CardPreview,
  Divider,
  makeStyles,
  mergeClasses,
  MessageBar,
  Tag,
  Text,
} from "@fluentui/react-components";
import { Title } from "../../ui/title";
import { useState } from "react";
import { OrgColors } from "@/config/app.config.server";
import { hexToRgba } from "@/utils/colors";
import { CardGroup } from "@/components/ui/card-group";
import { IGroup } from "@/interface";

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

export function TabResult() {
  const style = useStyles();

  const [selected, setSelected] = useState<number | null>(null);

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
      <div className="w-full h-5 px-2">
        <Card className="m-auto w-full max-w-full ">
          <CardPreview>
            <div className="p-3 " style={{ height: "43rem" }}>
              <div className="w-full h-2/20">
                <Title
                  title="Grupos"
                  subtitulo="Seleccion un grupo para procesar en planta"
                ></Title>
              </div>

              <div className="w-full h-16/20 overflow-y-auto pb-3">
                <div className="flex flex-col  gap-4 mt-2">
                  {renderQualities}
                </div>
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
          </CardPreview>
        </Card>
      </div>
    </>
  );
}
