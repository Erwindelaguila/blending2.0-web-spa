import { TableBase } from "@/components/ui/table-base";
import { TableDynamic } from "@/components/ui/table-dynamic";
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
  TeachingPopoverFooter,
  TeachingPopoverHeader,
  TeachingPopoverSurface,
  TeachingPopoverTitle,
  TeachingPopoverTrigger,
} from "@fluentui/react-components";
import {
  DataUsage24Regular,
  Eye24Regular,
  Options24Regular,
  Search24Regular,
} from "@fluentui/react-icons";
import { useRouter } from "next/navigation";

const columns = [
  { uid: "code", name: "Codigo", width: 5 },
  { uid: "datoN", name: "Dato-N", width: 7 },
  { uid: "datoM", name: "Dato-M", width: 7 },
  { uid: "usuario", name: "Usuario", width: 7 },
  { uid: "status", name: "Estado", width: 7 },
  { uid: "action", name: "Acciones", width: 20 },
];

const data = [
  {
    code: "HOMCAL000567",
    datoN: "Dato N",
    datoM: "Dato M",
    usuario: "Ivan Sanchez",
    processDate: "2025-05-05 14:52:24",
    status: "Procesado",
    calidades: [
      {
        calidad: "CALIDAD-01",
        PARAM01: "345",
        PARAM02: "34.6",
        PARAM03: "384.9",
        PARAM04: "84.9",
      },
      {
        calidad: "CALIDAD-02",
        PARAM01: "345",
        PARAM02: "875.5",
        PARAM03: "76.4",
        PARAM04: "38.9",
      },
      {
        calidad: "CALIDAD-03",
        PARAM01: "754",
        PARAM02: "67.56",
        PARAM03: "76.4",
        PARAM04: "54.7",
      },
    ],
  },
  {
    code: "HOMCAL000234",
    datoN: "Dato N",
    datoM: "Dato M",
    usuario: "Victor Castañeda",
    processDate: "2025-05-05 14:52:24",
    status: "Pendiente",
    calidades: [
      {
        calidad: "CALIDAD-01",
        PARAM01: "345",
        PARAM02: "34.6",
      },
      {
        calidad: "CALIDAD-02",
        PARAM01: "345",
        PARAM02: "875.5",
      },
      {
        calidad: "CALIDAD-03",
        PARAM01: "754",
        PARAM02: "67.56",
      },
    ],
  },
  {
    code: "HOMCAL000765",
    datoN: "Dato N",
    datoM: "Dato M",
    usuario: "Erwin Afgila",
    processDate: "2025-05-05 14:52:24",
    status: "Aceptado",
    calidades: [
      {
        calidad: "CALIDAD-01",
        PARAM01: "345",
        PARAM02: "34.6",
        PARAM03: "384.9",
        PARAM04: "84.9",
        PARAM05: "675.3",
      },
      {
        calidad: "CALIDAD-02",
        PARAM01: "345",
        PARAM02: "875.5",
        PARAM03: "76.4",
        PARAM04: "38.9",
        PARAM05: "974.3",
      },
      {
        calidad: "CALIDAD-03",
        PARAM01: "754",
        PARAM02: "67.56",
        PARAM03: "76.4",
        PARAM04: "54.7",
        PARAM05: "32.5",
      },
    ],
  },
  {
    code: "HOMCAL000876",
    datoN: "Dato N",
    datoM: "Dato M",
    usuario: "María López",
    processDate: "2025-05-05 15:10:12",
    status: "Pendiente",
    calidades: [
      {
        calidad: "CALIDAD-01",
        PARAM01: "345",
        PARAM02: "34.6",
        PARAM03: "384.9",
        PARAM04: "84.9",
        PARAM05: "675.3",
        PARAM06: "83.6",
        PARAM07: "95.4",
      },
      {
        calidad: "CALIDAD-02",
        PARAM01: "345",
        PARAM02: "875.5",
        PARAM03: "76.4",
        PARAM04: "38.9",
        PARAM05: "974.3",
        PARAM06: "423.4",
        PARAM07: "982.4",
      },
      {
        calidad: "CALIDAD-03",
        PARAM01: "754",
        PARAM02: "67.56",
        PARAM03: "76.4",
        PARAM04: "54.7",
        PARAM05: "32.5",
        PARAM06: "543.5",
        PARAM07: "83.4",
      },
    ],
  },
  {
    code: "HOMCAL000543",
    datoN: "Dato N",
    datoM: "Dato M",
    usuario: "Luis Torres",
    processDate: "2025-05-05 15:18:40",
    status: "Procesado",
    calidades: [
      {
        calidad: "CALIDAD-01",
        PARAM01: "345",
        PARAM02: "34.6",
        PARAM03: "384.9",
        PARAM04: "84.9",
      },
      {
        calidad: "CALIDAD-02",
        PARAM01: "345",
        PARAM02: "875.5",
        PARAM03: "76.4",
        PARAM04: "38.9",
      },
      {
        calidad: "CALIDAD-03",
        PARAM01: "754",
        PARAM02: "67.56",
        PARAM03: "76.4",
        PARAM04: "54.7",
      },
    ],
  },
  {
    code: "HOMCAL000982",
    datoN: "Dato N",
    datoM: "Dato M",
    usuario: "Carla Rivas",
    processDate: "2025-05-05 15:25:01",
    status: "Aceptado",
  },
  {
    code: "HOMCAL000321",
    datoN: "Dato N",
    datoM: "Dato M",
    usuario: "Eduardo Mejía",
    processDate: "2025-05-05 15:30:44",
    status: "Procesado",
    calidades: [
      {
        calidad: "CALIDAD-01",
        PARAM01: "345",
        PARAM02: "34.6",
        PARAM03: "384.9",
        PARAM04: "84.9",
        PARAM05: "675.3",
      },
      {
        calidad: "CALIDAD-02",
        PARAM01: "345",
        PARAM02: "875.5",
        PARAM03: "76.4",
        PARAM04: "38.9",
        PARAM05: "974.3",
      },
      {
        calidad: "CALIDAD-03",
        PARAM01: "754",
        PARAM02: "67.56",
        PARAM03: "76.4",
        PARAM04: "54.7",
        PARAM05: "32.5",
      },
    ],
  },
  {
    code: "HOMCAL000654",
    datoN: "Dato N",
    datoM: "Dato M",
    usuario: "Pamela Quispe",
    processDate: "2025-05-05 15:36:19",
    status: "Pendiente",

    calidades: [
      {
        calidad: "CALIDAD-01",
        PARAM01: "345",
        PARAM02: "34.6",
        PARAM03: "384.9",
        PARAM04: "84.9",
      },
      {
        calidad: "CALIDAD-02",
        PARAM01: "345",
        PARAM02: "875.5",
        PARAM03: "76.4",
        PARAM04: "38.9",
      },
      {
        calidad: "CALIDAD-03",
        PARAM01: "754",
        PARAM02: "67.56",
        PARAM03: "76.4",
        PARAM04: "54.7",
      },
    ],
  },
  {
    code: "HOMCAL000888",
    datoN: "Dato N",
    datoM: "Dato M",
    usuario: "Daniel Huamán",
    processDate: "2025-05-05 15:42:03",
    status: "Procesado",
    calidades: [
      {
        calidad: "CALIDAD-01",
        PARAM01: "345",
        PARAM02: "34.6",
        PARAM03: "384.9",
        PARAM04: "84.9",
      },
      {
        calidad: "CALIDAD-02",
        PARAM01: "345",
        PARAM02: "875.5",
        PARAM03: "76.4",
        PARAM04: "38.9",
      },
      {
        calidad: "CALIDAD-03",
        PARAM01: "754",
        PARAM02: "67.56",
        PARAM03: "76.4",
        PARAM04: "54.7",
      },
    ],
  },
  {
    code: "HOMCAL000999",
    datoN: "Dato N",
    datoM: "Dato M",
    usuario: "Laura Sánchez",
    processDate: "2025-05-05 15:47:27",
    status: "Aceptado",
    calidades: [
      {
        calidad: "CALIDAD-01",
        PARAM01: "345",
        PARAM02: "34.6",
        PARAM03: "384.9",
        PARAM04: "84.9",
      },
      {
        calidad: "CALIDAD-02",
        PARAM01: "345",
        PARAM02: "875.5",
        PARAM03: "76.4",
        PARAM04: "38.9",
      },
      {
        calidad: "CALIDAD-03",
        PARAM01: "754",
        PARAM02: "67.56",
        PARAM03: "76.4",
        PARAM04: "54.7",
      },
    ],
  },
];

const datosEjemplo = [
  {
    calidad: "CALIDAD-01",
    PARAM01: 67.9,
    PARAM02: 480,
    PARAM03: "APROBADO",
  },
  {
    calidad: "CALIDAD-02",
    PARAM01: 68.2,
    PARAM02: 470,
    PARAM04: "RECHAZADO",
  },
  {
    calidad: "CALIDAD-03",
    PARAM01: 69.5,
    PARAM03: "OBSERVADO",
  },
];

const baseButtonStyle = {
  //padding: "0.4rem",
  color: "white",
  fontSize: "1rem",
};

const useStyles = makeStyles({
  button: {
    ...baseButtonStyle,
    backgroundColor: OrgColors.serotAzul,
    ":hover": {
      backgroundColor: hexToRgba(OrgColors.serotAzul, 0.8),
      color: "#fff",
    },
  },

  buttonR: {
    ...baseButtonStyle,
    backgroundColor: OrgColors.serotVerde,
    ":hover": {
      backgroundColor: hexToRgba(OrgColors.serotVerde, 0.8),
      color: "#fff",
    },
  },
});

export function TableHistorico() {
  const style = useStyles();
  const router = useRouter();

  const goSeeReport = (code: string) => {
    router.push(`/consultas/historico-harina/ver-reporte?uid=${code}`);
  };

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "status":
        const statusColorMap: Record<string, string> = {
          Procesado: OrgColors.serotAzul, // Azul
          Pendiente: OrgColors.serotAmarillo, // Rojo
          Aceptado: OrgColors.verde, // Verde
        };

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
        );

      case "action":
        return (
          <div className="flex gap-2 justify-between w-full ">
            {/**
             * <Button
              size="large"
              icon={<Options24Regular></Options24Regular>}
              
            >
              Ver Parametros
            </Button>
             * 
             */}
            <TeachingPopover size="large" positioning={{ position: "below" }}>
              <TeachingPopoverTrigger>
                <Button
                  className={style.button}
                  icon={<Options24Regular></Options24Regular>}
                >
                  Ver Parametros
                </Button>
              </TeachingPopoverTrigger>
              <TeachingPopoverSurface>
                <TeachingPopoverBody>
                  <div>
                    <TableDynamic
                      calidades={item.calidades}
                      title={`Parámetros`}
                    ></TableDynamic>
                  </div>
                </TeachingPopoverBody>
              </TeachingPopoverSurface>
            </TeachingPopover>

            <Button
              size="medium"
              icon={<DataUsage24Regular></DataUsage24Regular>}
              className={style.buttonR}
            >
              Descargar reporte
            </Button>

            <Button
              size="medium"
              icon={<Eye24Regular></Eye24Regular>}
              className={style.button}
              onClick={() => goSeeReport(item.code)}
            >
              ver reporte
            </Button>
          </div>
        );

      default:
        return item[columnKey];
    }
  };

  return (
    <>
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
            <Title title="Ejecuciones"></Title>

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
    </>
  );
}
