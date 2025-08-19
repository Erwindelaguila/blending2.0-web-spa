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
import { PagedCalidadResponse, ICalidadResponse } from "@/interface/admin/calidad";
import { useCalidadContext } from "./calidad-context";

const columns = [
  { uid: "codigo", name: "Codigo", width: 5 },
  { uid: "nombre", name: "Nombre", width: 5 },
  { uid: "descripcion", name: "Descripción", width: 10 },
  { uid: "codigoMaterial", name: "Código de Material", width: 5 },
  { uid: "activo", name: "Estado", width: 7 },
  { uid: "action", name: "Acciones", width: 5 },
];

const buildCalidadesKey = (page: number, size: number, filters?: any) => {
  const params = new URLSearchParams();
  params.set("page", page.toString());
  params.set("size", size.toString());
  if (filters?.codigo) params.set("codigo", filters.codigo);
  if (filters?.estado !== undefined) params.set("estado", String(filters.estado));
  if (filters?.fechaInicio) params.set("fechaInicio", filters.fechaInicio);
  if (filters?.fechaFin) params.set("fechaFin", filters.fechaFin);
  if (filters?.tipoFecha) params.set("tipoFecha", filters.tipoFecha);
  return `calidades-${params.toString()}`;
};

export function CalidadTable() {
  const style = useButtonsStyles();
  const deleteAction = useAsyncAction();
  const { user } = useAuth();
  const { filters } = useCalidadContext();

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const serviceFilters = useMemo(() => {
    if (!filters || Object.keys(filters).length === 0) return undefined;
    return {
      codigo: filters.codigo,
      estado: filters.estado,
      fechaInicio: filters.fechaInicio?.toISOString().split("T")[0],
      fechaFin: filters.fechaFin?.toISOString().split("T")[0],
      tipoFecha: filters.tipoFecha,
    };
  }, [filters]);

  const swrKey = buildCalidadesKey(page, pageSize, serviceFilters);

  useEffect(() => { setPage(1); }, [serviceFilters]);
  const {
    data: dataCalidades,
    isLoading: loadingCalidades,
    error: errorCalidades,
  } = useSWR<any>(
    swrKey,
    () => CalidadesService.listar(page, pageSize, serviceFilters as any),
    { revalidateOnFocus: false, revalidateOnReconnect: false, dedupingInterval: 2000 }
  );

  const items: ICalidadResponse[] = (dataCalidades as any)?.data?.items || (dataCalidades as any)?.data?.data || [];
  const pagination = (dataCalidades as any)?.data?.meta || (dataCalidades as any)?.data?.pagination;
  const paginationCurrentPage = pagination?.currentPage ?? (dataCalidades?.data as any)?.page ?? page;
  const paginationTotalPages = pagination?.totalPages ?? (dataCalidades?.data as any)?.totalPages ?? 1;
  const paginationTotalItems = pagination?.totalCount ?? (dataCalidades?.data as any)?.total ?? 0;
  const hasPrevious = pagination?.hasPrevious;
  const hasNext = pagination?.hasNext;
  const previousPage = pagination?.previousPage;
  const nextPage = pagination?.nextPage;

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
    for (let i = 1; i <= (paginationTotalPages || 1) + 2; i++) {
      mutate(buildCalidadesKey(i, pageSize, serviceFilters), undefined, { revalidate: false });
    }
    if (mode === "crear") {
      const newTotal = (paginationTotalItems || 0) + 1;
      const newLastPage = Math.ceil(newTotal / pageSize) || 1;
      setPage(newLastPage);
      mutate(buildCalidadesKey(newLastPage, pageSize, serviceFilters));
    } else {
      mutate(buildCalidadesKey(page, pageSize, serviceFilters));
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
