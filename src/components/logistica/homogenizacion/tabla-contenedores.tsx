"use client";
import React, { useEffect, useState } from "react";
import {
  Input,
  Button,
  Tooltip,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
} from "@fluentui/react-components";
import { Add20Regular, Delete20Regular } from "@fluentui/react-icons";
import { OrgColors } from "@/config/app.config.server";
import { ErrorAlertContent } from "@/interface/components/message-alert";
import { RowData, TablaContenedoresProps } from "@/interface";

const TablaContenedores = ({ onChange }: TablaContenedoresProps) => {
  const MIN_SACOS = 480;
  const MAX_SACOS = 630;
  const DEFAULT_CONTENEDORES = 1;
  const DEFAULT_SACOS = 520;

  const [rows, setRows] = useState<RowData[]>([
    {
      contenedores: DEFAULT_CONTENEDORES.toString(),
      sacos: DEFAULT_SACOS.toString(),
    },
  ]);

  const [isErrorTablaContenedores, setIsErrorTablaContenedores] =
    useState<boolean>(false);

  const [
    visibleErrorCantidadContenedores,
    setVisibleErrorCantidadContenedores,
  ] = useState<boolean>(false);

  const [errorCantidaContenedores, setErrorCantidadContenedores] =
    useState<ErrorAlertContent>({
      descripcion: "",
      typeError: "info",
    });

  const [visibleErrorCantidadSacos, setVisibleErrorCantidadSacos] =
    useState<boolean>(false);

  const [errorCantidadSacos, setErrorCantidadSacos] =
    useState<ErrorAlertContent>({
      descripcion: "",
      typeError: "info",
    });

  const updateRow = (index: number, field: keyof RowData, raw: string) => {
    let value = raw;
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setRows(newRows);
    onChange?.(newRows, isErrorTablaContenedores);
  };

  const addRow = () => {
    const newRows = [
      ...rows,
      {
        contenedores: DEFAULT_CONTENEDORES.toString(),
        sacos: DEFAULT_SACOS.toString(),
      },
    ];
    setRows(newRows);
    onChange?.(newRows, isErrorTablaContenedores);
  };

  const removeRow = (index: number) => {
    if (rows.length === 1) return; // deja siempre 1 fila
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
    onChange?.(newRows, isErrorTablaContenedores);
  };


  useEffect(() => {
    setIsErrorTablaContenedores(
      visibleErrorCantidadContenedores || visibleErrorCantidadSacos
    );
  }, [visibleErrorCantidadContenedores, visibleErrorCantidadSacos]);

  useEffect(() => {
    onChange?.(rows, isErrorTablaContenedores);
  }, [isErrorTablaContenedores]);

  useEffect(() => {
    // Estado temporal para errores (solo durante la validación)
    let firstErrorContenedores: ErrorAlertContent | null = null;
    let firstErrorSacos: ErrorAlertContent | null = null;

    for (let i = 0; i < rows.length; i++) {
      const element = rows[i];

      // --- Validación de CONTENEDORES ---
      if (!firstErrorContenedores) {
        if (element.contenedores === "") {
          firstErrorContenedores = {
            descripcion: `En la fila ${
              i + 1
            }, la cantidad de contenedores no puede estar vacía`,
            typeError: "error",
          };
        } else if (element.contenedores === "0") {
          firstErrorContenedores = {
            descripcion: `En la fila ${
              i + 1
            }, la cantidad de contenedores debe ser mayor que 0`,
            typeError: "error",
          };
        }
      }

      // --- Validación de SACOS ---
      if (!firstErrorSacos) {
        if (element.sacos === "") {
          firstErrorSacos = {
            descripcion: `En la fila ${
              i + 1
            }, la cantidad de sacos en contenedores no puede estar vacía`,
            typeError: "error",
          };
        } else if (element.sacos === "0") {
          firstErrorSacos = {
            descripcion: `En la fila ${
              i + 1
            }, la Cantidad de sacos en contenedores debe ser mayor que 0`,
            typeError: "error",
          };
        } else if (Number(element.sacos) > MAX_SACOS) {
          firstErrorSacos = {
            descripcion: `En la fila ${
              i + 1
            }, la Cantidad de sacos en contenedores no debe ser mayor a ${MAX_SACOS}`,
            typeError: "error",
          };
        } else if (Number(element.sacos) < MIN_SACOS) {
          firstErrorSacos = {
            descripcion: `En la fila ${
              i + 1
            }, la Cantidad de sacos en contenedores no debe ser menor a ${MIN_SACOS}`,
            typeError: "error",
          };
        }
      }

      // Si ambos errores ya fueron encontrados, podemos salir antes
      if (firstErrorContenedores && firstErrorSacos) {
        break;
      }
    }

    // --- Seteos de CONTENEDORES ---
    if (firstErrorContenedores) {
      setVisibleErrorCantidadContenedores(true);
      setErrorCantidadContenedores(firstErrorContenedores);
    } else {
      setVisibleErrorCantidadContenedores(false);
      setErrorCantidadContenedores({
        descripcion: "",
        typeError: "info",
      });
    }

    // --- Seteos de SACOS ---
    if (firstErrorSacos) {
      setVisibleErrorCantidadSacos(true);
      setErrorCantidadSacos(firstErrorSacos);
    } else {
      setVisibleErrorCantidadSacos(false);
      setErrorCantidadSacos({
        descripcion: "",
        typeError: "info",
      });
    }
  }, [rows]);

  return (
    <div className="w-full flex flex-col gap-3">
      <div
        style={{
          width: "38rem",
          position: "relative",
          overflow: "visible",
        }}
      >
        <Table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed",
            overflow: "visible",
          }}
        >
          <TableHeader>
            <TableRow style={{ background: OrgColors.verde }}>
              <TableHeaderCell
                style={{
                  border: `1px solid #1E7D22`,
                  fontWeight: 600,
                  textAlign: "center",
                  width: "50%",
                  color: "#fff",
                }}
              >
                <span className="w-full">Cantidad de contenedores</span>
              </TableHeaderCell>
              <TableHeaderCell
                style={{
                  border: `1px solid #1E7D22`,
                  fontWeight: 600,
                  textAlign: "center",
                  width: "50%",
                  color: "#fff",
                }}
              >
                <span className="w-full">
                  Cantidad de sacos en contenedores
                </span>
              </TableHeaderCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((row, i) => {
              const isLast = i === rows.length - 1;
              const isSingle = rows.length === 1;

              return (
                <TableRow key={i} style={{ position: "relative" }}>
                  <TableCell
                    style={{ padding: "0.5rem", border: "1px solid #1E7D22" }}
                  >
                    <Input
                      type="number"
                      value={row.contenedores.toString()}
                      onChange={(_, data) =>
                        updateRow(i, "contenedores", data.value)
                      }
                      style={{
                        width: "100%",
                        border: "none",
                        background: "transparent",
                      }}
                      min={1}
                      onKeyDown={(e) => {
                        if (e.key === "-" || e.key === "e" || e.key === "E") {
                          e.preventDefault(); // bloquea escribir signos y exponentes
                        }
                      }}
                    />
                  </TableCell>

                  <TableCell
                    style={{
                      padding: "0.5rem",
                      border: "1px solid #1E7D22",
                      position: "relative",
                      overflow: "visible",
                    }}
                  >
                    <Input
                      type="number"
                      value={row.sacos.toString()}
                      onChange={(_, data) => updateRow(i, "sacos", data.value)}
                      min={MIN_SACOS}
                      max={MAX_SACOS}
                      style={{
                        width: "100%",
                        border: "none",
                        background: "transparent",
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "-" || e.key === "e" || e.key === "E") {
                          e.preventDefault(); // bloquea escribir signos y exponentes
                        }
                      }}
                    />

                    {/* Botonera flotante (NO es una columna) */}
                    <div
                      style={{
                        position: "absolute",
                        left: "100%", // justo a la derecha de la celda
                        top: "50%",
                        transform: "translate(0, -50%)",
                        marginLeft: "0.5rem",
                        display: "flex",
                        gap: "0.25rem",
                      }}
                    >
                      {/* Regla: si solo hay 1 fila -> solo "+" */}
                      {isSingle ? (
                        <Tooltip content="Agregar fila" relationship="label">
                          <Button
                            appearance="subtle"
                            icon={<Add20Regular />}
                            onClick={addRow}
                          />
                        </Tooltip>
                      ) : (
                        <>
                          {/* En la última fila: "+" y "🗑️" */}
                          {isLast && (
                            <Tooltip
                              content="Agregar fila"
                              relationship="label"
                            >
                              <Button
                                appearance="subtle"
                                icon={<Add20Regular />}
                                onClick={addRow}
                              />
                            </Tooltip>
                          )}

                          {/* En todas las filas (cuando hay > 1): "🗑️" */}
                          <Tooltip content="Eliminar fila" relationship="label">
                            <Button
                              appearance="subtle"
                              icon={
                                <Delete20Regular style={{ color: "#ec5353" }} />
                              }
                              onClick={() => removeRow(i)}
                            />
                          </Tooltip>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {visibleErrorCantidadContenedores && (
        <>
          <MessageBar intent={errorCantidaContenedores.typeError}>
            <MessageBarBody>
              <MessageBarTitle>
                {errorCantidaContenedores.typeError}
              </MessageBarTitle>
              {errorCantidaContenedores.descripcion}
            </MessageBarBody>
          </MessageBar>
        </>
      )}

      {visibleErrorCantidadSacos && (
        <>
          <MessageBar intent={errorCantidadSacos.typeError}>
            <MessageBarBody>
              <MessageBarTitle>{errorCantidadSacos.typeError}</MessageBarTitle>
              {errorCantidadSacos.descripcion}
            </MessageBarBody>
          </MessageBar>
        </>
      )}
    </div>
  );
};

export default TablaContenedores;
