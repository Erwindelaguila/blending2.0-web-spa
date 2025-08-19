"use client";

import { TableBase } from "@/components/ui/table-base";
import { Title } from "@/components/ui/title";
import { OrgColors } from "@/config/app.config.server";
import { Badge, Button, Card, Tooltip } from "@fluentui/react-components";
import { Add24Regular, Delete24Filled, Edit24Filled, Info24Filled } from "@fluentui/react-icons";
import { useEffect, useMemo, useState } from "react";
import { useButtonsStyles } from "@/styles/button.styles";
import { ModalBase } from "@/components/ui/modal-base";
import { Pagination } from "@/components/ui/pagination-base";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import useSWR, { mutate } from "swr";
import { useAsyncAction } from "@/hooks/use-async-action";
import { useAuth } from "@/hooks/use-auth";
import { ProductoPanel } from "./producto-panel";
import { ProductoService, ProductoFiltersParams } from "@/services/producto.service";
import { useProductoContext } from "./producto-context";
import { CalidadesService } from "@/services/calidades.service";
import { TipoProduccionService } from "@/services/tipo-produccion.service";

const columns = [
  { uid: "codigo", name: "Codigo", width: 5 },
  { uid: "nombre", name: "Nombre", width: 5 },
  { uid: "descripcion", name: "Descripción", width: 10 },
  { uid: "calidad", name: "Calidad", width: 6 },
  { uid: "tipo_produccion", name: "Tipo de Producción", width: 8 },
  { uid: "activo", name: "Estado", width: 7 },
  { uid: "action", name: "Acciones", width: 5 },
];

const buildProductosKey = (page: number, size: number, filters?: ProductoFiltersParams) => {
  const params = new URLSearchParams();
  params.set('page', page.toString());
  params.set('size', size.toString());
  if (filters?.codigo) params.set('codigo', filters.codigo);
  if (filters?.estado !== undefined) params.set('estado', filters.estado.toString());
  if (filters?.fechaInicio) params.set('fechaInicio', filters.fechaInicio);
  if (filters?.fechaFin) params.set('fechaFin', filters.fechaFin);
  if (filters?.tipoFecha) params.set('tipoFecha', filters.tipoFecha);
  return `productos-${params.toString()}`;
};

export function ProductoTable() {
  const style = useButtonsStyles();
  const deleteAction = useAsyncAction();
  const { user } = useAuth();
  const { filters } = useProductoContext();

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const serviceFilters: ProductoFiltersParams | undefined = useMemo(() => {
    if (!filters || Object.keys(filters).length === 0) return undefined;
    return {
      codigo: filters.codigo,
      estado: filters.estado,
      fechaInicio: filters.fechaInicio?.toISOString().split('T')[0],
      fechaFin: filters.fechaFin?.toISOString().split('T')[0],
      tipoFecha: filters.tipoFecha,
    };
  }, [filters]);

  const swrKey = buildProductosKey(page, pageSize, serviceFilters);

  useEffect(() => { setPage(1); }, [serviceFilters]);

  const { data, isLoading, error } = useSWR<any>(
    swrKey,
    () => ProductoService.listar(page, pageSize, serviceFilters),
    { revalidateOnFocus: false, revalidateOnReconnect: false, dedupingInterval: 2000 }
  );

  // Cargar combos para mapear IDs a códigos en columnas
  const { data: calidadesData } = useSWR("combo-calidades", () => CalidadesService.listar(1, 200));
  const { data: tiposData } = useSWR("combo-tipos", () => TipoProduccionService.listar(1, 200));

  const calidadMap = useMemo(() => {
    const arr = (calidadesData as any)?.data?.data || (calidadesData as any)?.data?.items || [];
    const map = new Map<string, string>();
    arr.forEach((c: any) => {
      const id = c.id?.toString();
      const codigo = c.codigo || c.Codigo || "";
      if (id) map.set(id, codigo);
    });
    return map;
  }, [calidadesData]);

  const tipoMap = useMemo(() => {
    const arr = (tiposData as any)?.data?.data || (tiposData as any)?.data?.items || [];
    const map = new Map<string, string>();
    arr.forEach((t: any) => {
      const id = t.id?.toString();
      const codigo = t.codigo || t.Codigo || "";
      if (id) map.set(id, codigo);
    });
    return map;
  }, [tiposData]);

  const items = data?.data?.data || [];
  const pagination = data?.data?.pagination;
  const paginationCurrentPage = pagination?.currentPage || page;
  const paginationTotalPages = pagination?.totalPages || 1;
  const paginationTotalItems = pagination?.totalCount || 0;
  const hasPrevious = pagination?.hasPrevious;
  const hasNext = pagination?.hasNext;
  const previousPage = pagination?.previousPage;
  const nextPage = pagination?.nextPage;

  const handlePageChange = (newPage: number) => {
    if (newPage !== page && newPage >= 1 && newPage <= paginationTotalPages) {
      setPage(newPage);
    }
  };

  const [openPanel, setOpenPanel] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [idProducto, setIdProducto] = useState<string | undefined>(undefined);
  const [isClosingAfterSuccess, setIsClosingAfterSuccess] = useState(false);
  const [mode, setMode] = useState<"crear" | "editar" | "detalle">("crear");

  const handleOpenCrear = () => { setMode("crear"); setIdProducto(undefined); setOpenPanel(true); };
  const handleOpenEditar = (registroId: string) => { setMode("editar"); setIdProducto(registroId); setOpenPanel(true); };
  const handleOpenDetalle = (registroId: string) => { setMode("detalle"); setIdProducto(registroId); setOpenPanel(true); };
  const handleClosePanel = () => { setOpenPanel(false); setTimeout(() => { setIdProducto(undefined); setMode("crear"); }, 30); };

  const [infoProducto, setInfoProducto] = useState<{ id: string; codigo: string } | null>(null);

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "calidad": {
        const id = item.calidad_id?.toString?.() || item.calidadId?.toString?.();
        const label = (id && (calidadMap.get(id) || id)) || "";
        return label;
      }
      case "tipo_produccion": {
        const id = item.tipo_produccion_id?.toString?.() || item.tipoProduccionId?.toString?.();
        const label = (id && (tipoMap.get(id) || id)) || "";
        return label;
      }
      case "activo":
        const statusColorMap: Record<string, string> = { Activo: OrgColors.serotAzul, Inactivo: OrgColors.rojo };
        return (
          <Badge appearance="filled" style={{ backgroundColor: statusColorMap[item.activo ? "Activo" : "Inactivo"] || "#666", color: "#fff", width: "100%" }} size="large">
            {item.activo ? "ACTIVO" : "INACTIVO"}
          </Badge>
        );
      case "action":
        return (
          <div className="flex gap-1 justify-center w-full py-0.5">
            <Tooltip content="Info Producto" relationship="label">
              <Button size="large" appearance="subtle" onClick={() => handleOpenDetalle(item.id)} icon={<Info24Filled style={{ color: OrgColors.serotGris }} />} />
            </Tooltip>
            <Tooltip content="Editar Producto" relationship="label">
              <Button size="large" appearance="subtle" onClick={() => handleOpenEditar(item.id)} icon={<Edit24Filled style={{ color: OrgColors.azulOscuro }} />} />
            </Tooltip>
            <Tooltip content="Eliminar Producto" relationship="label">
              <Button size="large" appearance="subtle" onClick={() => { setInfoProducto({ id: item.id, codigo: item.codigo }); setOpenModal(true); }} icon={<Delete24Filled style={{ color: OrgColors.rojo }} />} />
            </Tooltip>
          </div>
        );
      default:
        return item[columnKey] ?? "";
    }
  };

  const handlePanelSuccess = () => {
    for (let i = 1; i <= paginationTotalPages + 2; i++) {
      mutate(buildProductosKey(i, pageSize, serviceFilters), undefined, { revalidate: false });
    }
    if (mode === "crear") {
      const newTotal = (paginationTotalItems || 0) + 1;
      const newLastPage = Math.ceil(newTotal / pageSize);
      setPage(newLastPage);
      mutate(buildProductosKey(newLastPage, pageSize, serviceFilters));
    } else {
      mutate(buildProductosKey(page, pageSize, serviceFilters));
    }
  };

  const acctionDeleteModal = async () => {
    if (!infoProducto) return;
    const userId = user?.id;
    if (!userId) throw new Error("No se encontró el id del usuario autenticado");
    await deleteAction.execute(
      async () => {
        await ProductoService.eliminar(infoProducto.id, userId);
        return { success: true, message: "Producto eliminado correctamente" } as any;
      },
      buildProductosKey(page, pageSize)
    );
    for (let i = 1; i <= (paginationTotalPages || 1) + 1; i++) {
      mutate(buildProductosKey(i, pageSize, serviceFilters), undefined, { revalidate: false });
    }
    mutate(buildProductosKey(page, pageSize, serviceFilters));
    if (items.length === 1 && page > 1) {
      const prevPage = page - 1;
      setPage(prevPage);
      mutate(buildProductosKey(prevPage, pageSize, serviceFilters));
    }
  };

  return (
    <>
      <Card style={{ width: "100%", height: "100%" }}>
        <div className="w-full h-full flex flex-col  ">
          <div className="w-full h-9/10 ">
            <div className="w-full h-2/25 flex justify-between items-start ">
              <Title title="Productos" />
              <Button size="large" icon={<Add24Regular></Add24Regular>} className={`w-[13rem] ${style.buttonVerdeBase}`} onClick={() => handleOpenCrear()}>
                Nuevo
              </Button>
            </div>

            <div className="w-full h-23/25">
              <TableBase columns={columns} data={items} renderCell={renderCell} isLoading={isLoading} error={error} height="100%" />
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

      <ProductoPanel mode={mode} open={openPanel} close={handleClosePanel} id={idProducto} onSuccess={handlePanelSuccess} />

      <ModalBase
        open={openModal}
        setOpen={(isOpen) => {
          if (!isOpen) {
            setOpenModal(false); setInfoProducto(null); setIsClosingAfterSuccess(false); deleteAction.reset();
          } else { setOpenModal(isOpen); }
        }}
        type="alert"
        buttonText="Eliminar"
        closeOnOutsideClick={false}
        buttonAction={acctionDeleteModal}
        requiereAction={!deleteAction.isSuccess && !isClosingAfterSuccess}
      >
        <>
          {!deleteAction.isSuccess && (
            <>¿Está seguro de eliminar el producto con código <span className="font-bold">{infoProducto?.codigo}</span>?</>
          )}
          {deleteAction.isLoading && (<AsyncActionDisplay state={deleteAction.state} loadingMessage="Eliminando producto..." successMessage="" />)}
          {deleteAction.error && (<AsyncActionDisplay state={deleteAction.state} loadingMessage="" successMessage="" error={deleteAction.error} onErrorDismiss={deleteAction.reset} />)}
          {deleteAction.isSuccess && (
            <AsyncActionDisplay
              state={deleteAction.state}
              loadingMessage=""
              successMessage="Producto eliminado correctamente"
              onSuccess={() => { setIsClosingAfterSuccess(true); setOpenModal(false); setInfoProducto(null); setTimeout(() => { deleteAction.reset(); setIsClosingAfterSuccess(false); }, 300); }}
            />
          )}
        </>
      </ModalBase>
    </>
  );
}
