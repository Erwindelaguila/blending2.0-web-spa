"use client";

import { TableBase } from "@/components/ui/table-base";
import { Title } from "@/components/ui/title";
import { OrgColors } from "@/config/app.config.server";
import { hexToRgba } from "@/utils/colors";
import {
  Badge,
  Button,
  Card,
  CardPreview,
  Tooltip,
} from "@fluentui/react-components";
import {
  Add24Regular,
  Delete24Filled,
  Edit24Filled,
} from "@fluentui/react-icons";
import { useState } from "react";
import { PanelCrearPlanta } from "./panel-crear-planta";
import { useButtonsStyles } from "@/styles/button.styles";
import { ModalBase } from "@/components/ui/modal-base";
import { Pagination } from "@/components/ui/pagination-base";

const columns = [
  { uid: "code", name: "Codigo", width: 5 },
  { uid: "name", name: "Nombre", width: 5 },
  { uid: "numero_rumas", name: "Nro. de Rumas", width: 5 },
  { uid: "description", name: "Usuario", width: 15 },
  { uid: "status", name: "Estado", width: 7 },
  { uid: "action", name: "Acciones", width: 5 },
];

const data = [
  {
    code: "TCNO",
    name: "Callao",
    numero_rumas: "7",
    description: "Planta de Homogenizado del Callao ...",
    status: "Activo",
  },
  {
    code: "ABCD",
    name: "Vegueta",
    numero_rumas: "19",
    description: "Planta de Homogenizado del Vegueta ...",
    status: "Inactivo",
  },
  {
    code: "CHIM",
    name: "Chimbote",
    numero_rumas: "15",
    description: "Planta de Homogenizado de Chimbote ...",
    status: "Activo",
  },
  {
    code: "MOTU",
    name: "Motupe",
    numero_rumas: "12",
    description: "Planta de Homogenizado de Motupe ...",
    status: "Activo",
  },
  {
    code: "SUPE",
    name: "Supe",
    numero_rumas: "9",
    description: "Planta de Homogenizado de Supe ...",
    status: "Inactivo",
  },
  {
    code: "SECH",
    name: "Sechura",
    numero_rumas: "20",
    description: "Planta de Homogenizado de Sechura ...",
    status: "Activo",
  },
  {
    code: "PAIT",
    name: "Paita",
    numero_rumas: "11",
    description: "Planta de Homogenizado de Paita ...",
    status: "Activo",
  },
  {
    code: "ILO1",
    name: "Ilo Norte",
    numero_rumas: "6",
    description: "Planta de Homogenizado de Ilo Norte ...",
    status: "Inactivo",
  },
  {
    code: "MOLI",
    name: "Mollendo",
    numero_rumas: "10",
    description: "Planta de Homogenizado de Mollendo ...",
    status: "Activo",
  },
  {
    code: "COIS",
    name: "Coishco",
    numero_rumas: "8",
    description: "Planta de Homogenizado de Coishco ...",
    status: "Activo",
  },
  {
    code: "ATAM",
    name: "Atamal",
    numero_rumas: "5",
    description: "Planta de Homogenizado de Atamal ...",
    status: "Inactivo",
  },
];

export function TablePlanta() {
  const style = useButtonsStyles();

  const [openPanel, setOpenPanel] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [page, setPage] = useState(1);

  const [infoPlanta, setInfoPlanta] = useState<{
    codigo: string;
    nombre: string;
  }>({
    codigo: "",
    nombre: "",
  });

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
              backgroundColor: statusColorMap[item.status] || "#666",
              color: "#fff",
              width: "10rem",
            }}
            size="large"
          >
            {item.status.toUpperCase()}
          </Badge>
        );

      case "action":
        return (
          <div className="flex gap-1 justify-between w-full py-0.5">
            <Tooltip content="Editar Planta" relationship="label">
              <Button
                size="large"
                appearance="subtle"
                onClick={() => setOpenPanel(true)}
                icon={<Edit24Filled style={{ color: OrgColors.azulOscuro }} />}
              />
            </Tooltip>

            <Tooltip content="Eliminar Planta" relationship="label">
              <Button
                size="large"
                appearance="subtle"
                onClick={() => {
                  setInfoPlanta({
                    codigo: item.code,
                    nombre: item.name,
                  });
                  setOpenModal(true);
                }}
                icon={<Delete24Filled style={{ color: OrgColors.rojo }} />}
              />
            </Tooltip>
          </div>
        );

      default:
        return item[columnKey];
    }
  };

  const acctionDeleteModal = () => {};
  return (
    <>
      <Card>
        <CardPreview>
          <div
            className="p-3"
            style={{
              width: "100%",
              height: "45em",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div className="flex justify-between items-center">
              <Title title="Plantas de Homogenizado" />
              <Button
                size="large"
                icon={<Add24Regular></Add24Regular>}
                className={style.buttonVerdeBase}
                onClick={() => setOpenPanel(true)}
              >
                Nuevo
              </Button>
            </div>

            <TableBase
              columns={columns}
              data={data}
              renderCell={renderCell}
              isLoading={false}
              error={null}
              height="80%"
            />
            <Pagination
              currentPage={page}
              totalPages={5}
              onPageChange={setPage}
            />
          </div>
        </CardPreview>
      </Card>

      <PanelCrearPlanta
        isOpen={openPanel}
        setIsOpen={setOpenPanel}
      />

      <ModalBase
        open={openModal}
        setOpen={setOpenModal}
        type="alert"
        buttonText="Eliminar"
        buttonAction={acctionDeleteModal}
      >
        <>
          ¿Esta seguro de eliminar la{" "}
          <span className="font-bold">Planta de Homogenización</span> del{" "}
          <span className="font-bold">{infoPlanta.nombre}</span> con código{" "}
          <span className="font-bold">{infoPlanta.codigo}</span>?
        </>
      </ModalBase>
    </>
  );
}
