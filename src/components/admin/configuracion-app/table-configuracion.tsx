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
  PresenceBlocked20Regular,
} from "@fluentui/react-icons";
import { useState } from "react";
import { useButtonsStyles } from "@/styles/button.styles";
import { ModalBase } from "@/components/ui/modal-base";
import { Pagination } from "@/components/ui/pagination-base";
import { PanelCrearConfiguracionApp } from "./panel-crear-conguracion";

const columns = [
  { uid: "code", name: "Codigo", width: 10},
  { uid: "name", name: "Nombre", width: 10 },
  { uid: "valores", name: "Valores", width: 20 },
  { uid: "status", name: "Estado", width: 6 },
  { uid: "action", name: "Acciones", width: 5 },
];

const data = [
  {
    code: "SYSPARAM-01",
    name: "Parámetro del Sistema 01",
    valores: "PH,10,11,13,16,17,18,19,20",
    status: "Activo",
  },
  {
    code: "SYSPARAM-02",
    name: "Parámetro del Sistema 02",
    valores: "TEMP,22,23,25,30",
    status: "Inactivo",
  },
  {
    code: "SYSPARAM-03",
    name: "Parámetro del Sistema 03",
    valores: "OXIGENO,5.1,5.3,5.7,6.0",
    status: "Activo",
  },
  {
    code: "SYSPARAM-04",
    name: "Parámetro del Sistema 04",
    valores: "NITRATO,0.1,0.2,0.3,0.4",
    status: "Activo",
  },
  {
    code: "SYSPARAM-05",
    name: "Parámetro del Sistema 05",
    valores: "SALINIDAD,30,31,32,33,34,35",
    status: "Inactivo",
  },
  {
    code: "SYSPARAM-06",
    name: "Parámetro del Sistema 06",
    valores: "AMONIO,1.2,1.3,1.5",
    status: "Activo",
  },
  {
    code: "SYSPARAM-07",
    name: "Parámetro del Sistema 07",
    valores: "CONDUCTIVIDAD,0.8,0.9,1.0",
    status: "Activo",
  },
  {
    code: "SYSPARAM-08",
    name: "Parámetro del Sistema 08",
    valores: "PRESION,980,990,1000,1010",
    status: "Activo",
  },
  {
    code: "SYSPARAM-09",
    name: "Parámetro del Sistema 09",
    valores: "TURBIDEZ,2,4,6,8,10",
    status: "Inactivo",
  },
  {
    code: "SYSPARAM-10",
    name: "Parámetro del Sistema 10",
    valores: "COLOR,rojo,verde,azul,amarillo",
    status: "Activo",
  },
  {
    code: "SYSPARAM-11",
    name: "Parámetro del Sistema 11",
    valores: "DENSIDAD,1.01,1.02,1.03",
    status: "Activo",
  },
];

export function TableConfiguracionApp() {
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
              width: "100%",
            }}
            size="large"
          >
            {item.status.toUpperCase()}
          </Badge>
        );

      case "action":
        return (
          <div className="flex gap-1 justify-center w-full py-0.5">
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
                icon={
                  <PresenceBlocked20Regular style={{ color: OrgColors.rojo }} />
                }
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
                data={data}
                renderCell={renderCell}
                isLoading={false}
                error={null}
                height="100%"
              />
            </div>
          </div>

          <div className="w-full h-1/10">
            <Pagination
              totalItems={180}
              currentPage={page}
              totalPages={5}
              onPageChange={setPage}
            />
          </div>
        </div>
      </Card>

      <PanelCrearConfiguracionApp
        isOpen={openPanel}
        setIsOpen={setOpenPanel}
        drawerType="alert"
      ></PanelCrearConfiguracionApp>

      <ModalBase
        open={openModal}
        setOpen={setOpenModal}
        type="alert"
        buttonText="Eliminar"
        buttonAction={acctionDeleteModal}
      >
        <>
          ¿Esta seguro de inactivar el{" "}
          <span className="font-bold">{infoPlanta.nombre}</span> con código{" "}
          <span className="font-bold">{infoPlanta.codigo}</span>?
        </>
      </ModalBase>
    </>
  );
}
