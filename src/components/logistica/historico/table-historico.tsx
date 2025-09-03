"use client";

import { TableBase } from "@/components/ui/table-base";
import { DatosDetalle } from "@/components/logistica/historico/datos-detalle";
import { Title } from "@/components/ui/title";
import { OrgColors } from "@/config/app.config.server";
import { hexToRgba } from "@/utils/colors";
import {
  Badge,
  Button,
  Card,
  CardPreview,
  makeStyles,
  TeachingPopover,
  TeachingPopoverBody,
  TeachingPopoverSurface,
  TeachingPopoverTrigger,
} from "@fluentui/react-components";
import {
  ArrowForwardDownLightning24Regular,
  Checkmark24Regular,
  DataUsage24Regular,
  Options24Regular,
  ProhibitedMultiple24Regular,
} from "@fluentui/react-icons";
import { Pagination } from "@/components/ui/pagination-base";
import { useState } from "react";
import { useButtonsStyles } from "@/styles/button.styles";

const columns = [
  { uid: "code", name: "Codigo", width: 5 },
  { uid: "datoN", name: "Dato-N", width: 5 },
  { uid: "datoM", name: "Dato-M", width: 5 },
  { uid: "usuario", name: "Usuario", width: 5 },
  { uid: "procesado", name: "Procesado", width: 5 },
  { uid: "status", name: "Estado", width: 5 },
  { uid: "confirmado", name: "Confirmado", width: 5 },
  { uid: "action", name: "Acciones", width: 15 },
];

const data = [
  {
    code: "HOMCAL000567",
    datoN: "Dato N",
    datoM: "Dato M",
    usuario: "Ivan Sanchez",
    procesado: "2025-05-05 14:52:24",
    status: "Procesado",
    confirmado: true,
    detalles: {
      nombreArchivo: "Asignación_Modificada_2025.05.05.xlsx",
      contrato: "HPE-24 0160 G2",
      paisDestino: "China",
      lugarDestino: "Tianjin",
      pesoContenedor: "26500",
      cantidadSacos: "9860",
      contenedores: [
        { cantidad: 17, capacidad: 520 },
        { cantidad: 2, capacidad: 510 },
      ],
      combinacionPermitida:
        "La combinación permite la cantidad exacta solicitada: 9860.0",
      cantidadSacosPermitida:
        "La cantidad de sacos que permite esta combinación es: 9860.0",
      parametrosElegidos: ["proteína", "tvn", "arena"],
      divisionRutas: [
        { ruma: "CH2511012", division: "5, 3" },
        { ruma: "CH2511014", division: "3" },
        { ruma: "CH2511017", division: "20" },
      ],
    },
  },
  {
    code: "HOMCAL000234",
    datoN: "Dato N",
    datoM: "Dato M",
    usuario: "Victor Castañeda",
    procesado: "2025-05-05 14:52:24",
    status: "Pendiente",
    confirmado: false,
    detalles: {
      nombreArchivo: "Asignación_Pendiente_2025.05.05.xlsx",
      contrato: "HPE-24 0160 G3",
      paisDestino: "Brasil",
      lugarDestino: "Santos",
      pesoContenedor: "25000",
      cantidadSacos: "8500",
      contenedores: [
        { cantidad: 15, capacidad: 500 },
        { cantidad: 3, capacidad: 480 },
      ],
      combinacionPermitida:
        "La combinación permite la cantidad exacta solicitada: 8500.0",
      cantidadSacosPermitida:
        "La cantidad de sacos que permite esta combinación es: 8500.0",
      parametrosElegidos: ["proteína", "humedad"],
      divisionRutas: [
        { ruma: "CH2511018", division: "4, 2" },
        { ruma: "CH2511019", division: "6" },
      ],
    },
  },
  {
    code: "HOMCAL000789",
    datoN: "Dato N",
    datoM: "Dato M",
    usuario: "Marcela Ríos",
    procesado: "2025-06-15 09:45:10",
    status: "Procesado",
    confirmado: true,
    detalles: {
      nombreArchivo: "Asignación_Confirmada_2025.06.15.xlsx",
      contrato: "HPE-24 0170 A1",
      paisDestino: "México",
      lugarDestino: "Veracruz",
      pesoContenedor: "27000",
      cantidadSacos: "9200",
      contenedores: [
        { cantidad: 16, capacidad: 550 },
        { cantidad: 1, capacidad: 400 },
      ],
      combinacionPermitida:
        "La combinación permite la cantidad exacta solicitada: 9200.0",
      cantidadSacosPermitida:
        "La cantidad de sacos que permite esta combinación es: 9200.0",
      parametrosElegidos: ["humedad", "fibra", "tvn"],
      divisionRutas: [
        { ruma: "MX2511022", division: "6, 4" },
        { ruma: "MX2511024", division: "2" },
      ],
    },
  },
  {
    code: "HOMCAL000790",
    datoN: "Dato N",
    datoM: "Dato M",
    usuario: "Carlos Pérez",
    procesado: "2025-06-17 11:20:45",
    status: "Pendiente",
    confirmado: false,
    detalles: {
      nombreArchivo: "Asignación_Pendiente_2025.06.17.xlsx",
      contrato: "HPE-24 0170 A2",
      paisDestino: "Colombia",
      lugarDestino: "Cartagena",
      pesoContenedor: "26000",
      cantidadSacos: "8900",
      contenedores: [
        { cantidad: 14, capacidad: 530 },
        { cantidad: 2, capacidad: 460 },
      ],
      combinacionPermitida:
        "La combinación permite la cantidad exacta solicitada: 8900.0",
      cantidadSacosPermitida:
        "La cantidad de sacos que permite esta combinación es: 8900.0",
      parametrosElegidos: ["proteína", "humedad"],
      divisionRutas: [
        { ruma: "CO2511031", division: "3, 5" },
        { ruma: "CO2511035", division: "2" },
      ],
    },
  },
  {
    code: "HOMCAL000791",
    datoN: "Dato N",
    datoM: "Dato M",
    usuario: "Ana Gómez",
    procesado: "2025-06-18 13:10:30",
    status: "Procesado",
    confirmado: true,
    detalles: {
      nombreArchivo: "Asignación_Procesada_2025.06.18.xlsx",
      contrato: "HPE-24 0170 A3",
      paisDestino: "Chile",
      lugarDestino: "Valparaíso",
      pesoContenedor: "25500",
      cantidadSacos: "8600",
      contenedores: [
        { cantidad: 13, capacidad: 540 },
        { cantidad: 1, capacidad: 580 },
      ],
      combinacionPermitida:
        "La combinación permite la cantidad exacta solicitada: 8600.0",
      cantidadSacosPermitida:
        "La cantidad de sacos que permite esta combinación es: 8600.0",
      parametrosElegidos: ["tvn", "arena"],
      divisionRutas: [
        { ruma: "CL2511042", division: "4" },
        { ruma: "CL2511044", division: "6, 2" },
      ],
    },
  },
  {
    code: "HOMCAL000792",
    datoN: "Dato N",
    datoM: "Dato M",
    usuario: "Luis Herrera",
    procesado: "2025-06-20 08:35:12",
    status: "Pendiente",
    confirmado: false,
    detalles: {
      nombreArchivo: "Asignación_Pendiente_2025.06.20.xlsx",
      contrato: "HPE-24 0170 A4",
      paisDestino: "Perú",
      lugarDestino: "Callao",
      pesoContenedor: "24800",
      cantidadSacos: "8400",
      contenedores: [
        { cantidad: 14, capacidad: 510 },
        { cantidad: 1, capacidad: 480 },
      ],
      combinacionPermitida:
        "La combinación permite la cantidad exacta solicitada: 8400.0",
      cantidadSacosPermitida:
        "La cantidad de sacos que permite esta combinación es: 8400.0",
      parametrosElegidos: ["proteína", "tvn", "fibra"],
      divisionRutas: [
        { ruma: "PE2511051", division: "3, 3" },
        { ruma: "PE2511052", division: "6" },
      ],
    },
  },
  {
    code: "HOMCAL000793",
    datoN: "Dato N",
    datoM: "Dato M",
    usuario: "Sofía Ramírez",
    procesado: "2025-06-21 10:00:00",
    status: "Procesado",
    confirmado: true,
    detalles: {
      nombreArchivo: "Asignación_Final_2025.06.21.xlsx",
      contrato: "HPE-24 0170 A5",
      paisDestino: "Ecuador",
      lugarDestino: "Guayaquil",
      pesoContenedor: "25000",
      cantidadSacos: "8700",
      contenedores: [
        { cantidad: 12, capacidad: 570 },
        { cantidad: 2, capacidad: 475 },
      ],
      combinacionPermitida:
        "La combinación permite la cantidad exacta solicitada: 8700.0",
      cantidadSacosPermitida:
        "La cantidad de sacos que permite esta combinación es: 8700.0",
      parametrosElegidos: ["humedad", "arena"],
      divisionRutas: [
        { ruma: "EC2511060", division: "5, 2" },
        { ruma: "EC2511061", division: "4" },
      ],
    },
  },

  {
    code: "HOMCAL000794",
    datoN: "Dato N",
    datoM: "Dato M",
    usuario: "Elena Torres",
    procesado: "2025-06-22 12:15:42",
    status: "Pendiente",
    confirmado: false,
    detalles: {
      nombreArchivo: "Asignación_Pendiente_2025.06.22.xlsx",
      contrato: "HPE-24 0170 A6",
      paisDestino: "Uruguay",
      lugarDestino: "Montevideo",
      pesoContenedor: "25200",
      cantidadSacos: "8450",
      contenedores: [
        { cantidad: 13, capacidad: 520 },
        { cantidad: 2, capacidad: 470 },
      ],
      combinacionPermitida:
        "La combinación permite la cantidad exacta solicitada: 8450.0",
      cantidadSacosPermitida:
        "La cantidad de sacos que permite esta combinación es: 8450.0",
      parametrosElegidos: ["proteína", "fibra"],
      divisionRutas: [
        { ruma: "UY2511065", division: "4, 3" },
        { ruma: "UY2511067", division: "2" },
      ],
    },
  },
  {
    code: "HOMCAL000795",
    datoN: "Dato N",
    datoM: "Dato M",
    usuario: "Diego Morales",
    procesado: "2025-06-23 09:50:11",
    status: "Procesado",
    confirmado: true,
    detalles: {
      nombreArchivo: "Asignación_Procesada_2025.06.23.xlsx",
      contrato: "HPE-24 0170 A7",
      paisDestino: "Argentina",
      lugarDestino: "Buenos Aires",
      pesoContenedor: "26800",
      cantidadSacos: "9100",
      contenedores: [
        { cantidad: 14, capacidad: 560 },
        { cantidad: 1, capacidad: 440 },
      ],
      combinacionPermitida:
        "La combinación permite la cantidad exacta solicitada: 9100.0",
      cantidadSacosPermitida:
        "La cantidad de sacos que permite esta combinación es: 9100.0",
      parametrosElegidos: ["tvn", "humedad"],
      divisionRutas: [
        { ruma: "AR2511070", division: "6, 4" },
        { ruma: "AR2511072", division: "1" },
      ],
    },
  },
  {
    code: "HOMCAL000796",
    datoN: "Dato N",
    datoM: "Dato M",
    usuario: "Verónica Díaz",
    procesado: "2025-06-24 14:05:37",
    status: "Pendiente",
    confirmado: false,
    detalles: {
      nombreArchivo: "Asignación_Pendiente_2025.06.24.xlsx",
      contrato: "HPE-24 0170 A8",
      paisDestino: "Bolivia",
      lugarDestino: "Santa Cruz",
      pesoContenedor: "24600",
      cantidadSacos: "8150",
      contenedores: [
        { cantidad: 12, capacidad: 540 },
        { cantidad: 1, capacidad: 670 },
      ],
      combinacionPermitida:
        "La combinación permite la cantidad exacta solicitada: 8150.0",
      cantidadSacosPermitida:
        "La cantidad de sacos que permite esta combinación es: 8150.0",
      parametrosElegidos: ["proteína", "tvn", "humedad"],
      divisionRutas: [
        { ruma: "BO2511074", division: "3, 3" },
        { ruma: "BO2511075", division: "3" },
      ],
    },
  },
  {
    code: "HOMCAL000797",
    datoN: "Dato N",
    datoM: "Dato M",
    usuario: "Renato Valdez",
    procesado: "2025-06-25 10:40:00",
    status: "Procesado",
    confirmado: true,
    detalles: {
      nombreArchivo: "Asignación_Lista_2025.06.25.xlsx",
      contrato: "HPE-24 0170 A9",
      paisDestino: "Paraguay",
      lugarDestino: "Asunción",
      pesoContenedor: "25400",
      cantidadSacos: "8350",
      contenedores: [
        { cantidad: 15, capacidad: 510 },
        { cantidad: 1, capacidad: 500 },
      ],
      combinacionPermitida:
        "La combinación permite la cantidad exacta solicitada: 8350.0",
      cantidadSacosPermitida:
        "La cantidad de sacos que permite esta combinación es: 8350.0",
      parametrosElegidos: ["arena", "tvn"],
      divisionRutas: [
        { ruma: "PY2511080", division: "4, 3" },
        { ruma: "PY2511081", division: "2" },
      ],
    },
  },
  {
    code: "HOMCAL000798",
    datoN: "Dato N",
    datoM: "Dato M",
    usuario: "Gabriela Montenegro",
    procesado: "2025-06-26 16:25:15",
    status: "Pendiente",
    confirmado: false,
    detalles: {
      nombreArchivo: "Asignación_Pendiente_2025.06.26.xlsx",
      contrato: "HPE-24 0170 B0",
      paisDestino: "Panamá",
      lugarDestino: "Colón",
      pesoContenedor: "26000",
      cantidadSacos: "8800",
      contenedores: [
        { cantidad: 14, capacidad: 530 },
        { cantidad: 1, capacidad: 380 },
      ],
      combinacionPermitida:
        "La combinación permite la cantidad exacta solicitada: 8800.0",
      cantidadSacosPermitida:
        "La cantidad de sacos que permite esta combinación es: 8800.0",
      parametrosElegidos: ["fibra", "humedad"],
      divisionRutas: [
        { ruma: "PA2511083", division: "5, 2" },
        { ruma: "PA2511084", division: "2" },
      ],
    },
  },
  {
    code: "HOMCAL000799",
    datoN: "Dato N",
    datoM: "Dato M",
    usuario: "Mario Lozano",
    procesado: "2025-06-27 09:15:00",
    status: "Procesado",
    confirmado: true,
    detalles: {
      nombreArchivo: "Asignación_Completa_2025.06.27.xlsx",
      contrato: "HPE-24 0170 B1",
      paisDestino: "Venezuela",
      lugarDestino: "Puerto Cabello",
      pesoContenedor: "25800",
      cantidadSacos: "8750",
      contenedores: [
        { cantidad: 13, capacidad: 540 },
        { cantidad: 1, capacidad: 680 },
      ],
      combinacionPermitida:
        "La combinación permite la cantidad exacta solicitada: 8750.0",
      cantidadSacosPermitida:
        "La cantidad de sacos que permite esta combinación es: 8750.0",
      parametrosElegidos: ["tvn", "arena", "proteína"],
      divisionRutas: [
        { ruma: "VE2511086", division: "4, 2" },
        { ruma: "VE2511088", division: "5" },
      ],
    },
  },
  {
    code: "HOMCAL000800",
    datoN: "Dato N",
    datoM: "Dato M",
    usuario: "Lucía Fernández",
    procesado: "2025-06-28 13:30:25",
    status: "Pendiente",
    confirmado: false,
    detalles: {
      nombreArchivo: "Asignación_Pendiente_2025.06.28.xlsx",
      contrato: "HPE-24 0170 B2",
      paisDestino: "Costa Rica",
      lugarDestino: "Limón",
      pesoContenedor: "25000",
      cantidadSacos: "8500",
      contenedores: [
        { cantidad: 14, capacidad: 500 },
        { cantidad: 2, capacidad: 450 },
      ],
      combinacionPermitida:
        "La combinación permite la cantidad exacta solicitada: 8500.0",
      cantidadSacosPermitida:
        "La cantidad de sacos que permite esta combinación es: 8500.0",
      parametrosElegidos: ["proteína", "fibra"],
      divisionRutas: [
        { ruma: "CR2511090", division: "3, 4" },
        { ruma: "CR2511091", division: "3" },
      ],
    },
  },
  {
    code: "HOMCAL000801",
    datoN: "Dato N",
    datoM: "Dato M",
    usuario: "José Robles",
    procesado: "2025-06-29 11:05:00",
    status: "Procesado",
    confirmado: true,
    detalles: {
      nombreArchivo: "Asignación_Verificada_2025.06.29.xlsx",
      contrato: "HPE-24 0170 B3",
      paisDestino: "Honduras",
      lugarDestino: "Puerto Cortés",
      pesoContenedor: "26200",
      cantidadSacos: "8950",
      contenedores: [
        { cantidad: 16, capacidad: 530 },
        { cantidad: 1, capacidad: 490 },
      ],
      combinacionPermitida:
        "La combinación permite la cantidad exacta solicitada: 8950.0",
      cantidadSacosPermitida:
        "La cantidad de sacos que permite esta combinación es: 8950.0",
      parametrosElegidos: ["humedad", "tvn"],
      divisionRutas: [
        { ruma: "HN2511095", division: "4" },
        { ruma: "HN2511096", division: "6, 2" },
      ],
    },
  },
  {
    code: "HOMCAL000802",
    datoN: "Dato N",
    datoM: "Dato M",
    usuario: "Natalia Cabrera",
    procesado: "2025-06-30 14:22:18",
    status: "Pendiente",
    confirmado: false,
    detalles: {
      nombreArchivo: "Asignación_Pendiente_2025.06.30.xlsx",
      contrato: "HPE-24 0170 B4",
      paisDestino: "Guatemala",
      lugarDestino: "Puerto Barrios",
      pesoContenedor: "25100",
      cantidadSacos: "8550",
      contenedores: [
        { cantidad: 15, capacidad: 510 },
        { cantidad: 1, capacidad: 500 },
      ],
      combinacionPermitida:
        "La combinación permite la cantidad exacta solicitada: 8550.0",
      cantidadSacosPermitida:
        "La cantidad de sacos que permite esta combinación es: 8550.0",
      parametrosElegidos: ["arena", "proteína"],
      divisionRutas: [
        { ruma: "GT2511098", division: "5, 2" },
        { ruma: "GT2511099", division: "3" },
      ],
    },
  },
  {
    code: "HOMCAL000803",
    datoN: "Dato N",
    datoM: "Dato M",
    usuario: "Esteban León",
    procesado: "2025-07-01 08:10:47",
    status: "Procesado",
    confirmado: true,
    detalles: {
      nombreArchivo: "Asignación_Finalizada_2025.07.01.xlsx",
      contrato: "HPE-24 0170 B5",
      paisDestino: "Nicaragua",
      lugarDestino: "Corinto",
      pesoContenedor: "26400",
      cantidadSacos: "9050",
      contenedores: [
        { cantidad: 13, capacidad: 560 },
        { cantidad: 2, capacidad: 480 },
      ],
      combinacionPermitida:
        "La combinación permite la cantidad exacta solicitada: 9050.0",
      cantidadSacosPermitida:
        "La cantidad de sacos que permite esta combinación es: 9050.0",
      parametrosElegidos: ["tvn", "humedad", "fibra"],
      divisionRutas: [
        { ruma: "NI2511102", division: "4, 3" },
        { ruma: "NI2511103", division: "2" },
      ],
    },
  },
];

export function TableHistoricoLogistica() {
  const style = useButtonsStyles();
  const [page, setPage] = useState(1);

  const handleDownloadReport = (code: string) => {
    console.log(`Descargando reporte para: ${code}`);
  };

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "procesado":
        return (
          <span style={{ fontSize: "0.9rem", color: "#666" }}>
            {item.procesado}
          </span>
        );

      case "confirmado":
        return (
          <span style={{ fontSize: "0.9rem", color: "#666" }}>
            {item.confirmado ? "Confirmado" : "Borrador"}
          </span>
        );

      case "status":
        const statusColorMap: Record<string, string> = {
          Procesado: OrgColors.serotAzul,
          Pendiente: OrgColors.serotAmarillo,
          Aceptado: OrgColors.verde,
        };

        return (
          <Badge
            appearance="filled"
            style={{
              backgroundColor: statusColorMap[item.status] || "#666",
              color: "#fff",
              width: "100%",
            }}
            size="large"
          >
            {item.status.toUpperCase()}
          </Badge>
        );

      case "action":
        return (
          <div className="flex gap-2 justify-start w-full">
            {item.confirmado ? (
              <>
                <Button
                  size="medium"
                  icon={<ProhibitedMultiple24Regular />}
                  className={style.buttonNaranjaBase}
                  onClick={() => handleDownloadReport(item.code)}
                >
                  Borrador
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="medium"
                  icon={<Checkmark24Regular />}
                  className={
                    item.status !== "Procesado"
                      ? style.buttonDisabled
                      : style.buttonNaranjaBase
                  }
                  onClick={() => handleDownloadReport(item.code)}
                  disabled={item.status !== "Procesado"}
                >
                  Confirmar
                </Button>
              </>
            )}

            <Button
              size="medium"
              icon={<ArrowForwardDownLightning24Regular />}
              className={style.buttonAzulOscuroBase}
              onClick={() => handleDownloadReport(item.code)}
            >
              Ejecutar de nuevo
            </Button>

            <TeachingPopover size="large" positioning={{ position: "below" }}>
              <TeachingPopoverTrigger>
                <Button
                  className={style.buttonCelesteBase}
                  icon={<Options24Regular />}
                >
                  Ver Datos
                </Button>
              </TeachingPopoverTrigger>
              <TeachingPopoverSurface>
                <TeachingPopoverBody>
                  <DatosDetalle data={item.detalles} />
                </TeachingPopoverBody>
              </TeachingPopoverSurface>
            </TeachingPopover>

            <Button
              size="medium"
              icon={<DataUsage24Regular />}
              className={style.buttonVerdeBase}
              onClick={() => handleDownloadReport(item.code)}
            >
              Descargar reporte
            </Button>
          </div>
        );

      default:
        return item[columnKey];
    }
  };

  return (
    <Card style={{ width: "100%", height: "100%" }}>
      <div className="w-full h-full flex flex-col  ">
        <div className="w-full h-9/10 ">
          <div className="w-full h-1/15">
            <Title title="Ejecuciones"></Title>
          </div>

          <div className="w-full h-14/15 overflow-y-hidden overflow-x-auto">
            <TableBase
              columns={columns}
              data={data}
              renderCell={renderCell}
              isLoading={false}
              error={null}
              height="100%"
              width="140rem"
            />
          </div>
        </div>

        <div className="w-full h-1/10">
          <Pagination
            currentPage={1}
            totalPages={7}
            totalItems={6}
            onPageChange={setPage}
            hasPrevious={false}
            hasNext={false}
            previousPage={10}
            nextPage={6}
          />
        </div>
      </div>
    </Card>
  );
}
