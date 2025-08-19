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
import { useEffect, useMemo, useState } from "react";
import { useButtonsStyles } from "@/styles/button.styles";
import { ModalBase } from "@/components/ui/modal-base";
import { Pagination } from "@/components/ui/pagination-base";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import useSWR, { mutate } from "swr";
import { useAsyncAction } from "@/hooks/use-async-action";
import { BaseResponse } from "@/interface";
import { CalidadesService } from "@/services/calidades.service";
import { useAuth } from "@/hooks/use-auth";
import { CalidadPanel } from "./calidad-panel";
import { PagedCalidadResponse, ICalidadResponse, CalidadFiltersParams } from "@/interface/admin/calidad";
import { useCalidadContext } from "./calidad-context";
import { buildPaginatedSWRKey } from '@/utils/swr-keys';
import { PAGINATION_CONFIG } from '@/config/pagination.config';

const columns = [
  { uid: "codigo", name: "Codigo", width: 5 },
  { uid: "nombre", name: "Nombre", width: 5 },
  { uid: "descripcion", name: "Descripción", width: 10 },
  { uid: "codigoMaterial", name: "Código de Material", width: 5 },
  { uid: "activo", name: "Estado", width: 7 },
  { uid: "action", name: "Acciones", width: 5 },
];

const buildCalidadesKey = (page: number, size: number, filters?: CalidadFiltersParams) => buildPaginatedSWRKey('calidades', page, size, filters);

export function CalidadTable() {
  const style = useButtonsStyles();
  const deleteAction = useAsyncAction();
  const { user } = useAuth();
  const { filters } = useCalidadContext();

  const [page, setPage] = useState<number>(PAGINATION_CONFIG.DEFAULT_PAGE);
  const pageSize = PAGINATION_CONFIG.DEFAULT_SIZE;

  const serviceFilters: CalidadFiltersParams | undefined = useMemo(() => {
    if (!filters || Object.keys(filters).length === 0) return undefined;
    return {
      codigo: filters.codigo,
      estado: filters.estado,
      fechaDesde: filters.fechaDesde?.toISOString().split('T')[0],
    };
  }, [filters]);

  const swrKey = buildCalidadesKey(page, pageSize, serviceFilters);

  useEffect(() => { setPage(PAGINATION_CONFIG.DEFAULT_PAGE); }, [serviceFilters]);
  const {
    data: dataCalidades,
    isLoading: loadingCalidades,
    error: errorCalidades,
  } = useSWR<BaseResponse<PagedCalidadResponse>>(
    swrKey,
    () => CalidadesService.listar(page, pageSize, serviceFilters),
    { revalidateOnFocus: false, revalidateOnReconnect: false, dedupingInterval: 2000 }
  );
  const respData = dataCalidades?.data;
  const items: ICalidadResponse[] = respData?.data ?? [];
  const {
    currentPage: paginationCurrentPage = page,
    totalPages: paginationTotalPages = 1,
    totalCount: paginationTotalItems = 0,
    hasPrevious,
    hasNext,
    previousPage,
    nextPage,
  } = respData?.pagination ?? {};

  const [openPanel, setOpenPanel] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [idCalidad, setIdCalidad] = useState<string | undefined>(undefined);
  const [isClosingAfterSuccess, setIsClosingAfterSuccess] = useState(false);
  const [mode, setMode] = useState<"crear" | "editar" | "detalle">("crear");

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
  const handleCloseModal = () => {
    setOpenModal(false);
    setInfoCalidad(null);
    setIsClosingAfterSuccess(false);
    deleteAction.reset();
  };

  const [infoCalidad, setInfoCalidad] = useState<{ id: string; codigo: string; } | null>(null);

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
    mutate(buildCalidadesKey(paginationCurrentPage, pageSize, serviceFilters));
    if (paginationCurrentPage === paginationTotalPages && items.length >= pageSize) {
      const nextP = paginationCurrentPage + 1;
      setPage(nextP);
      mutate(buildCalidadesKey(nextP, pageSize, serviceFilters));
    } else if (paginationCurrentPage !== 1) {
      mutate(buildCalidadesKey(1, pageSize, serviceFilters));
    }
  };

  const acctionDeleteModal = async () => {
    if (!infoCalidad) return;
    const userId = user?.id;
    if (!userId)
      throw new Error("No se encontró el id del usuario autenticado");

    const willBeLastOnPage = items.length === 1 && page > 1;
    await deleteAction.execute(
      async () => {
        await CalidadesService.eliminar(infoCalidad.id.toString(), userId);
        return { success: true, message: "Calidad eliminada correctamente" };
      },
      buildCalidadesKey(page, pageSize, serviceFilters)
    );
    mutate(buildCalidadesKey(page, pageSize, serviceFilters));
    if (willBeLastOnPage) {
      const prevPage = page - 1;
      setPage(prevPage);
      mutate(buildCalidadesKey(prevPage, pageSize, serviceFilters));
    } else {
      mutate(buildCalidadesKey(paginationTotalPages, pageSize, serviceFilters));
    }
  };

  return (
    <>
      <Card style={{ width: "100%", height: "100%" }}>
        <div className="w-full h-full flex flex-col  ">
          <div className="w-full h-9/10 ">
            <div className="w-full h-2/25 flex justify-between items-start ">
              <Title title="Calidades" />
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
                isLoading={loadingCalidades}
                error={errorCalidades}
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
                onPageChange={(p) => {
                  if (p !== page && p >= 1 && p <= (paginationTotalPages || 1)) setPage(p);
                }}
                hasPrevious={hasPrevious}
                hasNext={hasNext}
                previousPage={previousPage}
                nextPage={nextPage}
              />
            )}
          </div>
        </div>
      </Card>

      <CalidadPanel
        mode={mode}
        open={openPanel}
        close={handleClosePanel}
        id={idCalidad}
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
        requiereAction={
          !deleteAction.isSuccess && !isClosingAfterSuccess
        }
      >
        <>
          {!deleteAction.isSuccess && (
            <>
              ¿Está seguro de eliminar la calidad con código{" "}
              <span className="font-bold">{infoCalidad?.codigo}</span>?
            </>
          )}
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
                setIsClosingAfterSuccess(true);
                setOpenModal(false);
                setInfoCalidad(null);
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
