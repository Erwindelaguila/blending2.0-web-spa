"use client";
import { TableBase } from "@/components/ui/table-base";
import { Title } from "@/components/ui/title";
import { OrgColors } from "@/config/app.config.server";
import { Badge, Button, Card, Tooltip } from "@fluentui/react-components";
import { Add24Regular, Delete24Filled, Edit24Filled, Info24Filled } from "@fluentui/react-icons";
import { useState } from "react";
import { useButtonsStyles } from "@/styles/button.styles";
import { ModalBase } from "@/components/ui/modal-base";
import { Pagination } from "@/components/ui/pagination-base";
import { PanelCrearPlanta } from "./panel-crear-planta";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import useSWR, { mutate } from "swr";
import { useAsyncAction } from "@/hooks/use-async-action";
import { BaseResponse } from "@/interface";
import { IPlantaResponse, PagedPlantaResponse } from "@/interface/admin/planta";
import { PlantasService } from "@/services/plantas.service";
import { useAuth } from "@/hooks/use-auth";
import { usePlantaContext } from "@/components/admin/plantas-homogenizacion/planta-context";

const columns = [
  { uid: "codigo", name: "Codigo", width: 5 },
  { uid: "nombre", name: "Nombre", width: 5 },
  { uid: "descripcion", name: "Descripción", width: 15 },
  { uid: "numeroRuma", name: "N° Ruma", width: 5 },
  { uid: "activo", name: "Estado", width: 7 },
  { uid: "action", name: "Acciones", width: 5 },
];

const buildPlantasKey = (page: number, size: number, filters?: any) => {
  const params = new URLSearchParams();
  params.set('page', page.toString());
  params.set('size', size.toString());
  
  if (filters?.codigo) params.set('codigo', filters.codigo);
  if (filters?.estado !== undefined) params.set('estado', filters.estado.toString());
  if (filters?.fechaInicio) params.set('fechaInicio', filters.fechaInicio);
  if (filters?.fechaFin) params.set('fechaFin', filters.fechaFin);
  if (filters?.tipoFecha) params.set('tipoFecha', filters.tipoFecha);
  
  return `plantas-${params.toString()}`;
};

export function TablePlanta() {
  const style = useButtonsStyles();
  const deleteAction = useAsyncAction();
  const { user } = useAuth();
  const { filters } = usePlantaContext();

  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Mapear los filtros a los parámetros del servicio
  const serviceFilters = {
    codigo: filters.codigo || '',
    estado: filters.estado,
    fechaInicio: filters.fechaInicio ? filters.fechaInicio.toISOString().split('T')[0] : undefined,
    fechaFin: filters.fechaFin ? filters.fechaFin.toISOString().split('T')[0] : undefined,
    tipoFecha: filters.tipoFecha
  };

  const swrKey = buildPlantasKey(page, pageSize, serviceFilters);
  const { data: dataPlantas, isLoading: loadingPlantas, error: errorPlantas } = useSWR<BaseResponse<PagedPlantaResponse>>(
    swrKey, 
    () => PlantasService.listar(page, pageSize, serviceFilters), 
    { revalidateOnFocus: false, revalidateIfStale: true }
  );

  const items: IPlantaResponse[] = dataPlantas?.data?.items || [];
  const paginationCurrentPage = dataPlantas?.data?.page || page;
  const paginationTotalPages = dataPlantas?.data?.totalPages || 1;
  const paginationTotalItems = dataPlantas?.data?.total || (paginationTotalPages - 1) * pageSize + items.length;

  const [openPanel, setOpenPanel] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [idPlanta, setIdPlanta] = useState<string | undefined>(undefined);
  const [mode, setMode] = useState<"crear" | "editar" | "detalle">("crear");
  const [isClosingAfterSuccess, setIsClosingAfterSuccess] = useState(false);

  const handleOpenCrear = () => { setMode("crear"); setIdPlanta(undefined); setOpenPanel(true); };
  const handleOpenEditar = (registroId: string) => { setMode("editar"); setIdPlanta(registroId); setOpenPanel(true); };
  const handleOpenDetalle = (registroId: string) => { setMode("detalle"); setIdPlanta(registroId); setOpenPanel(true); };
  const handleClosePanel = () => { setOpenPanel(false); setTimeout(() => { setIdPlanta(undefined); setMode("crear"); }, 30); };
  const handleCloseModal = () => { setOpenModal(false); setInfoPlanta(null); setIsClosingAfterSuccess(false); deleteAction.reset(); };

  const [infoPlanta, setInfoPlanta] = useState<{ id: string; codigo: string } | null>(null);

  const renderCell = (item: any, columnKey: string) => {
    const planta = item as IPlantaResponse;
    switch (columnKey) {
      case "activo":
        const statusColorMap: Record<string, string> = { Activo: OrgColors.serotAzul, Inactivo: OrgColors.rojo };
        return (
          <Badge appearance="filled" style={{ backgroundColor: statusColorMap[planta.activo ? "Activo" : "Inactivo"] || "#666", color: "#fff", width: "100%" }} size="large">{planta.activo ? "ACTIVO" : "INACTIVO"}</Badge>
        );
      case "action":
        return (
          <div className="flex gap-1 justify-center w-full py-0.5">
            <Tooltip content="Info Planta" relationship="label"><Button size="large" appearance="subtle" onClick={() => handleOpenDetalle(planta.id.toString())} icon={<Info24Filled style={{ color: OrgColors.serotGris }} />} /></Tooltip>
            <Tooltip content="Editar Planta" relationship="label"><Button size="large" appearance="subtle" onClick={() => handleOpenEditar(planta.id.toString())} icon={<Edit24Filled style={{ color: OrgColors.azulOscuro }} />} /></Tooltip>
            <Tooltip content="Eliminar Planta" relationship="label"><Button size="large" appearance="subtle" onClick={() => { deleteAction.reset(); setIsClosingAfterSuccess(false); setInfoPlanta({ id: planta.id, codigo: planta.codigo }); setOpenModal(true); }} icon={<Delete24Filled style={{ color: OrgColors.rojo }} />} /></Tooltip>
          </div>
        );
      default:
        return planta[columnKey as keyof IPlantaResponse];
    }
  };

  const handlePanelSuccess = () => {
    const isLastPage = paginationCurrentPage === paginationTotalPages;
    const isFullLastPage = items.length >= pageSize;
    mutate(buildPlantasKey(paginationCurrentPage, pageSize, serviceFilters));
    if (isLastPage && isFullLastPage) { 
      const nextPage = paginationCurrentPage + 1; 
      setPage(nextPage); 
      mutate(buildPlantasKey(nextPage, pageSize, serviceFilters)); 
    } else { 
      if (paginationCurrentPage !== 1) mutate(buildPlantasKey(1, pageSize, serviceFilters)); 
    }
  };

  const { user: userAuth } = useAuth();
  const acctionDeleteModal = async () => {
    if (!infoPlanta) return; 
    const userId = userAuth?.id; 
    if (!userId) throw new Error("No se encontró el id del usuario autenticado");
    const willBeLastOnPage = items.length === 1 && page > 1;
    await deleteAction.execute(async () => { 
      await PlantasService.eliminar(infoPlanta.id, userId); 
      return { success: true, message: "Planta eliminada correctamente" }; 
    });
    mutate(buildPlantasKey(page, pageSize, serviceFilters));
    if (willBeLastOnPage) { 
      const prevPage = page - 1; 
      setPage(prevPage); 
      mutate(buildPlantasKey(prevPage, pageSize, serviceFilters)); 
    } else { 
      mutate(buildPlantasKey(paginationTotalPages, pageSize, serviceFilters)); 
    }
  };

  return (
    <>
      <Card style={{ width: "100%", height: "100%" }}>
        <div className="w-full h-full flex flex-col  ">
          <div className="w-full h-9/10 ">
            <div className="w-full h-2/25 flex justify-between items-start ">
              <Title title="Plantas de Homogenización" />
              <Button size="large" icon={<Add24Regular></Add24Regular>} className={`w-[13rem] ${style.buttonVerdeBase}`} onClick={handleOpenCrear}>Nuevo</Button>
            </div>
            <div className="w-full h-23/25">
              <TableBase columns={columns} data={items} renderCell={renderCell} isLoading={loadingPlantas} error={errorPlantas} height="100%" />
            </div>
          </div>
          <div className="w-full h-1/10">{items.length > 0 && (<Pagination currentPage={paginationCurrentPage} totalPages={paginationTotalPages} totalItems={paginationTotalItems} onPageChange={setPage} />)}</div>
        </div>
      </Card>

      <PanelCrearPlanta open={openPanel} mode={mode} id={idPlanta} close={handleClosePanel} onSuccess={handlePanelSuccess} />

      <ModalBase open={openModal} setOpen={(isOpen) => { if (!isOpen) { handleCloseModal(); } else { setOpenModal(isOpen); } }} type="alert" buttonText="Eliminar" buttonAction={acctionDeleteModal} closeOnOutsideClick={false} requiereAction={!deleteAction.isSuccess && !isClosingAfterSuccess} >
        <>
          {!deleteAction.isSuccess && (<>¿Está seguro de eliminar la planta con código <span className="font-bold">{infoPlanta?.codigo}</span>?</>)}
          {deleteAction.isLoading && (<AsyncActionDisplay state={deleteAction.state} loadingMessage="Eliminando planta..." successMessage="" />)}
          {deleteAction.error && (<AsyncActionDisplay state={deleteAction.state} loadingMessage="" successMessage="" error={deleteAction.error} onErrorDismiss={deleteAction.reset} />)}
          {deleteAction.isSuccess && (<AsyncActionDisplay state={deleteAction.state} loadingMessage="" successMessage="Planta eliminada correctamente" onSuccess={() => { setIsClosingAfterSuccess(true); setOpenModal(false); setInfoPlanta(null); setTimeout(() => { deleteAction.reset(); setIsClosingAfterSuccess(false); }, 300); }} />)}
        </>
      </ModalBase>
    </>
  );
}
