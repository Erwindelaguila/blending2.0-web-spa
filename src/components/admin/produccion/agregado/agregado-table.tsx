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
import { AgregadoPanel } from "./agregado-panel";
import { AgregadoService } from "@/services/agregado.service";
import { AgregadoFiltersParams } from "@/interface/admin/agregado";
import { IAgregado } from "@/interface/admin/agregado";
import { useAuth } from "@/hooks/use-auth";
import { PagedAgregadoResponse } from "@/interface/admin/agregado";
import { useAgregadoContext } from './agregado-context';
import { buildPaginatedSWRKey } from '@/utils/swr-keys';
import { PAGINATION_CONFIG } from '@/config/pagination.config';

const columns = [
  { uid: "codigo", name: "Codigo", width: 5 },
  { uid: "nombre", name: "Nombre", width: 5 },
  { uid: "descripcion", name: "Descripción", width: 10 },
  { uid: "activo", name: "Estado", width: 7 },
  { uid: "action", name: "Acciones", width: 5 },
];

const buildAgregadosKey = (page: number, size: number, filters?: AgregadoFiltersParams) => {
  return buildPaginatedSWRKey('agregados', page, size, filters);
};

export function AgregadoTable() {
  const style = useButtonsStyles();
  const deleteAction = useAsyncAction();
  const { user } = useAuth();
  const { filters } = useAgregadoContext();

  const [page, setPage] = useState<number>(PAGINATION_CONFIG.DEFAULT_PAGE);
  const pageSize = PAGINATION_CONFIG.DEFAULT_SIZE;

  const serviceFilters: AgregadoFiltersParams | undefined = useMemo(() => {
    if (!filters || Object.keys(filters).length === 0) return undefined;
    
    return {
      codigo: filters.codigo,
      estado: filters.estado,
      fechaDesde: filters.fechaDesde?.toISOString().split('T')[0],
    };
  }, [filters]);

  const swrKey = buildAgregadosKey(page, pageSize, serviceFilters);
  
  useEffect(() => {
    setPage(PAGINATION_CONFIG.DEFAULT_PAGE);
  }, [serviceFilters]);

  const {
    data: dataAgregados,
    isLoading: loadingAgregados,
    error: errorAgregados,
  } = useSWR<BaseResponse<PagedAgregadoResponse>>(
    swrKey, 
    () => AgregadoService.listar(page, pageSize, serviceFilters),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 2000,
    }
  );

  const respData = dataAgregados?.data;
  const items: IAgregado[] = respData?.data ?? [];
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
  const [idAgregado, setIdAgregado] = useState<string | undefined>(undefined);
  const [isClosingAfterSuccess, setIsClosingAfterSuccess] = useState(false);

  const [mode, setMode] = useState<"crear" | "editar" | "detalle">("crear");

  const handleOpenCrear = () => {
    setMode("crear");
  setIdAgregado(undefined);
    setOpenPanel(true);
  };

  const handleOpenEditar = (registroId: string) => {
    setMode("editar");
  setIdAgregado(registroId);
    setOpenPanel(true);
  };

  const handleOpenDetalle = (registroId: string) => {
    setMode("detalle");
  setIdAgregado(registroId);
    setOpenPanel(true);
  };

  const handleClosePanel = () => {
    setOpenPanel(false);

    setTimeout(() => {
  setIdAgregado(undefined);
  setMode("crear");
    }, 30);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setInfoAgregado(null);
    setIsClosingAfterSuccess(false);
    deleteAction.reset();
  };

  const [infoAgregado, setInfoAgregado] = useState<{
    id: string;
    codigo: string;
  } | null>(null);

  const renderCell = (item: any, columnKey: string) => {
    const agregado = item as IAgregado;
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
                statusColorMap[agregado.activo ? "Activo" : "Inactivo"] || "#666",
              color: "#fff",
              width: "100%",
            }}
            size="large"
          >
            {agregado.activo ? "ACTIVO" : "INACTIVO"}
          </Badge>
        );
      case "action":
        return (
          <div className="flex gap-1 justify-center w-full py-0.5">
            <Tooltip content="Info Agregado" relationship="label">
              <Button
                size="large"
                appearance="subtle"
                onClick={() => handleOpenDetalle(agregado.id)}
                icon={<Info24Filled style={{ color: OrgColors.serotGris }} />}
              />
            </Tooltip>
            <Tooltip content="Editar Agregado" relationship="label">
              <Button
                size="large"
                appearance="subtle"
                onClick={() => handleOpenEditar(agregado.id)}
                icon={<Edit24Filled style={{ color: OrgColors.azulOscuro }} />}
              />
            </Tooltip>

            <Tooltip content="Eliminar Agregado" relationship="label">
              <Button
                size="large"
                appearance="subtle"
                onClick={() => {
                  setInfoAgregado({
                    id: agregado.id,
                    codigo: agregado.codigo,
                  });
                  setOpenModal(true);
                }}
                icon={<Delete24Filled style={{ color: OrgColors.rojo }} />}
              />
            </Tooltip>
          </div>
        );
      default:
        return (agregado as any)[columnKey] ?? "";
    }
  };

  const handlePanelSuccess = () => {
    for (let i = 1; i <= paginationTotalPages + 2; i++) {
      mutate(buildAgregadosKey(i, pageSize, serviceFilters), undefined, { revalidate: false });
    }
    
    if (mode === "crear") {
      const newTotal = paginationTotalItems + 1;
      const newLastPage = Math.ceil(newTotal / pageSize);
      setPage(newLastPage);
      mutate(buildAgregadosKey(newLastPage, pageSize, serviceFilters));
    } else {
      mutate(buildAgregadosKey(page, pageSize, serviceFilters));
    }
  };

  const actionDeleteModal = async () => {
    if (!infoAgregado) return;
    const userId = user?.id;
    if (!userId) throw new Error("No se encontró el id del usuario autenticado");
    
    await deleteAction.execute(
      async () => {
        await AgregadoService.eliminar(infoAgregado.id, userId);
        return { success: true, message: "Agregado eliminado correctamente" };
      },
      buildAgregadosKey(page, pageSize, serviceFilters)
    );

    for (let i = 1; i <= paginationTotalPages + 1; i++) {
      mutate(buildAgregadosKey(i, pageSize, serviceFilters), undefined, { revalidate: false });
    }
    
    mutate(buildAgregadosKey(page, pageSize, serviceFilters));
    
    if (items.length === 1 && page > 1) {
      const prevPage = page - 1;
      setPage(prevPage);
      mutate(buildAgregadosKey(prevPage, pageSize, serviceFilters));
    }
  };
  return (
    <>
      <Card style={{ width: "100%", height: "100%" }}>
        <div className="w-full h-full flex flex-col  ">
          <div className="w-full h-9/10 ">
            <div className="w-full h-2/25 flex justify-between items-start ">
              <Title title="Agregados" />
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
                isLoading={loadingAgregados}
                error={errorAgregados}
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

      <AgregadoPanel
        mode={mode}
        open={openPanel}
        close={handleClosePanel}
  id={idAgregado}
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
              ¿Está seguro de eliminar el agregado con código {" "}
              <span className="font-bold">{infoAgregado?.codigo}</span>?
            </>
          )}

          {deleteAction.isLoading && (
            <AsyncActionDisplay
              state={deleteAction.state}
              loadingMessage="Eliminando agregado..."
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
              successMessage="Agregado eliminado correctamente"
              onSuccess={() => {
                setIsClosingAfterSuccess(true);
                setOpenModal(false);
                setInfoAgregado(null);
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
