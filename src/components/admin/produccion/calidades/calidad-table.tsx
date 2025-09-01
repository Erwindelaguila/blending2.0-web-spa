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
import { useState, useEffect, useMemo } from "react";
import { useButtonsStyles } from "@/styles/button.styles";
import { ModalBase } from "@/components/ui/modal-base";
import { Pagination } from "@/components/ui/pagination-base";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import useSWR from "swr";
import { mutate } from "swr";
import { useAsyncAction } from "@/hooks/use-async-action";
import { BaseResponse } from "@/interface";
import { CalidadPanel } from "./calidad-panel";
import { CalidadesService } from "@/services/calidades.service";
import { CalidadFiltersParams, CalidadPagedResponse } from "@/interface/admin/calidad";
import { ICalidadResponse } from "@/interface/admin/calidad";
import { PagedCalidadResponse } from "@/interface/admin/calidad";
import { useCalidadContext } from './calidad-context';
import { buildPaginatedSWRKey } from '@/utils/swr-keys';
import { PAGINATION_CONFIG } from '@/config/pagination.config';

const columns = [
  { uid: "codigo", name: "Codigo", width: 5 },
  { uid: "nombre", name: "Nombre", width: 5 },
  { uid: "codigoMaterial", name: "Código de Material", width: 5 },
  { uid: "descripcion", name: "Descripción", width: 10 },
  { uid: "activo", name: "Estado", width: 7 },
  { uid: "action", name: "Acciones", width: 5 },
];

const buildCalidadesKey = (page: number, size: number, filters?: CalidadFiltersParams) => {
  return buildPaginatedSWRKey('calidades', page, size, filters);
};

export function CalidadTable() {
  const style = useButtonsStyles();
  const deleteAction = useAsyncAction();
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
  
  useEffect(() => {
    setPage(PAGINATION_CONFIG.DEFAULT_PAGE);
  }, [serviceFilters]);

  const {
    data: dataCalidades,
    isLoading: loadingCalidades,
    error: errorCalidades,
  } = useSWR<BaseResponse<PagedCalidadResponse>>(
    swrKey, 
    () => CalidadesService.listar(page, pageSize, serviceFilters),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 2000,
    }
  );

  const respData = dataCalidades?.data;
  const items: ICalidadResponse[] = respData?.items ?? [];
  const {
    currentPage: paginationCurrentPage = page,
    totalPages: paginationTotalPages = 1,
    totalCount: paginationTotalItems = 0,
    hasPrevious,
    hasNext,
    previousPage,
    nextPage,
  } = respData?.pagination ?? {};
  
  const handlePageChange = (newPage: number) => {
    if (newPage !== page && newPage >= 1 && newPage <= paginationTotalPages) {
      setPage(newPage);
    }
  };

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
      setIdCalidad(undefined);
      setMode("crear");
    }, 30);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setInfoCalidad(null);
    setIsClosingAfterSuccess(false);
    deleteAction.reset();
  };

  const [infoCalidad, setInfoCalidad] = useState<{
    id: string;
    codigo: string;
  } | null>(null);

  const renderCell = (item: any, columnKey: string) => {
    const calidad = item as ICalidadResponse;
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
                statusColorMap[calidad.activo ? "Activo" : "Inactivo"] || "#666",
              color: "#fff",
              width: "100%",
            }}
            size="large"
          >
            {calidad.activo ? "ACTIVO" : "INACTIVO"}
          </Badge>
        );
      case "action":
        return (
          <div className="flex gap-1 justify-center w-full py-0.5">
            <Tooltip content="Info Calidad" relationship="label">
              <Button
                size="large"
                appearance="subtle"
                onClick={() => handleOpenDetalle(calidad.id)}
                icon={<Info24Filled style={{ color: OrgColors.serotGris }} />}
              />
            </Tooltip>
            <Tooltip content="Editar Calidad" relationship="label">
              <Button
                size="large"
                appearance="subtle"
                onClick={() => handleOpenEditar(calidad.id)}
                icon={<Edit24Filled style={{ color: OrgColors.azulOscuro }} />}
              />
            </Tooltip>

            <Tooltip content="Eliminar Calidad" relationship="label">
              <Button
                size="large"
                appearance="subtle"
                onClick={() => {
                  setInfoCalidad({
                    id: calidad.id,
                    codigo: calidad.codigo,
                  });
                  setOpenModal(true);
                }}
                icon={<Delete24Filled style={{ color: OrgColors.rojo }} />}
              />
            </Tooltip>
          </div>
        );
      default:
        return (calidad as any)[columnKey] ?? "";
    }
  };

  const handlePanelSuccess = () => {
    for (let i = 1; i <= paginationTotalPages + 2; i++) {
      mutate(buildCalidadesKey(i, pageSize, serviceFilters), undefined, { revalidate: false });
    }
    
    if (mode === "crear") {
      const newTotal = paginationTotalItems + 1;
      const newLastPage = Math.ceil(newTotal / pageSize);
      setPage(newLastPage);
      mutate(buildCalidadesKey(newLastPage, pageSize, serviceFilters));
    } else {
      mutate(buildCalidadesKey(page, pageSize, serviceFilters));
    }
  };

  const actionDeleteModal = async () => {
    if (!infoCalidad) return;
    const deletingLastOnPage = items.length === 1 && page > 1;

    await deleteAction.execute(async () => {
      await CalidadesService.eliminar(infoCalidad.id);
      return { success: true, message: "Calidad eliminada correctamente" };
    });

    mutate(buildCalidadesKey(page, pageSize, serviceFilters), undefined, { revalidate: false });

    if (!deletingLastOnPage) {
      mutate(buildCalidadesKey(page, pageSize, serviceFilters));
      return;
    }

    const prevPage = page - 1;
    setPage(prevPage);
    mutate(buildCalidadesKey(prevPage, pageSize, serviceFilters));
  };

  return (
    <>
      <Card style={{ width: "100%", height: "100%" }}>
        <div className="w-full h-full flex flex-col">
          <div className="w-full h-9/10">
            <div className="w-full h-2/25 flex justify-between items-start">
              <Title title="Calidades" />
              <Button
                size="large"
                icon={<Add24Regular />}
                className={`w-[13rem] ${style.buttonVerdeBase}`}
                onClick={() => handleOpenCrear()}
              >
                Nuevo
              </Button>
            </div>
            <div className="w-full h-23/25 pt-1">
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
                onPageChange={handlePageChange}
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
        buttonAction={actionDeleteModal}
        requiereAction={!deleteAction.isSuccess && !isClosingAfterSuccess}
      >
        <>
          {!deleteAction.isSuccess && (
            <>
              ¿Está seguro de eliminar la calidad con código {" "}
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
