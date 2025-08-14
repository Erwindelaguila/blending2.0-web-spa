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
import { useState } from "react";
import { useButtonsStyles } from "@/styles/button.styles";
import { ModalBase } from "@/components/ui/modal-base";
import { Pagination } from "@/components/ui/pagination-base";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import useSWR from "swr";
import { mutate } from "swr";
import { useAsyncAction } from "@/hooks/use-async-action";
import { BaseResponse } from "@/interface";
import { getAllAgregadoKey } from "@/lib/constants/key-fetch";
import { AgregadoPanel } from "./agregado-panel";
import { AgregadoService } from "@/services/agregado.service";
import { IAgregado } from "@/interface/admin/agregado";
import { useAuth } from "@/hooks/use-auth";
import { PagedAgregadoResponse } from "@/interface/admin/agregado";

const columns = [
  { uid: "codigo", name: "Codigo", width: 5 },
  { uid: "nombre", name: "Nombre", width: 5 },
  { uid: "descripcion", name: "Descripción", width: 10 },
  { uid: "activo", name: "Estado", width: 7 },
  { uid: "action", name: "Acciones", width: 5 },
];

const buildAgregadosKey = (page: number, size: number) => `agregados-page-${page}-${size}`;

export function AgregadoTable() {
  const style = useButtonsStyles();
  const deleteAction = useAsyncAction();
  const { user } = useAuth();

  const [page, setPage] = useState(1);
  const pageSize = 10; // tamaño de página enviado al backend

  const swrKey = buildAgregadosKey(page, pageSize);
  const {
    data: dataAgregados,
    isLoading: loadingAgregados,
    error: errorAregados,
  } = useSWR<BaseResponse<PagedAgregadoResponse>>(
    swrKey, 
    () => AgregadoService.listar(page, pageSize),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 2000, // Evita llamadas duplicadas por 2 segundos
    }
  );

  // Datos con nueva estructura del backend
  const items: IAgregado[] = dataAgregados?.data?.data || [];

  // Extraer metadatos de paginación de la nueva estructura
  const pagination = dataAgregados?.data?.pagination;
  const paginationCurrentPage = pagination?.currentPage || page;
  const paginationTotalPages = pagination?.totalPages || 1;
  const paginationTotalItems = pagination?.totalCount || 0;
  const hasPrevious = pagination?.hasPrevious;
  const hasNext = pagination?.hasNext;
  const previousPage = pagination?.previousPage;
  const nextPage = pagination?.nextPage;

  // Handler optimizado de cambio de página
  const handlePageChange = (newPage: number) => {
    // Solo cambiar si es diferente y válido
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
      setIdCalidad(undefined); // importante limpiar el ID
      setMode("crear"); // o el modo por defecto
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
    // Limpiar cache de múltiples páginas para evitar datos obsoletos
    for (let i = 1; i <= paginationTotalPages + 2; i++) {
      mutate(buildAgregadosKey(i, pageSize), undefined, { revalidate: false });
    }
    
    // Calcular la nueva última página asumiendo que se agregó un elemento
    const newTotal = paginationTotalItems + 1;
    const newLastPage = Math.ceil(newTotal / pageSize);
    
    // Navegar a la nueva última página y revalidar
    setPage(newLastPage);
    mutate(buildAgregadosKey(newLastPage, pageSize));
  };

  const acctionDeleteModal = async () => {
    if (!infoAgregado) return;
    const userId = user?.id;
    if (!userId) throw new Error("No se encontró el id del usuario autenticado");
    
    await deleteAction.execute(
      async () => {
        await AgregadoService.eliminar(infoAgregado.id, userId);
        return { success: true, message: "Agregado eliminado correctamente" };
      },
      buildAgregadosKey(page, pageSize)
    );

    // Limpiar cache de múltiples páginas después de eliminar
    for (let i = 1; i <= paginationTotalPages + 1; i++) {
      mutate(buildAgregadosKey(i, pageSize), undefined, { revalidate: false });
    }
    
    // Revalidar página actual
    mutate(buildAgregadosKey(page, pageSize));
    
    // Si eliminamos el último elemento de la página y no es la página 1, ir a la anterior
    if (items.length === 1 && page > 1) {
      const prevPage = page - 1;
      setPage(prevPage);
      mutate(buildAgregadosKey(prevPage, pageSize));
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
                error={errorAregados}
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
