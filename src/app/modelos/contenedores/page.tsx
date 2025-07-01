"use client";

import { OtrosParametros, ParametrosLogisticos, Title } from "@/components";
import { OrgColors } from "@/config/app.config.server";
import { useButtonsStyles } from "@/styles/button.styles";
import { hexToRgba } from "@/utils/colors";
import { Button, Card, Divider } from "@fluentui/react-components";
import { DocumentAdd24Filled } from "@fluentui/react-icons";

export default function ContenedoresPage() {
  const style = useButtonsStyles();

  return (
    <>
      <div className=" flex flex-col gap-4  w-full h-full pb-2 overflow-y-auto">
        <div>
          <Card style={{ width: "100%" }}>
            <div className="">
              <div className="flex flex-col gap-4">
                <div>
                  <Title title="Asignación" />
                </div>

                <Button
                  size="large"
                  icon={<DocumentAdd24Filled></DocumentAdd24Filled>}
                  className={`w-[20rem] ${style.buttonCelesteBase}`}
                >
                  Adjuntar Asignación
                </Button>

                <Divider
                  style={{
                    height: "0.2rem",
                    backgroundColor: "#ccc",
                  }}
                ></Divider>

                <div className="flex gap-4">
                  <span className="font-semibold">
                    Contrato: HPE-24 0160 G2
                  </span>
                  <span className="font-semibold">Cantidad de Sacos: 9860</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <ParametrosLogisticos></ParametrosLogisticos>
        <OtrosParametros></OtrosParametros>

        <div className="flex gap-4 w-full">
          <div
            className="w-2/3 rounded-xl p-3 text-md flex items-center "
            style={{
              backgroundColor: hexToRgba(OrgColors.celeste, 0.3),
              color: OrgColors.azulOscuro,
            }}
          >
            <div>
              Se está ejecutando el modelo, esto puede demorar algunos minutos.
              Puede consultar el estado <br /> de la ejecución, con el código:{" "}
              <span className="font-semibold">DISLOG000123</span>
            </div>
          </div>

          <div className="w-1/3 flex flex-col gap-2 items-end justify-end">
            <Button
              size="large"
              className={`w-[13rem] ${style.buttonAzulOscuroBase}`}
            >
              Correr modelo
            </Button>
            <Button
              size="large"
              className={`w-[13rem] ${style.buttonVerdeBase}`}
            >
              Descargar reporte
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
