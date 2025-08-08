"use client";

import { OtrosParametros, ParametrosLogisticos, Title } from "@/components";
import { FileUploadButton } from "@/components/ui/file-upload-button";
import { OrgColors } from "@/config/app.config.server";
import { useAsyncAction } from "@/hooks/use-async-action";
import { BaseResponse } from "@/interface";
import { ExcelService } from "@/services/excel.service";
import { useButtonsStyles } from "@/styles/button.styles";
import { hexToRgba } from "@/utils/colors";
import { Button, Card, Divider } from "@fluentui/react-components";
import { DocumentAdd24Filled } from "@fluentui/react-icons";
import { useState } from "react";

export default function ContenedoresPage() {
  const style = useButtonsStyles();
  const asyncAction = useAsyncAction();

   const [loadingFile, setLoadingFile] = useState<boolean>(false);

  const [responseCargarExcel, setResponseCargarExcel] = useState<{
    error: string;
    success: BaseResponse<any> | null;
  }>({
    error: "",
    success: null,
  });

  const handleUploadFile = async (file: File) => {
    asyncAction.reset();
    setResponseCargarExcel({
      error: "",
      success: null,
    });
    const allowedExtensions = /\.(xls|xlsx|csv)$/i;
    if (!allowedExtensions.test(file.name)) {
      setResponseCargarExcel({
        error: "Formato no permitido. Solo se aceptan .xls y .xlsx",
        success: null,
      });
      return;
    }
    await asyncAction.execute(
      () => ExcelService.uploadExcelLogistica(file),
      undefined,
      setResponseCargarExcel
    );
  };

  return (
    <>
      <div className=" flex flex-col gap-4  w-full h-full pb-2 overflow-y-auto">
        <div>
          <Card style={{ width: "100%" }}>
            <div className="">
              <div className="flex flex-col gap-4">
                <div>
                  <Title title="Asignación" />
                </div>

                <FileUploadButton
                  accept=".xls,.xlsx"
                  label="Adjuntar Asignación"
                  onFileSelected={async (file) => {
                    setLoadingFile(true);
                    await handleUploadFile(file);
                    setLoadingFile(false);
                  }}
                  icon={true}
                  loading={loadingFile}
                />

                <Divider
                  style={{
                    height: "0.2rem",
                    backgroundColor: "#ccc",
                  }}
                ></Divider>

                <div className="flex gap-4">
                  <span className="font-semibold">
                    Contrato: HPE-24 0160 G2
                  </span>
                  <span className="font-semibold">Cantidad de Sacos: 9860</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <ParametrosLogisticos></ParametrosLogisticos>
        <OtrosParametros></OtrosParametros>

        <div className="flex gap-4 w-full">
          <div
            className="w-2/3 rounded-xl p-3 text-md flex items-center "
            style={{
              backgroundColor: hexToRgba(OrgColors.celeste, 0.3),
              color: OrgColors.azulOscuro,
            }}
          >
            <div>
              Se está ejecutando el modelo, esto puede demorar algunos minutos.
              Puede consultar el estado <br /> de la ejecución, con el código:{" "}
              <span className="font-semibold">DISLOG000123</span>
            </div>
          </div>

          <div className="w-1/3 flex flex-col gap-2 items-end justify-end">
            <Button
              size="large"
              className={`w-[13rem] ${style.buttonAzulOscuroBase}`}
            >
              Correr modelo
            </Button>
            <Button
              size="large"
              className={`w-[13rem] ${style.buttonVerdeBase}`}
            >
              Descargar reporte
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
