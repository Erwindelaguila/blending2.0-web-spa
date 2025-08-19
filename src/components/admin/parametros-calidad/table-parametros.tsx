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
import { PanelCrearParametros } from "./panel-crear-parametros";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import useSWR from "swr";
import { mutate } from "swr";
import { useAsyncAction } from "@/hooks/use-async-action";
import { BaseResponse } from "@/interface";
import { IParametroResponse, PagedParametroResponse } from "@/interface/admin/parametro";
import { ParametrosService } from "@/services";
import { useAuth } from "@/hooks/use-auth";
import { useParametroContext } from './parametro-context';

const columns = [
  { uid: "codigo", name: "Codigo", width: 5 },
  { uid: "nombre", name: "Nombre", width: 5 },
  { uid: "descripcion", name: "Descripción", width: 15 },
  { uid: "activo", name: "Estado", width: 7 },
  { uid: "action", name: "Acciones", width: 5 },
];

export function TableParametros() {
  const style = useButtonsStyles();
  const deleteAction = useAsyncAction();
  const { user } = useAuth();
  const { filters } = useParametroContext();

  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Mapear los filtros a los parámetros del servicio
  const serviceFilters = useMemo(() => {
    if (!filters || Object.keys(filters).length === 0) return undefined as any;
    return {
      codigo: filters.codigo || '',
      estado: filters.estado,
      fechaInicio: filters.fechaInicio ? filters.fechaInicio.toISOString().split('T')[0] : undefined,
      fechaFin: filters.fechaFin ? filters.fechaFin.toISOString().split('T')[0] : undefined,
      tipoFecha: filters.tipoFecha
    };
  }, [filters]);

  // Llave SWR local (igual patrón que agregados y el contexto)
  const buildParametrosKey = (pageNum: number, sizeNum: number, f?: typeof serviceFilters) => {
    const params = new URLSearchParams();
    params.set('page', pageNum.toString());
    params.set('size', sizeNum.toString());
    if (f?.codigo) params.set('codigo', f.codigo);
    if (f?.estado !== undefined) params.set('estado', f.estado.toString());
    if (f?.fechaInicio) params.set('fechaInicio', f.fechaInicio);
    if (f?.fechaFin) params.set('fechaFin', f.fechaFin);
    if (f?.tipoFecha) params.set('tipoFecha', f.tipoFecha);
    return `parametros-${params.toString()}`;
  };

  const swrKey = buildParametrosKey(page, pageSize, serviceFilters);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [serviceFilters]);
  const {
    data: dataParametros,
    isLoading: loadingParametros,
    error: errorParametros,
  } = useSWR<BaseResponse<any>>(
    swrKey,
    () => ParametrosService.listar(page, pageSize, serviceFilters),
    {
  revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 2000,
    }
  );

  // Support both new (data/pagination) and legacy (items/page/total) shapes
  const items: IParametroResponse[] = (dataParametros as any)?.data?.data || (dataParametros as any)?.data?.items || [];
  const pagination = (dataParametros as any)?.data?.pagination;
  const paginationCurrentPage = pagination?.currentPage ?? (dataParametros as any)?.data?.page ?? page;
  const paginationTotalPages = pagination?.totalPages ?? (dataParametros as any)?.data?.totalPages ?? 1;
  const paginationTotalItems = pagination?.totalCount ?? (dataParametros as any)?.data?.total ?? 0;
  const hasPrevious = pagination?.hasPrevious;
  const hasNext = pagination?.hasNext;
  const previousPage = pagination?.previousPage;
  const nextPage = pagination?.nextPage;

  const [openPanel, setOpenPanel] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [idParametro, setIdParametro] = useState<string | undefined>(undefined);
  const [mode, setMode] = useState<"crear" | "editar" | "detalle">("crear");
  const [isClosingAfterSuccess, setIsClosingAfterSuccess] = useState(false);

  const handleOpenCrear = () => {
    setMode("crear");
    setIdParametro(undefined);
    setOpenPanel(true);
  };

  const handleOpenEditar = (registroId: string) => {
    setMode("editar");
    setIdParametro(registroId);
    setOpenPanel(true);
  };

  const handleOpenDetalle = (registroId: string) => {
    setMode("detalle");
    setIdParametro(registroId);
    setOpenPanel(true);
  };

  const handleClosePanel = () => {
    setOpenPanel(false);

    setTimeout(() => {
      setIdParametro(undefined);
      setMode("crear");
    }, 30);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setInfoParametro(null);
    setIsClosingAfterSuccess(false);
    deleteAction.reset();
  };

  const [infoParametro, setInfoParametro] = useState<{
    id: string;
    codigo: string;
  } | null>(null);

  const handlePageChange = (newPage: number) => {
    if (newPage !== page && newPage >= 1 && newPage <= paginationTotalPages) {
      setPage(newPage);
    }
  };

  const handlePanelSuccess = () => {
    // Clear caches for multiple pages
    for (let i = 1; i <= paginationTotalPages + 2; i++) {
      mutate(buildParametrosKey(i, pageSize, serviceFilters), undefined, { revalidate: false });
    }

    if (mode === "crear") {
      const newTotal = (paginationTotalItems || 0) + 1;
      const newLastPage = Math.ceil(newTotal / pageSize) || 1;
      setPage(newLastPage);
      mutate(buildParametrosKey(newLastPage, pageSize, serviceFilters));
    } else {
      mutate(buildParametrosKey(page, pageSize, serviceFilters));
    }
  };

  const renderCell = (item: any, columnKey: string) => {
    const parametro = item as IParametroResponse;
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
              backgroundColor: statusColorMap[parametro.activo ? "Activo" : "Inactivo"] || "#666",
              color: "#fff",
              width: "100%",
            }}
            size="large"
          >
            {parametro.activo ? "ACTIVO" : "INACTIVO"}
          </Badge>
        );

      case "action":
        return (
          <div className="flex gap-1 justify-center w-full py-0.5">
            <Tooltip content="Info Parámetro" relationship="label">
              <Button
                size="large"
                appearance="subtle"
                onClick={() => handleOpenDetalle(parametro.id.toString())}
                icon={<Info24Filled style={{ color: OrgColors.serotGris }} />}
              />
            </Tooltip>
            <Tooltip content="Editar Parámetro" relationship="label">
              <Button
                size="large"
                appearance="subtle"
                onClick={() => handleOpenEditar(parametro.id.toString())}
                icon={<Edit24Filled style={{ color: OrgColors.azulOscuro }} />}
              />
            </Tooltip>

            <Tooltip content="Eliminar Parámetro" relationship="label">
              <Button
                size="large"
                appearance="subtle"
                onClick={() => {
                  deleteAction.reset();
                  setIsClosingAfterSuccess(false);
                  setInfoParametro({
                    id: parametro.id,
                    codigo: parametro.codigo,
                  });
                  setOpenModal(true);
                }}
                icon={<Delete24Filled style={{ color: OrgColors.rojo }} />}
              />
            </Tooltip>
          </div>
        );

      default:
        return parametro[columnKey as keyof IParametroResponse];
    }
  };

  const acctionDeleteModal = async () => {
    if (!infoParametro) return;
    const userId = user?.id;
    if (!userId) throw new Error("No se encontró el id del usuario autenticado");
    const willBeLastOnPage = items.length === 1 && page > 1;
    await deleteAction.execute(async () => {
      await ParametrosService.eliminar(infoParametro.id, userId);
      return { success: true, message: "Parámetro eliminado correctamente" };
    });
    // Revalidar página actual
  mutate(buildParametrosKey(page, pageSize, serviceFilters));
    if (willBeLastOnPage) {
      const prevPage = page - 1;
      setPage(prevPage);
  mutate(buildParametrosKey(prevPage, pageSize, serviceFilters));
    } else {
  mutate(buildParametrosKey(paginationTotalPages, pageSize, serviceFilters));
    }
  };
  return (
    <>
      <Card style={{ width: "100%", height: "100%" }}>
        <div className="w-full h-full flex flex-col  ">
          <div className="w-full h-9/10 ">
            <div className="w-full h-2/25 flex justify-between items-start ">
              <Title title="Parámetros de Calidad" />
              <Button
                size="large"
                icon={<Add24Regular></Add24Regular>}
                className={`w-[13rem] ${style.buttonVerdeBase}`}
                onClick={handleOpenCrear}
              >
                Nuevo
              </Button>
            </div>

            <div className="w-full h-23/25">
              <TableBase
                columns={columns}
                data={items}
                renderCell={renderCell}
                isLoading={loadingParametros}
                error={errorParametros}
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

      <PanelCrearParametros
        open={openPanel}
        mode={mode}
        id={idParametro}
        close={handleClosePanel}
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
        buttonAction={acctionDeleteModal}
        closeOnOutsideClick={false} // No permitir cerrar haciendo clic fuera
        requiereAction={!deleteAction.isSuccess && !isClosingAfterSuccess} // Ocultar botones cuando hay éxito O cuando está cerrando
      >
        <>
          {!deleteAction.isSuccess && (
            <>
              ¿Está seguro de eliminar el parámetro con código{" "}
              <span className="font-bold">{infoParametro?.codigo}</span>?
            </>
          )}
          {deleteAction.isLoading && (
            <AsyncActionDisplay
              state={deleteAction.state}
              loadingMessage="Eliminando parámetro..."
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
              successMessage="Parámetro eliminado correctamente"
              onSuccess={() => {
                // Marcar que está cerrando después del éxito
                setIsClosingAfterSuccess(true);
                // Cerrar el modal inmediatamente
                setOpenModal(false);
                setInfoParametro(null);
                // Resetear después de que el modal se haya cerrado
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
