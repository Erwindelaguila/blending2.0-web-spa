"use client";

import { TableBase } from "@/components/ui/table-base";
import { Title } from "@/components/ui/title";
import { OrgColors } from "@/config/app.config.server";
import { Badge, Button, Card, Tooltip } from "@fluentui/react-components";
import { Add24Regular, Edit24Filled, Power24Regular, Delete24Regular } from "@fluentui/react-icons";
import { useState, useEffect, useMemo, useRef, useLayoutEffect } from "react";
import { useButtonsStyles } from "@/styles/button.styles";
import { ModalBase } from "@/components/ui/modal-base";
import { Pagination } from "@/components/ui/pagination-base";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import useSWR from "swr";
import { mutate } from "swr";
import { useAsyncAction } from "@/hooks/use-async-action";
import { BaseResponse } from "@/interface/api/base-response";
import { AppParamPanel } from "./app-param-panel";

import { AppParamService } from "@/services/app-param.service";
import { IAppParam, IAppParamFilters, AppParamPagedItemsResponse } from "@/interface/admin/app-param";
import { useAppParamContext } from './app-param-context';
import { buildPaginatedSWRKey } from '@/utils/swr-keys';
import { PAGINATION_CONFIG } from '@/config/pagination.config';

function TruncateText({
  text,
  className = "",
  maxLines = 1,
  showTooltip = true,
}: {
  text: string;
  className?: string;
  maxLines?: number;
  showTooltip?: boolean;
}) {
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const [overflowing, setOverflowing] = useState(false);

  const calculate = () => {
    const el = spanRef.current;
    if (!el) return;
    setOverflowing(el.scrollWidth > el.clientWidth + 1);
  };

  useLayoutEffect(() => {
    calculate();
  }, [text]);

  useEffect(() => {
    const el = spanRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => calculate());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const content = (
    <span
      ref={spanRef}
      className={`block truncate ${className}`}
      style={{
        width: "100%",
        lineHeight: "1.1rem",
      }}
    >
      {text}
    </span>
  );

  if (showTooltip && overflowing && text) {
    return (
      <Tooltip content={text} relationship="description">
        <div style={{ width: "100%", overflow: "hidden" }}>
          {content}
        </div>
      </Tooltip>
    );
  }
  return content;
}

const columns = [
  { uid: "key", name: "Código", width: 20 }, 
  { uid: "value", name: "Valor", width: 8 }, 
  { uid: "description", name: "Descripción", width: 16 },
  { uid: "isActive", name: "Estado", width: 6 },
  { uid: "creadoEl", name: "Fecha Creación", width: 7 },
  { uid: "action", name: "Acciones", width: 8 }, 
];

const buildAppParamsKey = (page: number, size: number, filters?: IAppParamFilters) => {
  return buildPaginatedSWRKey('app-params', page, size, filters);
};

export function TableConfiguracionApp() {
  const style = useButtonsStyles();
  const deleteAction = useAsyncAction();
  const toggleAction = useAsyncAction(); 
  const { filters } = useAppParamContext();

  const [page, setPage] = useState<number>(PAGINATION_CONFIG.DEFAULT_PAGE);
  const pageSize = PAGINATION_CONFIG.DEFAULT_SIZE;

  const [openPanel, setOpenPanel] = useState(false);
  const [openModalToggle, setOpenModalToggle] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  // Estados para manejar acciones
  const [editData, setEditData] = useState<IAppParam | null>(null);
  const [toggleItem, setToggleItem] = useState<IAppParam | null>(null);
  const [deleteItem, setDeleteItem] = useState<IAppParam | null>(null);

  const serviceFilters: IAppParamFilters | undefined = useMemo(() => {
    if (!filters || Object.keys(filters).length === 0) return undefined;
    
    return {
      key: filters.key,
      isActive: filters.isActive,
      fecha: filters.fecha,
    };
  }, [filters]);

  const swrKey = buildAppParamsKey(page, pageSize, serviceFilters);
  
  useEffect(() => {
    setPage(PAGINATION_CONFIG.DEFAULT_PAGE);
  }, [serviceFilters]);

  // Invalidar caché cuando se elimina exitosamente
  useEffect(() => {
    if (deleteAction.state === 'success') {
      mutate((key) => typeof key === 'string' && key.startsWith('app-params'), undefined, { revalidate: true });
      setOpenModalDelete(false);
      setDeleteItem(null);
      deleteAction.reset();
    }
  }, [deleteAction.state]);

  // Invalidar caché cuando se actualiza estado exitosamente
  useEffect(() => {
    if (toggleAction.state === 'success') {
      mutate((key) => typeof key === 'string' && key.startsWith('app-params'), undefined, { revalidate: true });
      setOpenModalToggle(false);
      setToggleItem(null);
      toggleAction.reset();
    }
  }, [toggleAction.state]);

  const {
    data: dataAppParams,
    isLoading: loadingAppParams,
    error: errorAppParams,
  } = useSWR<BaseResponse<AppParamPagedItemsResponse>>(
    swrKey, 
    () => AppParamService.listar(page, pageSize, serviceFilters),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 2000,
    }
  );

  const appParams = dataAppParams?.data?.items || [];
  const pagination = dataAppParams?.data?.pagination;

  const renderCell = (item: IAppParam, columnKey: string) => {
    switch (columnKey) {
      case "key":
        return (
          <TruncateText
            text={item.key}
            className="font-mono text-sm"
          />
        );

      case "value":
        return (
          <TruncateText
            text={item.value || "-"}
            className="text-sm"
          />
        );

      case "description":
        return (
          <TruncateText
            text={item.description || ""}
            className="text-sm text-gray-600"
          />
        );

      case "isActive":
        return (
          <Badge
            appearance="filled"
            style={{
              backgroundColor: item.isActive ? OrgColors.serotAzul : OrgColors.rojo,
              color: "#fff",
              width: "100%",
            }}
            size="large"
          >
            {item.isActive ? "ACTIVO" : "INACTIVO"}
          </Badge>
        );

      case "creadoEl":
        return (
          <span className="text-sm">
            {item.creadoEl ? new Date(item.creadoEl).toLocaleDateString('es-ES') : "-"}
          </span>
        );

      case "action":
        return (
          <div className="flex gap-1 justify-center w-full py-0.5">
            {/* Editar */}
            <Tooltip content="Editar Parámetro" relationship="label">
              <Button
                size="small"
                appearance="subtle"
                onClick={() => {
                  setEditData(item);
                  setOpenPanel(true);
                }}
                icon={<Edit24Filled style={{ color: OrgColors.azulOscuro }} />}
              />
            </Tooltip>
            

            <Tooltip 
              content={item.isDisableable 
                ? "Este parámetro del sistema no puede ser desactivado" 
                : item.isActive ? "Desactivar" : "Activar"
              } 
              relationship="label"
            >
              <Button
                size="small"
                appearance="subtle"
                disabled={item.isDisableable}
                onClick={() => {
                  if (!item.isDisableable) {
                    setToggleItem(item);
                    setOpenModalToggle(true);
                  }
                }}
                icon={<Power24Regular style={{ 
                  color: item.isDisableable 
                    ? "#A0A0A0"  
                    : item.isActive ? OrgColors.rojo : OrgColors.verde 
                }} />}
              />
            </Tooltip>

     
            <Tooltip 
              content={!item.isRemovable 
                ? "Este parámetro del sistema no puede ser eliminado" 
                : "Eliminar Parámetro"
              } 
              relationship="label"
            >
              <Button
                size="small"
                appearance="subtle"
                disabled={!item.isRemovable}
                onClick={() => {
                  if (item.isRemovable) {
                    setDeleteItem(item);
                    setOpenModalDelete(true);
                  }
                }}
                icon={<Delete24Regular style={{ 
                  color: !item.isRemovable 
                    ? "#A0A0A0"  
                    : OrgColors.rojo 
                }} />}
              />
            </Tooltip>
          </div>
        );

      default:
        return String(item[columnKey as keyof IAppParam] || "");
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;

    await deleteAction.execute(async () => {
      return await AppParamService.eliminar(deleteItem.key);
    });
  };

  const handleToggleStatus = async () => {
    if (!toggleItem) return;

    await toggleAction.execute(async () => {
      return await AppParamService.actualizar(toggleItem.key, {
        value: toggleItem.value,
        description: toggleItem.description,
        isActive: !toggleItem.isActive,
      });
    });
  };

  const handlePanelSuccess = () => {
    // Forzar revalidación completa porque la key puede haber cambiado
    mutate((key) => typeof key === 'string' && key.startsWith('app-params'), undefined, { revalidate: true });
    
    if (!editData && pagination) {
      const lastPage = pagination.totalPages;
      if (lastPage > page) {
        setPage(lastPage);
      }
    }
    
    setOpenPanel(false);
    setEditData(null);
  };

  const handleNewParam = () => {
    setEditData(null);
    setOpenPanel(true);
  };

  return (
    <>
      <Card style={{ width: "100%", height: "100%" }}>
        <div className="w-full h-full flex flex-col">
          <div className="w-full h-full">
            <div className="w-full h-full flex flex-col">
              <div className="w-full h-9/10">
                <div className="w-full h-2/25 flex justify-between items-start">
                  <Title title="Configuración de la Aplicación" />
                  <Button
                    size="large"
                    icon={<Add24Regular />}
                    className={`w-[13rem] ${style.buttonVerdeBase}`}
                    onClick={handleNewParam}
                  >
                    Nuevo
                  </Button>
                </div>
                
                <div className="w-full h-23/25">
                  {deleteAction.state === "error" && (
                    <div className="mb-4">
                      <AsyncActionDisplay
                        state={deleteAction.state}
                        loadingMessage=""
                        successMessage=""
                        error={deleteAction.error}
                        onErrorDismiss={deleteAction.reset}
                      />
                    </div>
                  )}

                  {toggleAction.state === "error" && (
                    <div className="mb-4">
                      <AsyncActionDisplay
                        state={toggleAction.state}
                        loadingMessage=""
                        successMessage=""
                        error={toggleAction.error}
                        onErrorDismiss={toggleAction.reset}
                      />
                    </div>
                  )}

                  <TableBase
                    columns={columns}
                    data={appParams as any}
                    renderCell={renderCell as any}
                    isLoading={loadingAppParams}
                    error={errorAppParams}
                    height="100%"
                  />
                </div>
              </div>
              
              {pagination && (
                <div className="w-full h-1/10">
                  <Pagination
                    totalItems={pagination.totalCount}
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      <AppParamPanel
        open={openPanel}
        close={() => setOpenPanel(false)}
        editData={editData}
        onSuccess={handlePanelSuccess}
      />

      <ModalBase
        open={openModalToggle}
        setOpen={setOpenModalToggle}
        type="alert"
        buttonText={toggleItem?.isActive ? "Desactivar" : "Activar"}
        buttonAction={handleToggleStatus}
        closeOnOutsideClick={false}
        requiereAction={!toggleAction.isSuccess}
      >
        <>
          {!toggleAction.isSuccess && (
            <>
              ¿Está seguro de {toggleItem?.isActive ? "desactivar" : "activar"} el parámetro{" "}
              <span className="font-bold font-mono">{toggleItem?.key}</span>?
            </>
          )}

          {toggleAction.isLoading && (
            <AsyncActionDisplay
              state={toggleAction.state}
              loadingMessage={`${toggleItem?.isActive ? 'Desactivando' : 'Activando'} parámetro...`}
              successMessage=""
            />
          )}
          {toggleAction.error && (
            <AsyncActionDisplay
              state={toggleAction.state}
              loadingMessage=""
              successMessage=""
              error={toggleAction.error}
              onErrorDismiss={toggleAction.reset}
            />
          )}
          {toggleAction.isSuccess && (
            <AsyncActionDisplay
              state={toggleAction.state}
              loadingMessage=""
              successMessage={`Parámetro ${toggleItem?.isActive ? 'desactivado' : 'activado'} correctamente`}
              onSuccess={() => {
                mutate((key) => typeof key === 'string' && key.startsWith('app-params'));
                setOpenModalToggle(false);
                setToggleItem(null);
                setTimeout(() => {
                  toggleAction.reset();
                }, 300);
              }}
            />
          )}
        </>
      </ModalBase>

      <ModalBase
        open={openModalDelete}
        setOpen={setOpenModalDelete}
        type="alert"
        buttonText="Eliminar"
        buttonAction={handleDelete}
        closeOnOutsideClick={false}
        requiereAction={!deleteAction.isSuccess}
      >
        <>
          {!deleteAction.isSuccess && (
            <>
              ¿Está seguro de <strong>eliminar permanentemente</strong> el parámetro{" "}
              <span className="font-bold font-mono">{deleteItem?.key}</span>?
              <br />
              <span className="text-sm text-red-600 mt-2 block">
                ⚠️ <strong>Esta acción no se puede deshacer.</strong>
              </span>
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
                mutate((key) => typeof key === 'string' && key.startsWith('app-params'));
                setOpenModalDelete(false);
                setDeleteItem(null);
                setTimeout(() => {
                  deleteAction.reset();
                }, 300);
              }}
            />
          )}
        </>
      </ModalBase>
    </>
  );
}
