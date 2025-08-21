import React, { useState, useMemo, useCallback } from "react";
import { Card, CardPreview, Spinner, Button, Input } from "@fluentui/react-components";
import { Save24Regular, Dismiss24Regular } from "@fluentui/react-icons";
import useSWR, { mutate } from "swr";
import { CalidadParametrosService } from "@/services/calidad-parametros.service";
import { IMatrizCalidadParametros, ICalidadParametroUpsertRequest } from "@/interface/admin/calidad-parametros";
import { useAsyncAction } from "@/hooks/use-async-action";
import { AsyncActionDisplay } from "@/components/ui/async-action-display";
import { useButtonsStyles } from "@/styles/button.styles";
import { OrgColors } from "@/config/app.config.server";

export function MatrizCalidadParametros() {
  const buttonStyles = useButtonsStyles();
  const asyncAction = useAsyncAction();
  
  const [editingCell, setEditingCell] = useState<{ calidadId: string; parametroId: string } | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const { data: matrizData, isLoading, error } = useSWR(
    "matriz-calidad-parametros",
    () => CalidadParametrosService.obtenerMatriz()
  );

  const matriz = matrizData?.data;

  const handleCellClick = useCallback((calidadId: string, parametroId: string, currentValue: number) => {
    setEditingCell({ calidadId, parametroId });
    setEditValue(currentValue.toString());
  }, []);

  const handleSaveCell = useCallback(async () => {
    if (!editingCell) return;
    
    const valor = parseFloat(editValue);
    if (isNaN(valor)) {
      // Podríamos mostrar un error aquí
      return;
    }

    const payload: ICalidadParametroUpsertRequest = {
      calidadId: editingCell.calidadId,
      parametroId: editingCell.parametroId,
      valor,
    };

    await asyncAction.execute(async () => {
      const result = await CalidadParametrosService.upsertValor(payload);
      // Refrescar la matriz después de guardar
      mutate("matriz-calidad-parametros");
      setEditingCell(null);
      setEditValue("");
      return result;
    });
  }, [editingCell, editValue, asyncAction]);

  const handleCancelEdit = useCallback(() => {
    setEditingCell(null);
    setEditValue("");
  }, []);

  const renderCell = useCallback((calidadId: string, parametroId: string, parametroCodigo: string, calidad: any) => {
    const valorInfo = calidad.valores[parametroCodigo];
    const isEditing = editingCell?.calidadId === calidadId && editingCell?.parametroId === parametroId;
    
    if (isEditing) {
      return (
        <div className="flex items-center gap-2 p-2">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            size="small"
            style={{ width: "80px" }}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveCell();
              if (e.key === "Escape") handleCancelEdit();
            }}
          />
          <Button
            appearance="subtle"
            icon={<Save24Regular />}
            size="small"
            onClick={handleSaveCell}
          />
          <Button
            appearance="subtle"
            icon={<Dismiss24Regular />}
            size="small"
            onClick={handleCancelEdit}
          />
        </div>
      );
    }

    const cellStyle = {
      padding: "8px",
      textAlign: "center" as const,
      cursor: "pointer",
      backgroundColor: valorInfo?.esDefault ? "#f8f9fa" : "#fff",
      color: valorInfo?.esDefault ? "#6c757d" : "#000",
      fontStyle: valorInfo?.esDefault ? "italic" : "normal",
      borderBottom: "1px solid #dee2e6",
      borderRight: "1px solid #dee2e6",
    };

    return (
      <div
        style={cellStyle}
        onClick={() => handleCellClick(calidadId, parametroId, valorInfo?.valor ?? 0)}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#e9ecef";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = valorInfo?.esDefault ? "#f8f9fa" : "#fff";
        }}
      >
        {valorInfo?.valor ?? 0}
      </div>
    );
  }, [editingCell, editValue, handleCellClick, handleSaveCell, handleCancelEdit]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner labelPosition="below" label="Cargando matriz de calidad-parámetros..." />
      </div>
    );
  }

  if (error || !matriz) {
    return (
      <div className="py-8 text-center text-red-500">
        Error al cargar la matriz de calidad-parámetros
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardPreview>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Matriz Calidad - Parámetros
            </h2>
            <div className="text-sm text-gray-600">
              <span className="italic">Valores en gris son por defecto (0)</span>
            </div>
          </div>

          {asyncAction.isError && (
            <div className="mb-4">
              <AsyncActionDisplay
                state={asyncAction.state}
                loadingMessage=""
                successMessage=""
                error={asyncAction.error}
                onErrorDismiss={() => asyncAction.resetError()}
              />
            </div>
          )}

          <div className="overflow-auto border border-gray-300 rounded">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th
                    style={{
                      position: "sticky",
                      left: 0,
                      backgroundColor: OrgColors.serotGris,
                      color: "white",
                      padding: "12px",
                      textAlign: "center",
                      borderRight: "2px solid #dee2e6",
                      borderBottom: "2px solid #dee2e6",
                      zIndex: 10,
                    }}
                  >
                    Calidad / Parámetro
                  </th>
                  {matriz.parametros.map((param) => (
                    <th
                      key={param.id}
                      style={{
                        backgroundColor: OrgColors.serotGris,
                        color: "white",
                        padding: "12px",
                        textAlign: "center",
                        borderRight: "1px solid #dee2e6",
                        borderBottom: "2px solid #dee2e6",
                        minWidth: "120px",
                      }}
                    >
                      {param.codigo}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matriz.calidades.map((calidad) => (
                  <tr key={calidad.id}>
                    <td
                      style={{
                        position: "sticky",
                        left: 0,
                        backgroundColor: "#f8f9fa",
                        fontWeight: "600",
                        padding: "12px",
                        borderRight: "2px solid #dee2e6",
                        borderBottom: "1px solid #dee2e6",
                        zIndex: 5,
                      }}
                    >
                      {calidad.codigo}
                    </td>
                    {matriz.parametros.map((param) => (
                      <td key={param.id} style={{ padding: 0 }}>
                        {renderCell(calidad.id, param.id, param.codigo, calidad)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p>• Haz clic en cualquier celda para editarla</p>
            <p>• Presiona Enter para guardar o Esc para cancelar</p>
            <p>• Los valores en gris e itálica son valores por defecto</p>
          </div>
        </div>
      </CardPreview>
    </Card>
  );
}
