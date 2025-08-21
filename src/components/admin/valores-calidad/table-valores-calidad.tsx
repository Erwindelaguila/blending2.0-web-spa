import { TableDynamic } from "@/components/ui/table-dynamic";
import { useButtonsStyles } from "@/styles/button.styles";
import { Button, Card, CardPreview, Spinner } from "@fluentui/react-components";
import { Checkmark24Regular } from "@fluentui/react-icons";
import { useState, useEffect, useMemo } from "react";
import useSWR, { mutate } from "swr";
import { CalidadParametrosService } from "@/services/calidad-parametros.service";
import { useAsyncAction } from "@/hooks/use-async-action";

const calidades: Calidad[] = [
  {
    calidad: "CALIDAD-03",
    PARAM01: "123",
    PARAM02: "456.7",
    PARAM03: "89.1",
    PARAM04: "12.3",
    PARAM05: "78.9",
    PARAM06: "90.2",
    PARAM07: "345.6",
    PARAM08: "23.4",
    PARAM09: "11.1",
    PARAM10: "99.9",
    PARAM11: "65.4",
    PARAM12: "44.2",
    PARAM13: "101.0",
    PARAM14: "57.3",
    PARAM15: "83.7",
  },
  {
    calidad: "CALIDAD-04",
    PARAM01: "234",
    PARAM02: "567.8",
    PARAM03: "98.2",
    PARAM04: "34.5",
    PARAM05: "67.8",
    PARAM06: "123.0",
    PARAM07: "87.6",
    PARAM08: "45.9",
    PARAM09: "23.1",
    PARAM10: "88.2",
    PARAM11: "73.5",
    PARAM12: "39.4",
    PARAM13: "66.0",
    PARAM14: "28.9",
    PARAM15: "59.4",
  },
  {
    calidad: "CALIDAD-05",
    PARAM01: "345",
    PARAM02: "678.9",
    PARAM03: "76.3",
    PARAM04: "56.7",
    PARAM05: "98.1",
    PARAM06: "150.3",
    PARAM07: "43.2",
    PARAM08: "33.8",
    PARAM09: "17.2",
    PARAM10: "77.0",
    PARAM11: "80.1",
    PARAM12: "22.2",
    PARAM13: "92.9",
    PARAM14: "61.8",
    PARAM15: "38.6",
  },
  {
    calidad: "CALIDAD-06",
    PARAM01: "456",
    PARAM02: "789.0",
    PARAM03: "65.4",
    PARAM04: "78.9",
    PARAM05: "54.6",
    PARAM06: "200.1",
    PARAM07: "76.9",
    PARAM08: "21.0",
    PARAM09: "12.5",
    PARAM10: "66.5",
    PARAM11: "49.9",
    PARAM12: "35.6",
    PARAM13: "88.8",
    PARAM14: "70.7",
    PARAM15: "25.5",
  },
  {
    calidad: "CALIDAD-07",
    PARAM01: "567",
    PARAM02: "890.1",
    PARAM03: "54.5",
    PARAM04: "89.0",
    PARAM05: "43.2",
    PARAM06: "250.5",
    PARAM07: "109.4",
    PARAM08: "66.6",
    PARAM09: "34.4",
    PARAM10: "55.1",
    PARAM11: "20.8",
    PARAM12: "41.9",
    PARAM13: "77.3",
    PARAM14: "82.6",
    PARAM15: "49.2",
  },

  {
    calidad: "CALIDAD-08",
    PARAM01: "111",
    PARAM02: "222.2",
    PARAM03: "333.3",
    PARAM04: "444.4",
    PARAM05: "555.5",
    PARAM06: "666.6",
    PARAM07: "777.7",
    PARAM08: "888.8",
    PARAM09: "999.9",
    PARAM10: "101.0",
    PARAM11: "202.1",
    PARAM12: "303.2",
    PARAM13: "404.3",
    PARAM14: "505.4",
    PARAM15: "606.5",
  },
  {
    calidad: "CALIDAD-09",
    PARAM01: "912",
    PARAM02: "823.1",
    PARAM03: "734.2",
    PARAM04: "645.3",
    PARAM05: "556.4",
    PARAM06: "467.5",
    PARAM07: "378.6",
    PARAM08: "289.7",
    PARAM09: "190.8",
    PARAM10: "101.9",
    PARAM11: "112.0",
    PARAM12: "223.1",
    PARAM13: "334.2",
    PARAM14: "445.3",
    PARAM15: "556.4",
  },
  {
    calidad: "CALIDAD-10",
    PARAM01: "101",
    PARAM02: "202",
    PARAM03: "303",
    PARAM04: "404",
    PARAM05: "505",
    PARAM06: "606",
    PARAM07: "707",
    PARAM08: "808",
    PARAM09: "909",
    PARAM10: "010",
    PARAM11: "111",
    PARAM12: "212",
    PARAM13: "313",
    PARAM14: "414",
    PARAM15: "515",
  },
  {
    calidad: "CALIDAD-11",
    PARAM01: "111",
    PARAM02: "112",
    PARAM03: "113",
    PARAM04: "114",
    PARAM05: "115",
    PARAM06: "116",
    PARAM07: "117",
    PARAM08: "118",
    PARAM09: "119",
    PARAM10: "120",
    PARAM11: "121",
    PARAM12: "122",
    PARAM13: "123",
    PARAM14: "124",
    PARAM15: "125",
  },
  {
    calidad: "CALIDAD-12",
    PARAM01: "15.6",
    PARAM02: "18.4",
    PARAM03: "21.0",
    PARAM04: "19.8",
    PARAM05: "22.3",
    PARAM06: "24.1",
    PARAM07: "20.2",
    PARAM08: "23.5",
    PARAM09: "25.9",
    PARAM10: "26.7",
    PARAM11: "29.1",
    PARAM12: "30.0",
    PARAM13: "27.8",
    PARAM14: "28.6",
    PARAM15: "32.4",
  },
  {
    calidad: "CALIDAD-13",
    PARAM01: "51.2",
    PARAM02: "49.9",
    PARAM03: "47.1",
    PARAM04: "45.3",
    PARAM05: "50.0",
    PARAM06: "48.8",
    PARAM07: "52.2",
    PARAM08: "53.1",
    PARAM09: "46.7",
    PARAM10: "44.0",
    PARAM11: "42.9",
    PARAM12: "41.5",
    PARAM13: "40.2",
    PARAM14: "39.1",
    PARAM15: "38.7",
  },
  {
    calidad: "CALIDAD-14",
    PARAM01: "60.3",
    PARAM02: "62.8",
    PARAM03: "64.4",
    PARAM04: "65.1",
    PARAM05: "66.0",
    PARAM06: "67.2",
    PARAM07: "68.5",
    PARAM08: "70.0",
    PARAM09: "69.1",
    PARAM10: "71.3",
    PARAM11: "72.8",
    PARAM12: "74.5",
    PARAM13: "75.0",
    PARAM14: "76.2",
    PARAM15: "77.9",
  },
  {
    calidad: "CALIDAD-15",
    PARAM01: "10.1",
    PARAM02: "11.3",
    PARAM03: "12.5",
    PARAM04: "13.7",
    PARAM05: "14.8",
    PARAM06: "15.0",
    PARAM07: "16.6",
    PARAM08: "17.2",
    PARAM09: "18.4",
    PARAM10: "19.5",
    PARAM11: "20.7",
    PARAM12: "21.9",
    PARAM13: "22.1",
    PARAM14: "23.3",
    PARAM15: "24.6",
  },
  {
    calidad: "CALIDAD-16",
    PARAM01: "88.8",
    PARAM02: "87.6",
    PARAM03: "86.4",
    PARAM04: "85.2",
    PARAM05: "84.0",
    PARAM06: "83.8",
    PARAM07: "82.6",
    PARAM08: "81.4",
    PARAM09: "80.2",
    PARAM10: "79.0",
    PARAM11: "78.8",
    PARAM12: "77.6",
    PARAM13: "76.4",
    PARAM14: "75.2",
    PARAM15: "74.0",
  },
  {
    calidad: "CALIDAD-17",
    PARAM01: "5.1",
    PARAM02: "6.3",
    PARAM03: "7.7",
    PARAM04: "8.8",
    PARAM05: "9.9",
    PARAM06: "10.0",
    PARAM07: "11.5",
    PARAM08: "12.8",
    PARAM09: "13.3",
    PARAM10: "14.7",
    PARAM11: "15.5",
    PARAM12: "16.6",
    PARAM13: "17.8",
    PARAM14: "18.9",
    PARAM15: "20.0",
  },
];
type Calidad = {
  calidad: string;
  [key: string]: string;
};

export function TableValoresCalidad() {
  const style = useButtonsStyles();
  const asyncAction = useAsyncAction();
  
  // Obtener datos dinámicos del backend
  const { data: matrizData, isLoading } = useSWR(
    "matriz-calidad-parametros",
    () => CalidadParametrosService.obtenerMatriz()
  );

  // Convertir datos de la matriz a formato para TableDynamic
  const datos = useMemo(() => {
    if (!matrizData?.data) return []; // sin datos del backend = tabla vacía
    
    const matriz = matrizData.data;
    
    // Tabla completamente dinámica: solo lo que venga del backend
    return matriz.calidades.map(calidad => {
      const fila: any = { calidad: calidad.codigo };
      matriz.parametros.forEach(param => {
        const valor = calidad.valores[param.codigo];
        fila[param.codigo] = valor?.valor?.toString() ?? "0";
      });
      return fila;
    });
  }, [matrizData]);

  const [datosEditables, setDatosEditables] = useState<Calidad[]>(datos);

  useEffect(() => {
    setDatosEditables(datos);
  }, [datos]);

  const handleGuardarConfiguracion = async () => {
    if (!matrizData?.data) return;

    const matriz = matrizData.data;
    const cambios: Array<{ calidadId: string; parametroId: string; valor: number }> = [];

    // Comparar datos editables con datos originales para encontrar cambios
    datosEditables.forEach((filaEditada) => {
      const calidadCodigo = filaEditada.calidad;
      const calidadOriginal = matriz.calidades.find(c => c.codigo === calidadCodigo);
      
      if (calidadOriginal) {
        matriz.parametros.forEach((param) => {
          const valorEditado = parseFloat(filaEditada[param.codigo] || "0");
          const valorOriginal = calidadOriginal.valores[param.codigo]?.valor ?? 0;
          
          // Si el valor cambió, agregarlo a la lista de cambios
          if (valorEditado !== valorOriginal) {
            cambios.push({
              calidadId: calidadOriginal.id,
              parametroId: param.id,
              valor: valorEditado
            });
          }
        });
      }
    });

    if (cambios.length === 0) {
      console.log("No hay cambios para guardar");
      return;
    }

    console.log(`Guardando ${cambios.length} cambios en una sola petición:`, cambios);

    await asyncAction.execute(async () => {
      // Enviar TODOS los cambios en una sola petición
      const result = await CalidadParametrosService.upsertValoresBatch(cambios);
      
      // Refrescar datos después de guardar
      mutate("matriz-calidad-parametros");
      
      return { 
        message: `Se procesaron ${result.data?.processedCount || cambios.length} cambios exitosamente`,
        data: result.data
      };
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner labelPosition="below" label="Cargando matriz de calidad-parámetros..." />
      </div>
    );
  }

  return (
    <>
      <Card style={{ width: "100%", height: "100%" }}>
        <div className="w-full h-full flex flex-col ">
          <div className="w-full h-23/25">
            <TableDynamic
              data={datosEditables}
              titleFirstCol="Calidades"
              editable
              onDataChange={setDatosEditables}
              widthFull={true}
              height="100%"
              isStickyFirstCol={true}
              paintRowCol={true}
            />
          </div>

          <div className="flex justify-end items-center w-full h-2/25">
            <Button
              size="large"
              style={{ width: "20rem" }}
              className={style.buttonAzulOscuroBase}
              icon={<Checkmark24Regular />}
              onClick={handleGuardarConfiguracion}
              disabled={asyncAction.isLoading}
            >
              {asyncAction.isLoading ? "Guardando..." : "Guardar configuración"}
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}
