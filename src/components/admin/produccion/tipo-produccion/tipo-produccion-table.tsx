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
import { useState, useMemo } from "react";
import { useButtonsStyles } from "@/styles/button.styles";
import { ModalBase } from "@/components/ui/modal-base";
import { Pagination } from "@/components/ui/pagination-base";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import useSWR, { mutate } from "swr";
import { useAsyncAction } from "@/hooks/use-async-action";
import { BaseResponse } from "@/interface";
import { TipoProduccionPanel } from "./tipo-produccion-panel";
import { TipoProduccionService } from "@/services/tipo-produccion.service";
import { LineaProduccionService } from "@/services/linea-produccion.service";
import { AgregadoService } from "@/services/agregado.service";
import {
  ITipoProduccionResponse,
  PagedTipoProduccionResponse,
} from "@/interface/admin/tipo-produccion";
import { useAuth } from "@/hooks/use-auth";

const columns = [
  { uid: "codigo", name: "Codigo", width: 5 },
  { uid: "nombre", name: "Nombre", width: 5 },
  { uid: "descripcion", name: "Descripción", width: 10 },
  { uid: "linea_produccion_id", name: "Línea", width: 5 },
  { uid: "agregado_id", name: "Agregado", width: 5 },
  { uid: "activo", name: "Estado", width: 7 },
  { uid: "action", name: "Acciones", width: 5 },
];

const buildTipoProduccionKey = (page: number, size: number) =>
  `tipoproduccion-page-${page}-${size}`;

export function TipoProduccionTable() {
  const style = useButtonsStyles();
  const deleteAction = useAsyncAction();
  const { user } = useAuth();

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const swrKey = buildTipoProduccionKey(page, pageSize);

  const {
    data: dataTipos,
    isLoading: loadingTipos,
    error: errorTipos,
  } = useSWR<BaseResponse<PagedTipoProduccionResponse>>(
    swrKey,
    () => TipoProduccionService.listar(page, pageSize),
    { revalidateOnFocus: false, revalidateIfStale: true }
  );

  const { data: lineasLookup } = useSWR(
    "lookup-lineas-produccion",
    () => LineaProduccionService.listar(1, 500)
  );
  const { data: agregadosLookup } = useSWR(
    "lookup-agregados-produccion",
    () => AgregadoService.listar(1, 500)
  );
  const lineasMap = useMemo(() => {
    return Object.fromEntries((lineasLookup?.data?.items || []).map((l: any) => [l.id, l.codigo]));
  }, [lineasLookup]);
  const agregadosMap = useMemo(() => {
    return Object.fromEntries((agregadosLookup?.data?.items || []).map((a: any) => [a.id, a.codigo]));
  }, [agregadosLookup]);

  const rawItems: any[] = dataTipos?.data?.items || [];
  const items: any[] = rawItems.map(it => ({
    ...it,
    linea_produccion_id: it.linea_produccion_id || it.LineaProduccionId || it.lineaProduccionId,
    agregado_id: it.agregado_id || it.AgregadoId || it.agregadoId,
  }));
  const paginationCurrentPage = dataTipos?.data?.page || page;
  const paginationTotalPages = dataTipos?.data?.totalPages || 1;
  const paginationTotalItems =
    dataTipos?.data?.total ||
    (paginationTotalPages - 1) * pageSize + items.length;

  const [openPanel, setOpenPanel] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [idTipo, setIdTipo] = useState<string | undefined>(undefined);
  const [isClosingAfterSuccess, setIsClosingAfterSuccess] = useState(false);
  const [mode, setMode] = useState<"crear" | "editar" | "detalle">("crear");

  const handleOpenCrear = () => {
    setMode("crear");
    setIdTipo(undefined);
    setOpenPanel(true);
  };

  const handleOpenEditar = (registroId: string) => {
    setMode("editar");
    setIdTipo(registroId);
    setOpenPanel(true);
  };

  const handleOpenDetalle = (registroId: string) => {
    setMode("detalle");
    setIdTipo(registroId);
    setOpenPanel(true);
  };

  const handleClosePanel = () => {
    setOpenPanel(false);

    setTimeout(() => {
      setIdTipo(undefined); // importante limpiar el ID
      setMode("crear"); // o el modo por defecto
    }, 30);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setInfoTipo(null);
    setIsClosingAfterSuccess(false);
    deleteAction.reset();
  };

  const [infoTipo, setInfoTipo] = useState<{
    id: number;
    codigo: string;
  } | null>(null);

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "linea_produccion_id":
        return lineasMap[item.linea_produccion_id] || lineasMap[item.LineaProduccionId] || lineasMap[item.lineaProduccionId] || "";
      case "agregado_id":
        return agregadosMap[item.agregado_id] || agregadosMap[item.AgregadoId] || agregadosMap[item.agregadoId] || "";
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
            <Tooltip content="Info" relationship="label">
              <Button
                size="large"
                appearance="subtle"
                onClick={() => handleOpenDetalle(item.id)}
                icon={<Info24Filled style={{ color: OrgColors.serotGris }} />}
              />
            </Tooltip>
            <Tooltip content="Editar" relationship="label">
              <Button
                size="large"
                appearance="subtle"
                onClick={() => handleOpenEditar(item.id)}
                icon={<Edit24Filled style={{ color: OrgColors.azulOscuro }} />}
              />
            </Tooltip>

            <Tooltip content="Eliminar" relationship="label">
              <Button
                size="large"
                appearance="subtle"
                onClick={() => {
                  setInfoTipo({
                    id: item.id,
                    codigo: item.codigo,
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

  const handlePanelSuccess = () => {
    const isLastPage = paginationCurrentPage === paginationTotalPages;
    const isFullLastPage = items.length >= pageSize;
    mutate(buildTipoProduccionKey(paginationCurrentPage, pageSize));
    if (isLastPage && isFullLastPage) {
      const nextPage = paginationCurrentPage + 1;
      setPage(nextPage);
      mutate(buildTipoProduccionKey(nextPage, pageSize));
    } else {
      if (paginationCurrentPage !== 1)
        mutate(buildTipoProduccionKey(1, pageSize));
    }
  };

  const acctionDeleteModal = async () => {
    if (!infoTipo) return;
    const userId = user?.id;
    if (!userId)
      throw new Error("No se encontró el id del usuario autenticado");

    const willBeLastOnPage = items.length === 1 && page > 1;
    await deleteAction.execute(
      async () => {
        await TipoProduccionService.eliminar(infoTipo.id.toString(), userId);
        return { success: true, message: "Tipo de Producción eliminado correctamente" };
      },
      buildTipoProduccionKey(page, pageSize)
    );
    mutate(buildTipoProduccionKey(page, pageSize));
    if (willBeLastOnPage) {
      const prevPage = page - 1;
      setPage(prevPage);
      mutate(buildTipoProduccionKey(prevPage, pageSize));
    } else {
      mutate(buildTipoProduccionKey(paginationTotalPages, pageSize));
    }
  };

  return (
    <>
      <Card style={{ width: "100%", height: "100%" }}>
        <div className="w-full h-full flex flex-col  ">
          <div className="w-full h-9/10 ">
            <div className="w-full h-2/25 flex justify-between items-start ">
              <Title title="Tipos de Producción" />
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
                data={items}
                renderCell={renderCell}
                isLoading={loadingTipos}
                error={errorTipos}
                height="100%"
              />
            </div>
          </div>

          <div className="w-full h-1/10">
            {items.length > 0 && (
              <Pagination
                currentPage={paginationCurrentPage}
                totalPages={paginationTotalPages}
                totalItems={paginationTotalItems}
                onPageChange={setPage}
              />
            )}
          </div>
        </div>
      </Card>

      <TipoProduccionPanel
        mode={mode}
        open={openPanel}
        close={handleClosePanel}
        id={idTipo}
        onSuccess={handlePanelSuccess}
      />

      <ModalBase
        open={openModal}
        setOpen={(isOpen) => {
          if (!isOpen) {
            handleCloseModal();
          } else {
            setOpenModal(isOpen);
          }
        }}
        type="alert"
        buttonText="Eliminar"
        closeOnOutsideClick={false}
        buttonAction={acctionDeleteModal}
        requiereAction={!deleteAction.isSuccess && !isClosingAfterSuccess}
      >
        <>
          {!deleteAction.isSuccess && (
            <>
              ¿Está seguro de eliminar el tipo de producción con código{" "}
              <span className="font-bold">{infoTipo?.codigo}</span>?
            </>
          )}
          {deleteAction.isLoading && (
            <AsyncActionDisplay
              state={deleteAction.state}
              loadingMessage="Eliminando tipo de producción..."
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
              successMessage="Tipo de Producción eliminado correctamente"
              onSuccess={() => {
                setIsClosingAfterSuccess(true);
                setOpenModal(false);
                setInfoTipo(null);
                setTimeout(() => {
                  deleteAction.reset();
                  setIsClosingAfterSuccess(false);
                }, 300);
              }}
            />
          )}
        </>
      </ModalBase>
    </>
  );
}
