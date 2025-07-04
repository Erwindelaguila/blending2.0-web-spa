"use client";

import { TableBase } from "@/components/ui/table-base";
import { Title } from "@/components/ui/title";
import { OrgColors } from "@/config/app.config.server";
import {
  Badge,
  Button,
  Card,
  CardPreview,
  Tooltip,
} from "@fluentui/react-components";
import {
  Add24Regular,
  Delete24Filled,
  Edit24Filled,
  Info24Filled,
} from "@fluentui/react-icons";
import { useState } from "react";
import { PanelCrearPlanta } from "./panel-crear-planta";
import { useButtonsStyles } from "@/styles/button.styles";
import { ModalBase } from "@/components/ui/modal-base";
import { Pagination } from "@/components/ui/pagination-base";
import useSWR from "swr";
import { ICalidad } from "@/interface";
import { getAllCalidadKey } from "@/lib/constants/key-fetch";
import { CalidadFechApi } from "@/services/calidad-service-api";
import { CalidadesService } from "@/services";
import { useAsyncAction } from "@/hooks/use-async-action";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";

const columns = [
  { uid: "code", name: "Codigo", width: 10 },
  { uid: "name", name: "Nombre", width: 10 },
  { uid: "numero_rumas", name: "Nro. de Rumas", width: 5 },
  { uid: "description", name: "Usuario", width: 20 },
  { uid: "status", name: "Estado", width: 6 },
  { uid: "action", name: "Acciones", width: 5 },
];

const data = [
  {
    code: "TCNO",
    name: "Callao",
    numero_rumas: "7",
    description: "Planta de Homogenizado del Callao ...",
    status: "Activo",
  },
  {
    code: "ABCD",
    name: "Vegueta",
    numero_rumas: "19",
    description: "Planta de Homogenizado del Vegueta ...",
    status: "Inactivo",
  },
  {
    code: "CHIM",
    name: "Chimbote",
    numero_rumas: "15",
    description: "Planta de Homogenizado de Chimbote ...",
    status: "Activo",
  },
  {
    code: "MOTU",
    name: "Motupe",
    numero_rumas: "12",
    description: "Planta de Homogenizado de Motupe ...",
    status: "Activo",
  },
  {
    code: "SUPE",
    name: "Supe",
    numero_rumas: "9",
    description: "Planta de Homogenizado de Supe ...",
    status: "Inactivo",
  },
  {
    code: "SECH",
    name: "Sechura",
    numero_rumas: "20",
    description: "Planta de Homogenizado de Sechura ...",
    status: "Activo",
  },
  {
    code: "PAIT",
    name: "Paita",
    numero_rumas: "11",
    description: "Planta de Homogenizado de Paita ...",
    status: "Activo",
  },
  {
    code: "ILO1",
    name: "Ilo Norte",
    numero_rumas: "6",
    description: "Planta de Homogenizado de Ilo Norte ...",
    status: "Inactivo",
  },
  {
    code: "MOLI",
    name: "Mollendo",
    numero_rumas: "10",
    description: "Planta de Homogenizado de Mollendo ...",
    status: "Activo",
  },
  {
    code: "COIS",
    name: "Coishco",
    numero_rumas: "8",
    description: "Planta de Homogenizado de Coishco ...",
    status: "Activo",
  },
  {
    code: "ATAM",
    name: "Atamal",
    numero_rumas: "5",
    description: "Planta de Homogenizado de Atamal ...",
    status: "Inactivo",
  },
];

export function TablePlanta() {
  const deleteAction = useAsyncAction();
  const style = useButtonsStyles();

  /**Cambiar clave, servicio y interface  Por  para Planta Homogenizado*/
  /**------------------------------------------------------ */
  const {
    data: dataPlantas,
    isLoading: loadingPlantas,
    error: errorPlantas,
  } = useSWR<ICalidad[]>(getAllCalidadKey, CalidadesService.get, {
    revalidateOnFocus: false,
    revalidateIfStale: true,
  });

  /**------------------------------------------------------ */

  const [openPanel, setOpenPanel] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  /**------------------------------------------------------ */
  const [idPlanta, setIdPlanta] = useState<string | undefined>(undefined);
  const [mode, setMode] = useState<"crear" | "editar" | "detalle">("crear");
  /**------------------------------------------------------ */

  const [page, setPage] = useState(1);

  const handleOpenCrear = () => {
    setMode("crear");
    setIdPlanta(undefined);
    setOpenPanel(true);
  };

  const handleOpenEditar = (registroId: string) => {
    setMode("editar");
    setIdPlanta(registroId);
    setOpenPanel(true);
  };

  const handleOpenDetalle = (registroId: string) => {
    setMode("detalle");
    setIdPlanta(registroId);
    setOpenPanel(true);
  };

  const handleClosePanel = () => {
    setOpenPanel(false);

    setTimeout(() => {
      setIdPlanta(undefined); // importante limpiar el ID
      setMode("crear"); // o el modo por defecto
    }, 30);
  };

  /**------------------------------------------------------ */
  const [infoPlanta, setInfoPlanta] = useState<{
    codigo: string;
    nombre: string;
  } | null>(null);
  /**------------------------------------------------------ */

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "status":
        const statusColorMap: Record<string, string> = {
          Activo: OrgColors.serotAzul,
          Inactivo: OrgColors.rojo,
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
            {/*item.status.toUpperCase()*/}
            {item.status}
          </Badge>
        );

      case "action":
        return (
          <div className="flex gap-1 justify-center w-full py-0.5">
            <Tooltip content="Info Planta" relationship="label">
              <Button
                size="large"
                appearance="subtle"
                onClick={() => handleOpenDetalle(item.id)}
                icon={<Info24Filled style={{ color: OrgColors.serotGris }} />}
              />
            </Tooltip>

            <Tooltip content="Editar Planta" relationship="label">
              <Button
                size="large"
                appearance="subtle"
                onClick={() => handleOpenEditar(item.id)}
                icon={<Edit24Filled style={{ color: OrgColors.azulOscuro }} />}
              />
            </Tooltip>

            <Tooltip content="Eliminar Planta" relationship="label">
              <Button
                size="large"
                appearance="subtle"
                onClick={() => {
                  setInfoPlanta({
                    codigo: item.code,
                    nombre: item.name,
                  });
                  setOpenModal(true);
                }}
                icon={<Delete24Filled style={{ color: OrgColors.rojo }} />}
              />
            </Tooltip>
          </div>
        );

      default:
        return item[columnKey];
    }
  };

  const acctionDeleteModal = async () => {
    if (!infoPlanta) return;
  };

  return (
    <>
      <Card style={{ width: "100%", height: "100%" }}>
        <div className="w-full h-full flex flex-col  ">
          <div className="w-full h-9/10 ">
            <div className="w-full h-2/25 flex justify-between items-start ">
              <Title title="Plantas de Homogenizado" />
              <Button
                size="large"
                icon={<Add24Regular></Add24Regular>}
                className={`w-[13rem] ${style.buttonVerdeBase}`}
                onClick={() => handleOpenCrear()}
              >
                Nuevo
              </Button>
            </div>

            <div className="w-full h-23/25">
              <TableBase
                columns={columns}
                data={dataPlantas ?? []}
                renderCell={renderCell}
                isLoading={loadingPlantas}
                error={errorPlantas}
                height="100%"
              />
            </div>
          </div>

          <div className="w-full h-1/10">
            <Pagination
              totalItems={180}
              currentPage={page}
              totalPages={5}
              onPageChange={setPage}
            />
          </div>
        </div>
      </Card>

      <PanelCrearPlanta
        mode={mode}
        open={openPanel}
        close={handleClosePanel}
        id={idPlanta}
      />

      <ModalBase
        open={openModal}
        setOpen={setOpenModal}
        type="alert"
        buttonText="Eliminar"
        buttonAction={acctionDeleteModal}
      >
        <>
          ¿Está seguro de eliminar la calidad con código{" "}
          <span className="font-bold">{infoPlanta?.codigo}</span>?
          {deleteAction.isLoading && (
            <AsyncActionDisplay
              state={deleteAction.state}
              loadingMessage="Eliminando calidad..."
              successMessage=""
            />
          )}
          {deleteAction.error && (
            <AsyncActionDisplay
              state={deleteAction.state}
              loadingMessage=""
              successMessage=""
              error={deleteAction.error}
              onErrorDismiss={deleteAction.reset}
            />
          )}
          {deleteAction.isSuccess && (
            <AsyncActionDisplay
              state={deleteAction.state}
              loadingMessage=""
              successMessage="Calidad eliminada correctamente"
              onSuccess={() => {
                deleteAction.reset();
                setOpenModal(false);
              }}
            />
          )}
        </>
      </ModalBase>
    </>
  );
}
