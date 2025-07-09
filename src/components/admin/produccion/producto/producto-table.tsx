"use client";

import { TableBase } from "@/components/ui/table-base";
import { Title } from "@/components/ui/title";
import { OrgColors } from "@/config/app.config.server";
import { Badge, Button, Card, Tooltip } from "@fluentui/react-components";
import {
  Add24Regular,
  Delete24Filled,
  Edit24Filled,
  Info24Filled,
} from "@fluentui/react-icons";
import { useState } from "react";
import { useButtonsStyles } from "@/styles/button.styles";
import { ModalBase } from "@/components/ui/modal-base";
import { Pagination } from "@/components/ui/pagination-base";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import useSWR from "swr";
import { useAsyncAction } from "@/hooks/use-async-action";
import { ICalidad } from "@/interface";
import { getAllCalidadKey } from "@/lib/constants/key-fetch";
import { CalidadesService } from "@/services";
import { ProductoPanel } from "./producto-panel";

const columns = [
  { uid: "codigo", name: "Codigo", width: 5 },
  { uid: "nombre", name: "Nombre", width: 5 },
  { uid: "descripcion", name: "Descripción", width: 10 },
  { uid: "codigoMaterial", name: "Código de Material", width: 5 },
  { uid: "activo", name: "Estado", width: 7 },
  { uid: "action", name: "Acciones", width: 5 },
];

export function ProductoTable() {
  const style = useButtonsStyles();
  const deleteAction = useAsyncAction();

  const {
    data: dataCalidades,
    isLoading: loadingCalidades,
    error: errorCalidades,
  } = useSWR<ICalidad[]>(getAllCalidadKey, CalidadesService.get, {
    revalidateOnFocus: false,
    revalidateIfStale: true,
  });

  const [openPanel, setOpenPanel] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [idCalidad, setIdCalidad] = useState<string | undefined>(undefined);

  const [mode, setMode] = useState<"crear" | "editar" | "detalle">("crear");
  const [page, setPage] = useState(1);

  const handleOpenCrear = () => {
    setMode("crear");
    setIdCalidad(undefined);
    setOpenPanel(true);
  };

  const handleOpenEditar = (registroId: string) => {
    setMode("editar");
    setIdCalidad(registroId);
    setOpenPanel(true);
  };

  const handleOpenDetalle = (registroId: string) => {
    setMode("detalle");
    setIdCalidad(registroId);
    setOpenPanel(true);
  };

  const handleClosePanel = () => {
    setOpenPanel(false);

    setTimeout(() => {
      setIdCalidad(undefined); // importante limpiar el ID
      setMode("crear"); // o el modo por defecto
    }, 30);
  };

  const [infoCalidad, setInfoCalidad] = useState<{
    id: number;
    codigo: string;
  } | null>(null);

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "activo":
        const statusColorMap: Record<string, string> = {
          Activo: OrgColors.serotAzul,
          Inactivo: OrgColors.rojo,
        };
        return (
          <Badge
            appearance="filled"
            style={{
              backgroundColor:
                statusColorMap[item.activo ? "Activo" : "Inactivo"] || "#666",
              color: "#fff",
              width: "100%",
            }}
            size="large"
          >
            {item.activo ? "ACTIVO" : "INACTIVO"}
          </Badge>
        );
      case "action":
        return (
          <div className="flex gap-1 justify-center w-full py-0.5">
            <Tooltip content="Info Calidad" relationship="label">
              <Button
                size="large"
                appearance="subtle"
                onClick={() => handleOpenDetalle(item.id)}
                icon={<Info24Filled style={{ color: OrgColors.serotGris }} />}
              />
            </Tooltip>
            <Tooltip content="Editar Calidad" relationship="label">
              <Button
                size="large"
                appearance="subtle"
                onClick={() => handleOpenEditar(item.id)}
                icon={<Edit24Filled style={{ color: OrgColors.azulOscuro }} />}
              />
            </Tooltip>

            <Tooltip content="Eliminar Calidad" relationship="label">
              <Button
                size="large"
                appearance="subtle"
                onClick={() => {
                  setInfoCalidad({
                    id: item.id,
                    codigo: item.code,
                  });
                  setOpenModal(true);
                }}
                icon={<Delete24Filled style={{ color: OrgColors.rojo }} />}
              />
            </Tooltip>
          </div>
        );
      default:
        return item[columnKey] ?? "";
    }
  };

  const acctionDeleteModal = async () => {
    if (!infoCalidad) return;
  };
  return (
    <>
      <Card style={{ width: "100%", height: "100%" }}>
        <div className="w-full h-full flex flex-col  ">
          <div className="w-full h-9/10 ">
            <div className="w-full h-2/25 flex justify-between items-start ">
              <Title title="Productos" />
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
                data={dataCalidades ?? []}
                renderCell={renderCell}
                isLoading={loadingCalidades}
                error={errorCalidades}
                height="100%"
              />
            </div>
          </div>

          <div className="w-full h-1/10">
            {dataCalidades && (
              <Pagination
                currentPage={page}
                totalPages={10}
                totalItems={12}
                onPageChange={setPage}
              />
            )}
          </div>
        </div>
      </Card>

      <ProductoPanel
        mode={mode}
        open={openPanel}
        close={handleClosePanel}
        id={idCalidad}
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
          <span className="font-bold">{infoCalidad?.codigo}</span>?
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
