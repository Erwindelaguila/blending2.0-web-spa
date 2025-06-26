import { TableBase } from "@/components/ui/table-base";
import { Title } from "@/components/ui/title";
import { OrgColors } from "@/config/app.config.server";
import {
  Card,
  CardPreview,
  Checkbox,
  CheckboxProps,
  Input,
  Label,
  MessageBar,
  MessageBarBody,
} from "@fluentui/react-components";
import { useState } from "react";


const columns = [
  { uid: "contrato", name: "Contrato", width: 5 },
  { uid: "pais_destino", name: "Pais destino", width: 7 },
  { uid: "lugar_destino", name: "Lugar destino", width: 7 },
  { uid: "peso_contenedor", name: "Peso contenedores", width: 7 },
];

const columnsv1 = [
  { uid: "calidad_conte", name: "Contrato", width: 5 },
  { uid: "capacidad_conte", name: "Pais destino", width: 7 },
];

const data = [
  {
    contrato: "HPE-24 0160 G2",
    pais_destino: "China",
    lugar_destino: "Tianjin",
    peso_contenedor: "26500",
  },
];

const datav2 = [
  {
    calidad_conte: "17",
    capacidad_conte: "546",
  },
  {
    calidad_conte: "57",
    capacidad_conte: "653",
  },
  {
    calidad_conte: "78",
    capacidad_conte: "824",
  },
];

export function ParametrosLogisticos() {

  const [checked, setChecked] = useState<CheckboxProps["checked"]>(true);

  return (
    <div className="w-full">
      <Card>
        <CardPreview>
          <div className="p-3">
            <div className="flex flex-col gap-4">
              <div>
                <Title title="Parámetros Logísticos" />
              </div>
              <div className="w-[40rem]">
                <TableBase
                  columns={columns}
                  data={data}
                  isLoading={false}
                  error={null}
                />
              </div>

              <div className="flex items-center gap-6 ">
                <div className="flex  justify-start items-center gap-2 ">
                  <Label>Cantidad de contenedores</Label>
                  <Input
                    style={{
                      width: "10rem",
                      border: ` 2px solid ${OrgColors.serotGris}`,
                    }}
                    type="number"
                  />
                </div>
                <div className="flex  justify-start items-center gap-2">
                  <Label>Capacidad de contenedores (en sacos)</Label>
                  <Input
                    style={{
                      width: "10rem",
                      border: ` 2px solid ${OrgColors.serotGris}`,
                    }}
                    type="number"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span>¿Desea definir contenedores con capacidad distinta?</span>

                <Checkbox
                  size="large"
                  label="Actualizar las capacidades de los contenedores"
                  checked={checked}
                  onChange={(ev, data) => setChecked(data.checked)}
                />

                {checked && (
                  <>
                    <div className="w-[40rem]">
                      <TableBase
                        columns={columnsv1}
                        data={datav2}
                        isLoading={false}
                        error={null}
                      />
                    </div>

                    <div className="w-full gap-2 flex flex-col">
                      <MessageBar>
                        <MessageBarBody>
                          La combinación permite la cantidad exacta solicitada:
                          9860.0
                        </MessageBarBody>
                      </MessageBar>

                      <MessageBar intent="success">
                        <MessageBarBody>
                          La cantidad de sacos que permite esta combinación es:
                          9860.0
                        </MessageBarBody>
                      </MessageBar>

                      <MessageBar>
                        <MessageBarBody>
                          Se puede distribuir los contenedores
                        </MessageBarBody>
                      </MessageBar>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardPreview>
      </Card>
    </div>
  );
}
