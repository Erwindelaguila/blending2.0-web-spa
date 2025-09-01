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
import { ProductoPanel } from "./producto-panel";
import { ProductoService } from "@/services/producto.service";
import { IProductoResponse, PagedProductoResponse } from "@/interface/admin/producto";
import { useProductoContext } from "./producto-context";
import { buildPaginatedSWRKey } from "@/utils/swr-keys";
import { BaseResponse } from "@/interface";

const columns = [
  { uid: "Codigo", name: "Codigo", width: 5 },
  { uid: "Nombre", name: "Nombre", width: 5 },
  { uid: "Descripcion", name: "Descripción", width: 10 },
  { uid: "calidad", name: "Calidad", width: 6 },
  { uid: "tipo_produccion", name: "Tipo de Producción", width: 8 },
  { uid: "activo", name: "Estado", width: 7 },
  { uid: "action", name: "Acciones", width: 5 },
];

const buildProductosKey = (page: number, size: number, filters?: any) =>
  buildPaginatedSWRKey('productos', page, size, filters);

export function ProductoTable() {
  const style = useButtonsStyles();
  const deleteAction = useAsyncAction();
  const { filters } = useProductoContext();

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const serviceFilters: any | undefined = useMemo(() => {
    if (!filters || Object.keys(filters).length === 0) return undefined;
    return {
      codigo: filters.codigo,
      estado: filters.estado,
      fechaDesde: filters.fechaDesde?.toISOString().split('T')[0],
    };
  }, [filters]);

  const swrKey = buildProductosKey(page, pageSize, serviceFilters);

  useEffect(() => { setPage(1); }, [serviceFilters]);

  const { data, isLoading, error } = useSWR<BaseResponse<PagedProductoResponse>>(
    swrKey,
    () => ProductoService.listar(page, pageSize, serviceFilters),
    { revalidateOnFocus: false, revalidateOnReconnect: false, dedupingInterval: 2000 }
  );

  
  const respData = data?.data; 
  const items: IProductoResponse[] = respData?.items ?? [];
  
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
  const [idProducto, setIdProducto] = useState<string | undefined>(undefined);
  const [isClosingAfterSuccess, setIsClosingAfterSuccess] = useState(false);
  const [mode, setMode] = useState<"crear" | "editar" | "detalle">("crear");

  const handleOpenCrear = () => { setMode("crear"); setIdProducto(undefined); setOpenPanel(true); };
  const handleOpenEditar = (registroId: string) => { setMode("editar"); setIdProducto(registroId); setOpenPanel(true); };
  const handleOpenDetalle = (registroId: string) => { setMode("detalle"); setIdProducto(registroId); setOpenPanel(true); };
  const handleClosePanel = () => { setOpenPanel(false); setTimeout(() => { setIdProducto(undefined); setMode("crear"); }, 30); };

  const [infoProducto, setInfoProducto] = useState<{ id: string; codigo: string } | null>(null);

  const renderCell = (item: any, columnKey: string) => {
    // Normalizar item soportando estructura nueva con objetos anidados
    const normalizedItem = {
      id: item.id ?? item.Id,
      codigo: item.codigo ?? item.Codigo,
      nombre: item.nombre ?? item.Nombre,
      descripcion: item.descripcion ?? item.Descripcion,
      activo: item.activo ?? item.Activo,
      calidadId: item.calidadId ?? item.CalidadId ?? item.calidad?.id,
      calidadCodigo: item.calidadCodigo ?? item.calidad?.codigo,
      tipoProduccionId: item.tipoProduccionId ?? item.TipoProduccionId ?? item.tipoProduccion?.id,
      tipoProduccionCodigo: item.tipoProduccionCodigo ?? item.tipoProduccion?.codigo,
    };

    switch (columnKey) {
      case "Codigo":
        return normalizedItem.codigo;
      case "Nombre":
        return normalizedItem.nombre;
      case "Descripcion":
        return normalizedItem.descripcion ?? "Sin descripción";
      case "calidad":
        return normalizedItem.calidadCodigo || normalizedItem.calidadId || "";
      case "tipo_produccion":
        return normalizedItem.tipoProduccionCodigo || normalizedItem.tipoProduccionId || "";
      case "activo":
        const statusColorMap: Record<string, string> = { Activo: OrgColors.serotAzul, Inactivo: OrgColors.rojo };
        return (
          <Badge appearance="filled" style={{ backgroundColor: statusColorMap[normalizedItem.activo ? "Activo" : "Inactivo"] || "#666", color: "#fff", width: "100%" }} size="large">
            {normalizedItem.activo ? "ACTIVO" : "INACTIVO"}
          </Badge>
        );
      case "action":
        return (
          <div className="flex gap-1 justify-center w-full py-0.5">
            <Tooltip content="Info Producto" relationship="label">
              <Button size="large" appearance="subtle" onClick={() => handleOpenDetalle(normalizedItem.id)} icon={<Info24Filled style={{ color: OrgColors.serotGris }} />} />
            </Tooltip>
            <Tooltip content="Editar Producto" relationship="label">
              <Button size="large" appearance="subtle" onClick={() => handleOpenEditar(normalizedItem.id)} icon={<Edit24Filled style={{ color: OrgColors.azulOscuro }} />} />
            </Tooltip>
            <Tooltip content="Eliminar Producto" relationship="label">
              <Button size="large" appearance="subtle" onClick={() => { setInfoProducto({ id: normalizedItem.id, codigo: normalizedItem.codigo }); setOpenModal(true); }} icon={<Delete24Filled style={{ color: OrgColors.rojo }} />} />
            </Tooltip>
          </div>
        );
      default:
        return item[columnKey] ?? "";
    }
  };

  const handlePanelSuccess = () => {
    // Invalidar silenciosamente cache de todas las páginas conocidas + potencial nueva
    for (let i = 1; i <= paginationTotalPages + 2; i++) {
      mutate(buildProductosKey(i, pageSize, serviceFilters), undefined, { revalidate: false });
    }

    if (mode === "crear") {
      const newTotal = paginationTotalItems + 1;
      const newLastPage = Math.ceil(newTotal / pageSize);
      setPage(newLastPage);
      mutate(buildProductosKey(newLastPage, pageSize, serviceFilters));
    } else {
      mutate(buildProductosKey(page, pageSize, serviceFilters));
    }
  };

  const acctionDeleteModal = async () => {
    if (!infoProducto) return;
    
    const isLastItemOnPage = items.length === 1;
    const shouldGoToPreviousPage = isLastItemOnPage && page > 1;

    await deleteAction.execute(async () => {
      await ProductoService.eliminar(infoProducto.id);
      return { success: true, message: "Producto eliminado correctamente" };
    });

    // Invalidar cache de múltiples páginas
    for (let i = Math.max(1, page - 1); i <= Math.min(paginationTotalPages, page + 1); i++) {
      mutate(buildProductosKey(i, pageSize, serviceFilters), undefined, { revalidate: false });
    }

    if (shouldGoToPreviousPage) {
      // Si elimino el último elemento de la página, ir a página anterior
      const prevPage = page - 1;
      setPage(prevPage);
      setTimeout(() => {
        mutate(buildProductosKey(prevPage, pageSize, serviceFilters));
      }, 100);
    } else {
      // Si no es el último elemento, revalidar página actual
      mutate(buildProductosKey(page, pageSize, serviceFilters));
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

            <div className="w-full h-23/25 pt-1">
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
