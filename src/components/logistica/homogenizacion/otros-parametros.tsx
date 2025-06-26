import { AppTagPicker } from "@/components/ui/app-tagPicker";
import { TableDynamic } from "@/components/ui/table-dynamic";
import { Title } from "@/components/ui/title";
import { Card, CardPreview } from "@fluentui/react-components";
import { useState } from "react";

const calidades: Calidad[] = [
  { calidad: "CHI2511010", DIVISION: "123" },
  { calidad: "CHI2511011", DIVISION: "234" },
  { calidad: "CHI2511012", DIVISION: "345" },
  { calidad: "CHI2511013", DIVISION: "456" },
  { calidad: "CHI2511014", DIVISION: "567" },
  { calidad: "CHI2511015", DIVISION: "678" },
  { calidad: "CHI2511016", DIVISION: "789" },
  { calidad: "CHI2511017", DIVISION: "890" },
  { calidad: "CHI2511018", DIVISION: "901" },
  { calidad: "CHI2511019", DIVISION: "012" },
  { calidad: "CHI2511020", DIVISION: "111" },
  { calidad: "CHI2511021", DIVISION: "222" },
  { calidad: "CHI2511022", DIVISION: "333" },
  { calidad: "CHI2511023", DIVISION: "444" },
  { calidad: "CHI2511024", DIVISION: "555" },
  { calidad: "CHI2511025", DIVISION: "666" },
  { calidad: "CHI2511026", DIVISION: "777" },
  { calidad: "CHI2511027", DIVISION: "888" },
  { calidad: "CHI2511028", DIVISION: "999" },
  { calidad: "CHI2511029", DIVISION: "000" },
];

const dataV1: Calidad[] = [
  { calidad: "Grupo-01", PROTEINA: "67", TVN: "456.7", ARENA: "1.98" },
  { calidad: "Grupo-02", PROTEINA: "65", TVN: "75.7", ARENA: "74.5" },
  { calidad: "Grupo-03", PROTEINA: "66", TVN: "112.3", ARENA: "2.10" },
  { calidad: "Grupo-04", PROTEINA: "68", TVN: "98.6", ARENA: "3.45" },
  { calidad: "Grupo-05", PROTEINA: "69", TVN: "120.0", ARENA: "0.95" },
  { calidad: "Grupo-06", PROTEINA: "64", TVN: "88.8", ARENA: "4.32" },
  { calidad: "Grupo-07", PROTEINA: "70", TVN: "134.1", ARENA: "1.23" },
  { calidad: "Grupo-08", PROTEINA: "66", TVN: "110.0", ARENA: "2.50" },
  { calidad: "Grupo-09", PROTEINA: "63", TVN: "67.5", ARENA: "3.98" },
  { calidad: "Grupo-10", PROTEINA: "65", TVN: "143.3", ARENA: "5.12" },
  { calidad: "Grupo-11", PROTEINA: "67", TVN: "156.9", ARENA: "0.75" },

];



type Calidad = {
  calidad: string;
  [key: string]: string;
};

const allOptions = [
  "John Doe",
  "Jane Doe",
  "Max Mustermann",
  "Erika Mustermann",
  "Pierre Dupont",
  "Amelie Dupont",
  "Mario Rossi",
  "Maria Rossi",
];
export function OtrosParametros() {
  const [datos, setDatos] = useState<Calidad[]>(calidades);

  const [values, setValues] = useState<string[]>([]);
  return (
    <div className="w-full">
      <Card>
        <CardPreview>
          <div className="p-3">
            <div className="flex flex-col gap-4">
              <div>
                <Title title="Parámetros Logísticos" />
              </div>

              <AppTagPicker
                options={allOptions}
                value={values}
                onChange={setValues}
                //error={errors.centro_ubicacion?.message}
                size="medium"
                label="Elige uno o más parámetros"
                sizeLabel="medium"
                requieredLabel={false}
                placeholder="Seleccione centros de ubicación"
              />
              <div className="flex w-full ">
                <div className="flex flex-col gap-3 w-1/3">
                  <span className="font-semibold">División de rumas</span>
                  <TableDynamic
                    calidades={calidades}
                    title="Paramtroes"
                    editable
                    onDataChange={setDatos}
                    widthFull={false}
                    height="auto"
                    isStickyFirstCol={false}
                    paintRowCol={false}
                    titleFirstCol="Rumas"
                  ></TableDynamic>
                </div>

                <div className="flex flex-col gap-3 w-2/3">
                  <span className="font-semibold">División de rumas</span>
                  <TableDynamic
                    calidades={dataV1}
                    title="Paramtroes"
                    editable
                    onDataChange={setDatos}
                    widthFull={false}
                    height="auto"
                    isStickyFirstCol={false}
                    paintRowCol={false}
                    titleFirstCol="Grupos"
                  ></TableDynamic>
                </div>
              </div>
            </div>
          </div>
        </CardPreview>
      </Card>
    </div>
  );
}
