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
import { PlantaPanel } from "./planta-panel";
import { PlantasService } from "@/services/plantas.service";
import { PlantaFiltersParams } from "@/interface/admin/planta";
import { IPlantaResponse } from "@/interface/admin/planta";
import { PlantaPagedItemsResponse } from "@/interface/admin/planta";
import { usePlantaContext } from './planta-context';
import { buildPaginatedSWRKey } from '@/utils/swr-keys';
import { PAGINATION_CONFIG } from '@/config/pagination.config';

const columns = [
  { uid: "codigo", name: "Codigo", width: 5 },
  { uid: "nombre", name: "Nombre", width: 5 },
  { uid: "descripcion", name: "Descripción", width: 10 },
  { uid: "numeroRuma", name: "N° Ruma", width: 5 },
  { uid: "activo", name: "Estado", width: 7 },
  { uid: "action", name: "Acciones", width: 5 },
];

const buildPlantasKey = (page: number, size: number, filters?: PlantaFiltersParams) => {
  return buildPaginatedSWRKey('plantas', page, size, filters);
};

export function TablePlanta() {
  const style = useButtonsStyles();
  const deleteAction = useAsyncAction();
  const { filters } = usePlantaContext();

  const [page, setPage] = useState<number>(PAGINATION_CONFIG.DEFAULT_PAGE);
  const pageSize = PAGINATION_CONFIG.DEFAULT_SIZE;

  const serviceFilters: PlantaFiltersParams | undefined = useMemo(() => {
    if (!filters || Object.keys(filters).length === 0) return undefined;
    
    return {
      codigo: filters.codigo,
      estado: filters.estado,
      fechaDesde: filters.fechaDesde?.toISOString().split('T')[0],
    };
  }, [filters]);

  const swrKey = buildPlantasKey(page, pageSize, serviceFilters);
  
  useEffect(() => {
    setPage(PAGINATION_CONFIG.DEFAULT_PAGE);
  }, [serviceFilters]);

  const {
    data: dataPlantas,
    isLoading: loadingPlantas,
    error: errorPlantas,
  } = useSWR<BaseResponse<PlantaPagedItemsResponse>>(
    swrKey, 
    () => PlantasService.listar<PlantaPagedItemsResponse>(page, pageSize, serviceFilters),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 2000,
      keepPreviousData: true,
      errorRetryCount: 1,
      errorRetryInterval: 1000,
    }
  );

  const respData = dataPlantas?.data;
  // La API ahora responde en data.items (estructura similar a calidades)
  const items: IPlantaResponse[] = (respData as any)?.items ?? [];
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
  const [idPlanta, setIdPlanta] = useState<string | undefined>(undefined);
  const [isClosingAfterSuccess, setIsClosingAfterSuccess] = useState(false);

  const [mode, setMode] = useState<"crear" | "editar" | "detalle">("crear");

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
      setIdPlanta(undefined);
      setMode("crear");
    }, 30);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setInfoPlanta(null);
    setIsClosingAfterSuccess(false);
    deleteAction.reset();
  };

  const [infoPlanta, setInfoPlanta] = useState<{
    id: string;
    codigo: string;
  } | null>(null);

  const renderCell = (item: any, columnKey: string) => {
    const planta = item as IPlantaResponse;
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
                statusColorMap[planta.activo ? "Activo" : "Inactivo"] || "#666",
              color: "#fff",
              width: "100%",
            }}
            size="large"
          >
            {planta.activo ? "ACTIVO" : "INACTIVO"}
          </Badge>
        );
      case "action":
        return (
          <div className="flex gap-1 justify-center w-full py-0.5">
            <Tooltip content="Info Planta" relationship="label">
              <Button
                size="large"
                appearance="subtle"
                onClick={() => handleOpenDetalle(planta.id)}
                icon={<Info24Filled style={{ color: OrgColors.serotGris }} />}
              />
            </Tooltip>
            <Tooltip content="Editar Planta" relationship="label">
              <Button
                size="large"
                appearance="subtle"
                onClick={() => handleOpenEditar(planta.id)}
                icon={<Edit24Filled style={{ color: OrgColors.azulOscuro }} />}
              />
            </Tooltip>

            <Tooltip content="Eliminar Planta" relationship="label">
              <Button
                size="large"
                appearance="subtle"
                onClick={() => {
                  setInfoPlanta({
                    id: planta.id,
                    codigo: planta.codigo,
                  });
                  setOpenModal(true);
                }}
                icon={<Delete24Filled style={{ color: OrgColors.rojo }} />}
              />
            </Tooltip>
          </div>
        );
      default:
        return (planta as any)[columnKey] ?? "";
    }
  };

  const handlePanelSuccess = () => {
    for (let i = 1; i <= paginationTotalPages + 2; i++) {
      mutate(buildPlantasKey(i, pageSize, serviceFilters), undefined, { revalidate: false });
    }
    if (mode === "crear") {
      const newTotal = paginationTotalItems + 1;
      const newLastPage = Math.ceil(newTotal / pageSize);
      setPage(newLastPage);
      mutate(buildPlantasKey(newLastPage, pageSize, serviceFilters));
    } else {
      mutate(buildPlantasKey(page, pageSize, serviceFilters));
    }
  };

  const actionDeleteModal = async () => {
    if (!infoPlanta) return;
    const deletingLastOnPage = items.length === 1 && page > 1;

    await deleteAction.execute(async () => {
      await PlantasService.eliminar(infoPlanta.id);
      return { success: true, message: "Planta eliminada correctamente" };
    });

    // Invalidar páginas adyacentes sin revalidar inmediata
    for (let i = Math.max(1, page - 1); i <= Math.min(paginationTotalPages, page + 1); i++) {
      mutate(buildPlantasKey(i, pageSize, serviceFilters), undefined, { revalidate: false });
    }

    if (deletingLastOnPage) {
      const prevPage = page - 1;
      setPage(prevPage);
      setTimeout(() => {
        mutate(buildPlantasKey(prevPage, pageSize, serviceFilters));
      }, 100);
    } else {
      mutate(buildPlantasKey(page, pageSize, serviceFilters));
    }
  };

  return (
    <>
      <Card style={{ width: "100%", height: "100%" }}>
        <div className="w-full h-full flex flex-col  ">
          <div className="w-full h-9/10 ">
            <div className="w-full h-2/25 flex justify-between items-start ">
              <Title title="Plantas de Homogenización" />
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
                isLoading={loadingPlantas}
                error={errorPlantas}
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

      <PlantaPanel
        mode={mode}
        open={openPanel}
        close={handleClosePanel}
        id={idPlanta}
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
              <div className="py-2">
                ¿Seguro que desea eliminar la planta
                <span className="font-semibold"> {infoPlanta?.codigo}</span>?
              </div>
            </>
          )}
          <AsyncActionDisplay
            state={deleteAction.state}
            loadingMessage={"Eliminando planta..."}
            successMessage={deleteAction.response?.message ?? "Se eliminó la planta correctamente"}
            onSuccess={() => {
              setIsClosingAfterSuccess(true);
              handleCloseModal();
            }}
          />
        </>
      </ModalBase>
    </>
  );
}
