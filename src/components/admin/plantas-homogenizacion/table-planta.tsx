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
import { useAuth } from "@/hooks/use-auth";
import { useButtonsStyles } from "@/styles/button.styles";
import { ModalBase } from "@/components/ui/modal-base";
import { Pagination } from "@/components/ui/pagination-base";
import { PanelCrearPlanta } from "./panel-crear-planta";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import useSWR from "swr";
import { useAsyncAction } from "@/hooks/use-async-action";
import { IPlantaResponse } from "@/interface";
import { IPlantaGet } from "@/interface/admin/planta";
import { PlantasService } from "@/services";
import { getAllPlantaKey } from "@/lib/constants/key-fetch";

const columns = [
  { uid: "codigo", name: "Codigo", width: 5 },
  { uid: "nombre", name: "Nombre", width: 5 },
  { uid: "descripcion", name: "Descripción", width: 15 },
  { uid: "activo", name: "Estado", width: 7 },
  { uid: "action", name: "Acciones", width: 5 },
];

export function TablePlanta() {
  const style = useButtonsStyles();
  const deleteAction = useAsyncAction();

  const {
    data: dataPlantas,
    isLoading: loadingPlantas,
    error: errorPlantas,
  } = useSWR<IPlantaResponse[]>(getAllPlantaKey(), PlantasService.listar, {
    revalidateOnFocus: false,
    revalidateIfStale: true,
  });

  const [openPanel, setOpenPanel] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [idPlanta, setIdPlanta] = useState<string | undefined>(undefined);
  const [mode, setMode] = useState<"crear" | "editar" | "detalle">("crear");
  const [page, setPage] = useState(1);
  const [isClosingAfterSuccess, setIsClosingAfterSuccess] = useState(false);
  const itemsPerPage = 10; // O el valor que uses para paginación
  
  // Calcular paginación dinámica
  const totalItems = dataPlantas?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = dataPlantas?.slice(startIndex, endIndex) || [];

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
    const planta = item as IPlantaGet;
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
              backgroundColor: statusColorMap[planta.activo ? "Activo" : "Inactivo"] || "#666",
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
                onClick={() => handleOpenDetalle(planta.id.toString())}
                icon={<Info24Filled style={{ color: OrgColors.serotGris }} />}
              />
            </Tooltip>
            <Tooltip content="Editar Planta" relationship="label">
              <Button
                size="large"
                appearance="subtle"
                onClick={() => handleOpenEditar(planta.id.toString())}
                icon={<Edit24Filled style={{ color: OrgColors.azulOscuro }} />}
              />
            </Tooltip>

            <Tooltip content="Eliminar Planta" relationship="label">
              <Button
                size="large"
                appearance="subtle"
                onClick={() => {
                  // Limpiar el estado anterior antes de abrir el modal
                  deleteAction.reset();
                  setIsClosingAfterSuccess(false);
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
        return planta[columnKey as keyof IPlantaGet];
    }
  };

  const { user } = useAuth();
  const acctionDeleteModal = async () => {
    if (!infoPlanta) return;
    const userId = user?.id;
    if (!userId) throw new Error("No se encontró el id del usuario autenticado");
    await deleteAction.execute(
      async () => {
        await PlantasService.eliminar(infoPlanta.id, userId);
        return { success: true, message: "Planta eliminada correctamente" };
      },
      getAllPlantaKey()
    );
    // NO cerrar el modal aquí, dejar que el usuario haga clic en "Aceptar"
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
                onClick={handleOpenCrear}
              >
                Nuevo
              </Button>
            </div>

            <div className="w-full h-23/25">
              <TableBase
                columns={columns}
                data={currentPageData}
                renderCell={renderCell}
                isLoading={loadingPlantas}
                error={errorPlantas}
                height="100%"
              />
            </div>
          </div>

          <div className="w-full h-1/10">
            {dataPlantas && totalItems > 0 && (
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

      <PanelCrearPlanta
        open={openPanel}
        mode={mode}
        id={idPlanta}
        close={handleClosePanel}
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
        buttonAction={acctionDeleteModal}
        closeOnOutsideClick={false} // No permitir cerrar haciendo clic fuera
        requiereAction={!deleteAction.isSuccess && !isClosingAfterSuccess} // Ocultar botones cuando hay éxito O cuando está cerrando
      >
        <>
          {!deleteAction.isSuccess && (
            <>
              ¿Está seguro de eliminar la planta con código{" "}
              <span className="font-bold">{infoPlanta?.codigo}</span>?
            </>
          )}
          {deleteAction.isLoading && (
            <AsyncActionDisplay
              state={deleteAction.state}
              loadingMessage="Eliminando planta..."
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
              successMessage="Planta eliminada correctamente"
              onSuccess={() => {
                // Marcar que está cerrando después del éxito
                setIsClosingAfterSuccess(true);
                // Cerrar el modal inmediatamente
                setOpenModal(false);
                setInfoPlanta(null);
                // Resetear después de que el modal se haya cerrado
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
