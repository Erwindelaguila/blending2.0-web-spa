"use client";
import { TableBase } from "@/components/ui/table-base";
import { Title } from "@/components/ui/title";
import { OrgColors } from "@/config/app.config.server";
import { Badge, Button, Card, Tooltip } from "@fluentui/react-components";
import { Add24Regular, Delete24Filled, Edit24Filled, Info24Filled } from "@fluentui/react-icons";
import { useState, useEffect, useMemo } from "react";
import { useButtonsStyles } from "@/styles/button.styles";
import { ModalBase } from "@/components/ui/modal-base";
import { Pagination } from "@/components/ui/pagination-base";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import useSWR, { mutate } from "swr";
import { useAsyncAction } from "@/hooks/use-async-action";
import { BaseResponse } from "@/interface";
import { LineaProduccionPanel } from "./linea-produccion-panel";
import { LineaProduccionService } from "@/services/linea-produccion.service";
import { LineaProduccionFiltersParams } from "@/interface/admin/linea-produccion";
import { ILineaProduccionResponse, PagedLineaProduccionResponse } from "@/interface/admin/linea-produccion";
import { useLineaProduccionContext } from './linea-produccion-context';
import { buildPaginatedSWRKey } from '@/utils/swr-keys';
import { PAGINATION_CONFIG } from '@/config/pagination.config';

const columns = [
  { uid: "codigo", name: "Codigo", width: 5 },
  { uid: "nombre", name: "Nombre", width: 5 },
  { uid: "descripcion", name: "Descripción", width: 10 },
  { uid: "activo", name: "Estado", width: 7 },
  { uid: "action", name: "Acciones", width: 5 },
];

const buildLineasKey = (page: number, size: number, filters?: LineaProduccionFiltersParams) => buildPaginatedSWRKey('linea-produccion', page, size, filters);

export function LineaProduccionTable() {
  const style = useButtonsStyles();
  const deleteAction = useAsyncAction();
  const { filters } = useLineaProduccionContext();

  const [page, setPage] = useState<number>(PAGINATION_CONFIG.DEFAULT_PAGE);
  const pageSize = PAGINATION_CONFIG.DEFAULT_SIZE;

  const serviceFilters: LineaProduccionFiltersParams | undefined = useMemo(() => {
    if (!filters || Object.keys(filters).length === 0) return undefined;
    
    return {
      codigo: filters.codigo,
      estado: filters.estado,
      fechaDesde: filters.fechaDesde?.toISOString().split('T')[0],
    };
  }, [filters]);  const swrKey = buildLineasKey(page, pageSize, serviceFilters);

  
  useEffect(() => {
    setPage(PAGINATION_CONFIG.DEFAULT_PAGE);
  }, [serviceFilters]);  const {
    data: dataLineas,
    isLoading: loadingLineas,
    error: errorLineas,
  } = useSWR<BaseResponse<PagedLineaProduccionResponse>>(
    swrKey,
    () => LineaProduccionService.listar(page, pageSize, serviceFilters),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 2000,
    }
  );

  const payload = dataLineas?.data; 
  const items: ILineaProduccionResponse[] = payload?.items ?? [];
  const {
    currentPage: paginationCurrentPage = page,
    totalPages: paginationTotalPages = 1,
    totalCount: paginationTotalItems = 0,
    hasPrevious,
    hasNext,
    previousPage,
    nextPage,
  } = payload?.pagination ?? {};

  const handlePageChange = (newPage: number) => {
    if (newPage !== page && newPage >= 1 && newPage <= paginationTotalPages) {
      setPage(newPage);
    }
  };

  const [openPanel, setOpenPanel] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [idLinea, setIdLinea] = useState<string | undefined>(undefined);
  const [isClosingAfterSuccess, setIsClosingAfterSuccess] = useState(false);
  const [mode, setMode] = useState<"crear" | "editar" | "detalle">("crear");

  const handleOpenCrear = () => { setMode("crear"); setIdLinea(undefined); setOpenPanel(true); };
  const handleOpenEditar = (registroId: string) => { setMode("editar"); setIdLinea(registroId); setOpenPanel(true); };
  const handleOpenDetalle = (registroId: string) => { setMode("detalle"); setIdLinea(registroId); setOpenPanel(true); };
  const handleClosePanel = () => { setOpenPanel(false); setTimeout(() => { setIdLinea(undefined); setMode("crear"); }, 30); };
  const handleCloseModal = () => { setOpenModal(false); setInfoLinea(null); setIsClosingAfterSuccess(false); deleteAction.reset(); };

  const [infoLinea, setInfoLinea] = useState<{ id: string; codigo: string; } | null>(null);

  const renderCell = (item: any, columnKey: string) => {
    const linea = item as ILineaProduccionResponse;
    switch (columnKey) {
      case "activo":
        const statusColorMap: Record<string, string> = { Activo: OrgColors.serotAzul, Inactivo: OrgColors.rojo };
        return (
          <Badge appearance="filled" style={{ backgroundColor: statusColorMap[linea.activo ? "Activo" : "Inactivo"] || "#666", color: "#fff", width: "100%" }} size="large">{linea.activo ? "ACTIVO" : "INACTIVO"}</Badge>
        );
      case "action":
        return (
          <div className="flex gap-1 justify-center w-full py-0.5">
            <Tooltip content="Info Línea" relationship="label"><Button size="large" appearance="subtle" onClick={() => handleOpenDetalle(linea.id.toString())} icon={<Info24Filled style={{ color: OrgColors.serotGris }} />} /></Tooltip>
            <Tooltip content="Editar Línea" relationship="label"><Button size="large" appearance="subtle" onClick={() => handleOpenEditar(linea.id.toString())} icon={<Edit24Filled style={{ color: OrgColors.azulOscuro }} />} /></Tooltip>
            <Tooltip content="Eliminar Línea" relationship="label"><Button size="large" appearance="subtle" onClick={() => { deleteAction.reset(); setIsClosingAfterSuccess(false); setInfoLinea({ id: linea.id, codigo: linea.codigo }); setOpenModal(true); }} icon={<Delete24Filled style={{ color: OrgColors.rojo }} />} /></Tooltip>
          </div>
        );
      default:
        return linea[columnKey as keyof ILineaProduccionResponse];
    }
  };

  const handlePanelSuccess = () => {
    for (let i = 1; i <= paginationTotalPages + 2; i++) {
      mutate(buildLineasKey(i, pageSize, serviceFilters), undefined, { revalidate: false });
    }

    if (mode === "crear") {
      const newTotal = paginationTotalItems + 1;
      const newLastPage = Math.ceil(newTotal / pageSize);
      setPage(newLastPage);
      setTimeout(() => {
        mutate(buildLineasKey(newLastPage, pageSize, serviceFilters));
      }, 100);
    } else {
      mutate(buildLineasKey(page, pageSize, serviceFilters));
    }
  };

  const acctionDeleteModal = async () => {
    if (!infoLinea) return;
    const isLastItemOnPage = items.length === 1;
    const shouldGoToPreviousPage = isLastItemOnPage && page > 1;

    await deleteAction.execute(async () => {
      await LineaProduccionService.eliminar(infoLinea.id);
      return { success: true, message: "Línea de producción eliminada correctamente" };
    });

    for (let i = Math.max(1, page - 1); i <= Math.min(paginationTotalPages, page + 1); i++) {
      mutate(buildLineasKey(i, pageSize, serviceFilters), undefined, { revalidate: false });
    }

    if (shouldGoToPreviousPage) {
      const prevPage = page - 1;
      setPage(prevPage);
      setTimeout(() => {
        mutate(buildLineasKey(prevPage, pageSize, serviceFilters));
      }, 100);
    } else {
      mutate(buildLineasKey(page, pageSize, serviceFilters));
    }
  };

  return (
    <>
      <Card style={{ width: "100%", height: "100%" }}>
        <div className="w-full h-full flex flex-col  ">
          <div className="w-full h-9/10 ">
            <div className="w-full h-2/25 flex justify-between items-start ">
              <Title title="Líneas de Producción" />
              <Button size="large" icon={<Add24Regular></Add24Regular>} className={`w-[13rem] ${style.buttonVerdeBase}`} onClick={() => handleOpenCrear()}>Nuevo</Button>
            </div>
            <div className="w-full h-23/25 pt-1">
              <TableBase columns={columns} data={items} renderCell={renderCell} isLoading={loadingLineas} error={errorLineas} height="100%" />
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

      <LineaProduccionPanel mode={mode} open={openPanel} close={handleClosePanel} id={idLinea} onSuccess={handlePanelSuccess} />

      <ModalBase open={openModal} setOpen={(isOpen) => { if (!isOpen) { handleCloseModal(); } else { setOpenModal(isOpen); } }} type="alert" buttonText="Eliminar" buttonAction={acctionDeleteModal} closeOnOutsideClick={false} requiereAction={!deleteAction.isSuccess && !isClosingAfterSuccess} >
        <>
          {!deleteAction.isSuccess && (<>¿Está seguro de eliminar la línea con código <span className="font-bold">{infoLinea?.codigo}</span>?</>)}
          {deleteAction.isLoading && (<AsyncActionDisplay state={deleteAction.state} loadingMessage="Eliminando línea..." successMessage="" />)}
          {deleteAction.error && (<AsyncActionDisplay state={deleteAction.state} loadingMessage="" successMessage="" error={deleteAction.error} onErrorDismiss={deleteAction.reset} />)}
          {deleteAction.isSuccess && (<AsyncActionDisplay state={deleteAction.state} loadingMessage="" successMessage="Línea eliminada correctamente" onSuccess={() => { setIsClosingAfterSuccess(true); setOpenModal(false); setInfoLinea(null); setTimeout(() => { deleteAction.reset(); setIsClosingAfterSuccess(false); }, 300); }} />)}
        </>
      </ModalBase>
    </>
  );
}
