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
import { useButtonsStyles } from "@/styles/button.styles";
import { ModalBase } from "@/components/ui/modal-base";
import { Pagination } from "@/components/ui/pagination-base";
import { PanelCrearCalidad } from "./panel-crear-calidad";

const columns = [
  { uid: "code", name: "Codigo", width: 5 },
  { uid: "name", name: "Nombre", width: 5 },
  { uid: "description", name: "Descripción", width: 10 },
  { uid: "codigo_material", name: "Código de Material", width: 5 },
  { uid: "status", name: "Estado", width: 7 },
  { uid: "action", name: "Acciones", width: 5 },
];

const data = [
  {
    code: "CALIDAD01",
    name: "Calidad 01",
    description: "Descripción de la calidad 01",
    codigo_material: "MAT001",
    status: "Activo",
  },
  {
    code: "CALIDAD02",
    name: "Calidad 02",
    description: "Descripción de la calidad 02",
    codigo_material: "MAT002",
    status: "Inactivo",
  },
  {
    code: "CALIDAD03",
    name: "Calidad 03",
    description: "Descripción de la calidad 03",
    codigo_material: "MAT003",
    status: "Activo",
  },
  {
    code: "CALIDAD04",
    name: "Calidad 04",
    description: "Descripción de la calidad 04",
    codigo_material: "MAT004",
    status: "Activo",
  },
  {
    code: "CALIDAD05",
    name: "Calidad 05",
    description: "Descripción de la calidad 05",
    codigo_material: "MAT005",
    status: "Inactivo",
  },
  {
    code: "CALIDAD06",
    name: "Calidad 06",
    description: "Descripción de la calidad 06",
    codigo_material: "MAT006",
    status: "Activo",
  },
  {
    code: "CALIDAD07",
    name: "Calidad 07",
    description: "Descripción de la calidad 07",
    codigo_material: "MAT007",
    status: "Inactivo",
  },
  {
    code: "CALIDAD08",
    name: "Calidad 08",
    description: "Descripción de la calidad 08",
    codigo_material: "MAT008",
    status: "Activo",
  },
  {
    code: "CALIDAD09",
    name: "Calidad 09",
    description: "Descripción de la calidad 09",
    codigo_material: "MAT009",
    status: "Activo",
  },
  {
    code: "CALIDAD10",
    name: "Calidad 10",
    description: "Descripción de la calidad 10",
    codigo_material: "MAT010",
    status: "Inactivo",
  },
  {
    code: "CALIDAD11",
    name: "Calidad 11",
    description: "Descripción de la calidad 11",
    codigo_material: "MAT011",
    status: "Activo",
  },
];

export function TableCalidades() {
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
              <Title title="Calidades"></Title>
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

      <PanelCrearCalidad
        isOpen={openPanel}
        setIsOpen={setOpenPanel}
      ></PanelCrearCalidad>

      <ModalBase
        open={openModal}
        setOpen={setOpenModal}
        type="alert"
        buttonText="Eliminar"
        buttonAction={acctionDeleteModal}
      >
        <>
          ¿Esta seguro de eliminar la{" "}
          <span className="font-bold">{infoPlanta.nombre}</span> del con código{" "}
          <span className="font-bold">{infoPlanta.codigo}</span>?
        </>
      </ModalBase>
    </>
  );
}
