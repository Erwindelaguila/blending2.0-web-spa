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
import { useState, useMemo, useEffect } from "react";
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
// import { ITipoProduccionResponse } from "@/interface/admin/tipo-produccion";
import { useAuth } from "@/hooks/use-auth";
import { useTipoProduccionContext } from "./tipo-produccion-context";
import { buildPaginatedSWRKey } from "@/utils/swr-keys";
import { PAGINATION_CONFIG } from "@/config/pagination.config";

const columns = [
  { uid: "codigo", name: "Codigo", width: 5 },
  { uid: "nombre", name: "Nombre", width: 5 },
  { uid: "descripcion", name: "Descripción", width: 10 },
  { uid: "linea_produccion_id", name: "Línea", width: 5 },
  { uid: "agregado_id", name: "Agregado", width: 5 },
  { uid: "activo", name: "Estado", width: 7 },
  { uid: "action", name: "Acciones", width: 5 },
];

const buildTipoProduccionKey = (page: number, size: number, filters?: any) =>
  buildPaginatedSWRKey("tipoproduccion", page, size, filters);

export function TipoProduccionTable() {
  const style = useButtonsStyles();
  const deleteAction = useAsyncAction();
  const { user } = useAuth();
  const { filters } = useTipoProduccionContext();

  const [page, setPage] = useState<number>(PAGINATION_CONFIG.DEFAULT_PAGE);
  const pageSize = PAGINATION_CONFIG.DEFAULT_SIZE;
  const serviceFilters = useMemo(() => {
    if (!filters || Object.keys(filters).length === 0) return undefined;
    return {
      codigo: filters.codigo,
      estado: filters.estado,
      fechaDesde: filters.fechaDesde?.toISOString().split("T")[0],
    };
  }, [filters]);
  const swrKey = buildTipoProduccionKey(page, pageSize, serviceFilters);
  useEffect(() => { setPage(PAGINATION_CONFIG.DEFAULT_PAGE); }, [serviceFilters]);

  const {
    data: dataTipos,
    isLoading: loadingTipos,
    error: errorTipos,
  } = useSWR<any>(
    swrKey,
    () => TipoProduccionService.listar(page, pageSize, serviceFilters),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 2000,
    }
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
    const list = ((lineasLookup as any)?.data?.items || (lineasLookup as any)?.data?.data || []) as any[];
    return Object.fromEntries(list.map((l: any) => [l.id, l.codigo]));
  }, [lineasLookup]);
  const agregadosMap = useMemo(() => {
    const list = ((agregadosLookup as any)?.data?.items || (agregadosLookup as any)?.data?.data || []) as any[];
    return Object.fromEntries(list.map((a: any) => [a.id, a.codigo]));
  }, [agregadosLookup]);

  let payload: any = dataTipos?.data || (dataTipos as any)?.Data;
  if (!payload && dataTipos && Array.isArray((dataTipos as any).items)) {
    payload = dataTipos as any;
  }
  
  const items: any[] = (payload?.items || payload?.data || []);
  const {
    currentPage: paginationCurrentPage = page,
    totalPages: paginationTotalPages = 1,
    totalCount: paginationTotalItems = 0,
    hasPrevious,
    hasNext,
    previousPage,
    nextPage,
  } = payload?.pagination ?? {};

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
      setIdTipo(undefined); 
      setMode("crear"); 
    }, 30);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setInfoTipo(null);
    setIsClosingAfterSuccess(false);
    deleteAction.reset();
  };

  const [infoTipo, setInfoTipo] = useState<{
    id: string;
    codigo: string;
  } | null>(null);

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "codigo":
        return item.codigo;
      case "nombre":
        return item.nombre;
      case "descripcion":
        return item.descripcion ?? "Sin descripción";
      case "linea_produccion_id":
   
        return item.lineaProduccion?.codigo || lineasMap[item.linea_produccion_id || item.LineaProduccionId || item.lineaProduccionId] || "No encontrado";
      case "agregado_id":
        return item.agregado?.codigo || agregadosMap[item.agregado_id || item.AgregadoId || item.agregadoId] || "No encontrado";
      case "activo":
        const statusColorMap: Record<string, string> = {
          Activo: OrgColors.serotAzul,
          Inactivo: OrgColors.rojo,
        };
        const isActive = item.activo ?? item.Activo;
        return (
          <Badge
            appearance="filled"
            style={{
              backgroundColor:
                statusColorMap[isActive ? "Activo" : "Inactivo"] || "#666",
              color: "#fff",
              width: "100%",
            }}
            size="large"
          >
            {(item.activo ?? item.Activo) ? "ACTIVO" : "INACTIVO"}
          </Badge>
        );
      case "action":
        return (
          <div className="flex gap-1 justify-center w-full py-0.5">
            <Tooltip content="Info" relationship="label">
              <Button
                size="large"
                appearance="subtle"
                onClick={() => handleOpenDetalle(String(item.id ?? item.Id))}
                icon={<Info24Filled style={{ color: OrgColors.serotGris }} />}
              />
            </Tooltip>
            <Tooltip content="Editar" relationship="label">
              <Button
                size="large"
                appearance="subtle"
                onClick={() => handleOpenEditar(String(item.id ?? item.Id))}
                icon={<Edit24Filled style={{ color: OrgColors.azulOscuro }} />}
              />
            </Tooltip>

            <Tooltip content="Eliminar" relationship="label">
              <Button
                size="large"
                appearance="subtle"
                onClick={() => {
                  setInfoTipo({
                    id: String(item.id ?? item.Id),
                    codigo: (item.codigo ?? item.Codigo) as string,
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
    for (let i = 1; i <= paginationTotalPages + 2; i++) {
      mutate(buildTipoProduccionKey(i, pageSize, serviceFilters), undefined, {
        revalidate: false,
      });
    }
    if (mode === "crear") {
      const newTotal = paginationTotalItems + 1;
      const newLastPage = Math.ceil(newTotal / pageSize);
      setPage(newLastPage);
      mutate(buildTipoProduccionKey(newLastPage, pageSize, serviceFilters));
    } else {
      mutate(buildTipoProduccionKey(page, pageSize, serviceFilters));
    }
  };

  const acctionDeleteModal = async () => {
    if (!infoTipo) return;
    const userId = user?.id;
    if (!userId)
      throw new Error("No se encontró el id del usuario autenticado");

    await deleteAction.execute(
      async () => {
        await TipoProduccionService.eliminar(infoTipo.id.toString());
        return { success: true, message: "Tipo de Producción eliminado correctamente" };
      },
      buildTipoProduccionKey(page, pageSize, serviceFilters)
    );
    for (let i = 1; i <= paginationTotalPages + 1; i++) {
      mutate(buildTipoProduccionKey(i, pageSize, serviceFilters), undefined, {
        revalidate: false,
      });
    }
    mutate(buildTipoProduccionKey(page, pageSize, serviceFilters));
    if (items.length === 1 && page > 1) {
      const prevPage = page - 1;
      setPage(prevPage);
      mutate(buildTipoProduccionKey(prevPage, pageSize, serviceFilters));
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
                onPageChange={(newPage) => {
                  if (
                    newPage !== page &&
                    newPage >= 1 &&
                    newPage <= paginationTotalPages
                  ) {
                    setPage(newPage);
                  }
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
