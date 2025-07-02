"use client";

import { TableBase } from "@/components/ui/table-base";
import { Title } from "@/components/ui/title";
import { OrgColors } from "@/config/app.config.server";
import {
  Badge,
  Button,
  Card,
  Tooltip,
} from "@fluentui/react-components";
import {
  Add24Regular,
  Delete24Filled,
  Edit24Filled,
} from "@fluentui/react-icons";
import { useState, useEffect } from "react";
import { useButtonsStyles } from "@/styles/button.styles";
import { ModalBase } from "@/components/ui/modal-base";
import { Pagination } from "@/components/ui/pagination-base";
import { PanelCrearCalidad } from "./panel-crear-calidad";
import { CalidadesService } from "@/services/calidades.service";
import { useAsyncAction } from "@/hooks/use-async-action";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import type { ICalidadResponse } from "@/services/calidades.service";

const columns = [
  { uid: "code", name: "Codigo", width: 5 },
  { uid: "name", name: "Nombre", width: 5 },
  { uid: "description", name: "Descripción", width: 10 },
  { uid: "codigoMaterial", name: "Código de Material", width: 5 },
  { uid: "status", name: "Estado", width: 7 },
  { uid: "action", name: "Acciones", width: 5 },
];

export function TableCalidades() {
  const style = useButtonsStyles();

  const [openPanel, setOpenPanel] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState(1);
  const [calidades, setCalidades] = useState<ICalidadResponse[]>([]);
  const [infoCalidad, setInfoCalidad] = useState<{
    id: number;
    codigo: string;
  } | null>(null);
  const [calidadAEditar, setCalidadAEditar] = useState<ICalidadResponse | null>(
    null
  );
  const deleteAction = useAsyncAction();

  // Configuración de paginación
  const ITEMS_PER_PAGE = 8;
  const totalItems = calidades.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const showPagination = totalItems > 0;

  // ============================================
  // DATOS Y ESTADOS
  // ============================================

  const [loading, setLoading] = useState(false);

  // Función para cargar calidades
  const loadCalidades = async () => {
    setLoading(true);
    try {
      const data = await CalidadesService.listar();
      setCalidades(data);
    } catch (error) {
      console.error("Error al cargar calidades:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalidades();
  }, []);

  useEffect(() => {
    if (deleteAction.state === "success") {
      handleDeleteSuccess();
    }
  }, [deleteAction.state]);

  const handleDeleteSuccess = () => {
    loadCalidades();
    setOpenModal(false);
    deleteAction.reset();
  };

  const handlePanelClose = () => {
    setCalidadAEditar(null);
    setOpenPanel(false);
    loadCalidades();
  };

  // Aplicar paginación a los datos
  const mappedCalidades = calidades.map((item) => {
    return {
      code: item.codigo,
      name: item.nombre,
      description: item.descripcion,
      codigoMaterial: item.codigoMaterial,
      status: item.activo ? "Activo" : "Inactivo",
      activo: item.activo,
      id: item.id,
      raw: item,
    };
  });

  // Datos paginados
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = mappedCalidades.slice(startIndex, endIndex);

  // Resetear página si es necesario
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [totalPages, page]);

  const handleEdit = (item: ICalidadResponse) => {
    setCalidadAEditar(item);
    setOpenPanel(true);
  };

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "status":
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
          <div className="flex gap-1 justify-between w-full py-0.5">
            <Tooltip content="Editar Calidad" relationship="label">
              <Button
                size="large"
                appearance="subtle"
                onClick={() => handleEdit(item.raw)}
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
                    codigo: item.code,
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

  const acctionDeleteModal = async () => {
    if (!infoCalidad) return;
    await deleteAction.execute(async () => {
      await CalidadesService.eliminar(infoCalidad.id);
    });
  };
  return (
    <>
      <Card style={{ width: "100%", height: "100%" }}>
        <div className="w-full h-full flex flex-col  ">
          <div className="w-full h-9/10 ">
            <div className="w-full h-2/25 flex justify-between items-start ">
              <Title title="Plantas de Homogenizado" />
              <Button
                size="large"
                icon={<Add24Regular></Add24Regular>}
                className={`w-[13rem] ${style.buttonVerdeBase}`}
                onClick={() => setOpenPanel(true)}
              >
                Nuevo
              </Button>
            </div>

            <div className="w-full h-23/25">
              <TableBase
                columns={columns}
                data={paginatedData}
                renderCell={renderCell}
                isLoading={loading}
                error={null}
                height="100%"
              />
            </div>
          </div>

          <div className="w-full h-1/10">
            {showPagination && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalItems}
                onPageChange={setPage}
              />
            )}
          </div>
        </div>
      </Card>

      <PanelCrearCalidad
        drawerType="alert"
        isOpen={openPanel}
        setIsOpen={setOpenPanel}
        calidadAEditar={calidadAEditar}
        onClose={handlePanelClose}
      />

      <ModalBase
        open={openModal}
        setOpen={setOpenModal}
        type="alert"
        buttonText="Eliminar"
        buttonAction={acctionDeleteModal}
      >
        <>
          ¿Está seguro de eliminar la calidad con código{" "}
          <span className="font-bold">{infoCalidad?.codigo}</span>?
          {deleteAction.state === "loading" && (
            <AsyncActionDisplay
              state={deleteAction.state}
              loadingMessage="Eliminando calidad..."
              successMessage=""
            />
          )}
          {deleteAction.state === "error" && (
            <AsyncActionDisplay
              state={deleteAction.state}
              loadingMessage=""
              successMessage=""
              error={deleteAction.error}
              onErrorDismiss={deleteAction.reset}
            />
          )}
          {deleteAction.state === "success" && (
            <AsyncActionDisplay
              state={deleteAction.state}
              loadingMessage=""
              successMessage="Calidad eliminada correctamente"
              onSuccess={() => {
                deleteAction.reset();
                setOpenModal(false);
              }}
            />
          )}
        </>
      </ModalBase>
    </>
  );
}
