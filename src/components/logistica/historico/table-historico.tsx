"use client"

import { TableBase } from "@/components/ui/table-base"
import { DatosDetalle } from "@/components/logistica/historico/datos-detalle"
import { Title } from "@/components/ui/title"
import { OrgColors } from "@/config/app.config.server"
import { hexToRgba } from "@/utils/colors"
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
} from "@fluentui/react-components"
import { DataUsage24Regular, Options24Regular } from "@fluentui/react-icons"

const columns = [
  { uid: "code", name: "Codigo", width: 5 },
  { uid: "datoN", name: "Dato-N", width: 7 },
  { uid: "datoM", name: "Dato-M", width: 7 },
  { uid: "usuario", name: "Usuario", width: 7 },
  { uid: "procesado", name: "Procesado", width: 10 },
  { uid: "status", name: "Estado", width: 7 },
  { uid: "action", name: "Acciones", width: 15 },
]

const data = [
  {
    code: "HOMCAL000567",
    datoN: "Dato N",
    datoM: "Dato M",
    usuario: "Ivan Sanchez",
    procesado: "2025-05-05 14:52:24",
    status: "Procesado",
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
      combinacionPermitida: "La combinación permite la cantidad exacta solicitada: 9860.0",
      cantidadSacosPermitida: "La cantidad de sacos que permite esta combinación es: 9860.0",
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
      combinacionPermitida: "La combinación permite la cantidad exacta solicitada: 8500.0",
      cantidadSacosPermitida: "La cantidad de sacos que permite esta combinación es: 8500.0",
      parametrosElegidos: ["proteína", "humedad"],
      divisionRutas: [
        { ruma: "CH2511018", division: "4, 2" },
        { ruma: "CH2511019", division: "6" },
      ],
    },
  },
]

const baseButtonStyle = {
  color: "white",
  fontSize: "1rem",
}

const useStyles = makeStyles({
  button: {
    ...baseButtonStyle,
    backgroundColor: OrgColors.serotAzul,
    ":hover": {
      backgroundColor: hexToRgba(OrgColors.serotAzul, 0.8),
      color: "#fff",
    },
  },
  buttonDownload: {
    ...baseButtonStyle,
    backgroundColor: OrgColors.serotVerde,
    ":hover": {
      backgroundColor: hexToRgba(OrgColors.serotVerde, 0.8),
      color: "#fff",
    },
  },
})

export function TableHistoricoLogistica() {
  const style = useStyles()

  const handleDownloadReport = (code: string) => {
    console.log(`Descargando reporte para: ${code}`)
  }

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "procesado":
        return <span style={{ fontSize: "0.9rem", color: "#666" }}>{item.procesado}</span>

      case "status":
        const statusColorMap: Record<string, string> = {
          Procesado: OrgColors.serotAzul,
          Pendiente: OrgColors.serotAmarillo,
          Aceptado: OrgColors.verde,
        }

        return (
          <Badge
            appearance="filled"
            style={{
              backgroundColor: statusColorMap[item.status] || "#666",
              color: "#fff",
              width: "10rem",
            }}
            size="large"
          >
            {item.status.toUpperCase()}
          </Badge>
        )

      case "action":
        return (
          <div className="flex gap-2 justify-start w-full">
            <TeachingPopover size="large" positioning={{ position: "below" }}>
              <TeachingPopoverTrigger>
                <Button className={style.button} icon={<Options24Regular />}>
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
              className={style.buttonDownload}
              onClick={() => handleDownloadReport(item.code)}
            >
              Descargar reporte
            </Button>
          </div>
        )

      default:
        return item[columnKey]
    }
  }

  return (
    <Card>
      <CardPreview>
        <div
          className="p-3"
          style={{
            width: "100%",
            height: "44em",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <Title title="Ejecuciones" />
          <TableBase
            columns={columns}
            data={data}
            renderCell={renderCell}
            isLoading={false}
            error={null}
            height="80%"
          />
        </div>
      </CardPreview>
    </Card>
  )
}
