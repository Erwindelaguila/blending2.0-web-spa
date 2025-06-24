"use client";

import { TableBase } from "@/components/ui/table-base";
import { Title } from "@/components/ui/title";
import { OrgColors } from "@/config/app.config.server";
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
import { useButtonsStyles } from "@/styles/button.styles";
import { ModalBase } from "@/components/ui/modal-base";
import { Pagination } from "@/components/ui/pagination-base";
import { PanelCrearParamentros } from "./panel-crear-parametros";

const columns = [
  { uid: "code", name: "Codigo", width: 5 },
  { uid: "name", name: "Nombre", width: 5 },
  { uid: "description", name: "Descripción", width: 15 },
  { uid: "status", name: "Estado", width: 7 },
  { uid: "action", name: "Acciones", width: 5 },
];

const data = [
  {
    code: "PARAMETRO01",
    name: "Parámetro 01",
    description: "Descripción del parámetro 01",
    status: "Activo",
  },
  {
    code: "PARAMETRO02",
    name: "Parámetro 02",
    description: "Descripción del parámetro 02",
    status: "Inactivo",
  },
  {
    code: "PARAMETRO03",
    name: "Parámetro 03",
    description: "Descripción del parámetro 03",
    status: "Activo",
  },
  {
    code: "PARAMETRO04",
    name: "Parámetro 04",
    description: "Descripción del parámetro 04",
    status: "Activo",
  },
  {
    code: "PARAMETRO05",
    name: "Parámetro 05",
    description: "Descripción del parámetro 05",
    status: "Inactivo",
  },
  {
    code: "PARAMETRO06",
    name: "Parámetro 06",
    description: "Descripción del parámetro 06",
    status: "Activo",
  },
  {
    code: "PARAMETRO07",
    name: "Parámetro 07",
    description: "Descripción del parámetro 07",
    status: "Activo",
  },
  {
    code: "PARAMETRO08",
    name: "Parámetro 08",
    description: "Descripción del parámetro 08",
    status: "Inactivo",
  },
  {
    code: "PARAMETRO09",
    name: "Parámetro 09",
    description: "Descripción del parámetro 09",
    status: "Activo",
  },
  {
    code: "PARAMETRO10",
    name: "Parámetro 10",
    description: "Descripción del parámetro 10",
    status: "Activo",
  },
  {
    code: "PARAMETRO11",
    name: "Parámetro 11",
    description: "Descripción del parámetro 11",
    status: "Inactivo",
  },
];

export function TableParametros() {
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
              <Title title="Parámetros de Calidad"></Title>
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

      <PanelCrearParamentros
        isOpen={openPanel}
        setIsOpen={setOpenPanel}
      ></PanelCrearParamentros>

      <ModalBase
        open={openModal}
        setOpen={setOpenModal}
        type="alert"
        buttonText="Eliminar"
        buttonAction={acctionDeleteModal}
      >
        <>
          ¿Esta seguro de eliminar el{" "}
          <span className="font-bold">{infoPlanta.nombre}</span> del con código{" "}
          <span className="font-bold">{infoPlanta.codigo}</span>?
        </>
      </ModalBase>
    </>
  );
}
