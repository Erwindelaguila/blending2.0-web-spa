import { TableDynamic } from "@/components/ui/table-dynamic";
import { useButtonsStyles } from "@/styles/button.styles";
import { Button, Card, CardPreview, Spinner } from "@fluentui/react-components";
import { Checkmark24Regular } from "@fluentui/react-icons";
import { useState, useEffect, useMemo, useCallback } from "react";
import useSWR, { mutate } from "swr";
import { CalidadParametrosService } from "@/services/calidad-parametros.service";
import { useAsyncAction } from "@/hooks/use-async-action";
import { useValoresCalidadContext, buildValoresCalidadKey } from "./valores-calidad-context";

type Calidad = {
  calidad: string;
  [key: string]: string;
};

export function TableValoresCalidad() {
  const style = useButtonsStyles();
  const asyncAction = useAsyncAction();
  const { filters } = useValoresCalidadContext();
  
  const swrKey = useMemo(() => buildValoresCalidadKey(filters.codigoCalidad), [filters.codigoCalidad]);
  
  const { data: matrizData, isLoading } = useSWR(
    swrKey,
    () => {
      if (filters.codigoCalidad) {
        return CalidadParametrosService.obtenerMatrizPorCalidad(filters.codigoCalidad);
      }
      return CalidadParametrosService.obtenerMatriz();
    }
  );

  const datos = useMemo(() => {
    if (!matrizData?.data) return []; 
    
    const data = matrizData.data;
    
    if (Array.isArray(data)) {
      const calidadesPorCodigo: { [key: string]: any } = {};
      const parametrosUnicos = new Set<string>();
      
      data.forEach(item => {
        const calidadCodigo = item.calidadCodigo;
        const parametroCodigo = item.parametroCodigo;
        
        if (!calidadesPorCodigo[calidadCodigo]) {
          calidadesPorCodigo[calidadCodigo] = { calidad: calidadCodigo };
        }
        
        calidadesPorCodigo[calidadCodigo][parametroCodigo] = item.valor?.toString() ?? "0";
        parametrosUnicos.add(parametroCodigo);
      });
      
      return Object.values(calidadesPorCodigo);
    }
    
    if (data.calidades && Array.isArray(data.calidades) && data.parametros && Array.isArray(data.parametros)) {
      const matriz = data;
      return matriz.calidades.map(calidad => {
        const fila: any = { calidad: calidad.codigo };
        matriz.parametros.forEach(param => {
          const valor = calidad.valores?.[param.codigo];
          fila[param.codigo] = valor?.valor?.toString() ?? "0";
        });
        return fila;
      });
    }
    
    console.warn("Estructura de datos no reconocida:", data);
    return [];
  }, [matrizData]);

  const [datosEditables, setDatosEditables] = useState<Calidad[]>([]);

  useEffect(() => {
    if (datos.length > 0) {
      setDatosEditables(datos);
    }
  }, [matrizData]);

  const handleDataChange = useCallback((data: any[]) => {
    setDatosEditables(data as Calidad[]);
  }, []);

  const handleGuardarConfiguracion = async () => {
    if (!matrizData?.data) return;

    const data = matrizData.data;
    const cambios: Array<{ calidadId: string; parametroId: string; valor: number }> = [];

    if (Array.isArray(data)) {
      const datosOriginalesPorClave: { [key: string]: any } = {};
      data.forEach(item => {
        const clave = `${item.calidadCodigo}-${item.parametroCodigo}`;
        datosOriginalesPorClave[clave] = item;
      });

      datosEditables.forEach((filaEditada) => {
        const calidadCodigo = filaEditada.calidad;
        
        Object.keys(filaEditada).forEach(parametroCodigo => {
          if (parametroCodigo === 'calidad') return;
          
          const clave = `${calidadCodigo}-${parametroCodigo}`;
          const itemOriginal = datosOriginalesPorClave[clave];
          
          if (itemOriginal) {
            const valorEditado = parseFloat(filaEditada[parametroCodigo] || "0");
            const valorOriginal = itemOriginal.valor ?? 0;
            
            if (valorEditado !== valorOriginal) {
              cambios.push({
                calidadId: itemOriginal.calidadId,
                parametroId: itemOriginal.parametroId,
                valor: valorEditado
              });
            }
          }
        });
      });
    }
    else if (data.calidades && Array.isArray(data.calidades) && data.parametros && Array.isArray(data.parametros)) {
      const matriz = data;
      
      datosEditables.forEach((filaEditada) => {
        const calidadCodigo = filaEditada.calidad;
        const calidadOriginal = matriz.calidades.find(c => c.codigo === calidadCodigo);
        
        if (calidadOriginal && matriz.parametros) {
          matriz.parametros.forEach((param) => {
            const valorEditado = parseFloat(filaEditada[param.codigo] || "0");
            const valorOriginal = calidadOriginal.valores?.[param.codigo]?.valor ?? 0;
          
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
    }
    else {
      console.error("No se puede guardar: estructura de datos no reconocida");
      return;
    }

    if (cambios.length === 0) {
      console.log("No hay cambios para guardar");
      return;
    }

    console.log(`Guardando ${cambios.length} cambios en una sola petición:`, cambios);

    await asyncAction.execute(async () => {
      const result = await CalidadParametrosService.upsertValoresBatch(cambios);
      
      mutate(swrKey);
      
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
          <div className="w-full h-23/25 pt-1">
            <TableDynamic
              data={datosEditables}
              titleFirstCol="Calidades"
              editable
              onDataChange={handleDataChange}
              widthFull={true}
              height="100%"
              isStickyFirstCol={true}
              paintRowCol={true}
              numericValidation={{
                enabled: true,
                mode: 'auto',
                integerMaxDigits: 5,
                decimalIntegerMaxDigits: 4,
                decimalDigits: 3,
                padOnBlur: true,
                allowLeadingDot: true,
              }}
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
