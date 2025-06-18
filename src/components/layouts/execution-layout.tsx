import { useState } from "react";
import {
  Card,
  CardPreview,
  makeStyles,
  Text,
  mergeClasses,
} from "@fluentui/react-components";
import { OrgColors } from "@/config/app.config.server";
import {
  DocumentTextRegular,
  ArrowRepeatAllRegular,
  BoxRegular,
  ClipboardTextLtrRegular,
} from "@fluentui/react-icons";
import type { ReactNode } from "react";
import { QualityParametersLayout } from "./quality-parameters-layout";
import { CustomProductLayout } from "./custom-product-layout"; // ✅ AGREGAR: Import del custom

// Opciones de tarjetas con íconos
const CARD_OPTIONS: { label: string; icon: ReactNode }[] = [
  { label: "Homogenizado", icon: <DocumentTextRegular fontSize={28} /> },
  { label: "Reproceso", icon: <ArrowRepeatAllRegular fontSize={28} /> },
  { label: "Producto a medida", icon: <BoxRegular fontSize={28} /> },
  {
    label: "Consumir parametros",
    icon: <ClipboardTextLtrRegular fontSize={28} />,
  },
];

// Estilos
const useStyles = makeStyles({
  container: {
    margin: "auto",
    width: "100%",
    maxWidth: "100%",
  },
  cardBase: {
    width: "18rem",
    color: "#000",
    fontSize: "1rem",
    backgroundColor: "#f8f9fa",
    border: "0.1rem solid #eee",
    borderTop: "0.7rem solid #808080",
    cursor: "pointer",
    textAlign: "center",
    padding: "1rem",
    transition: "all 0.2s ease-in-out",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",

    ":hover": {
      backgroundColor: "#f0f8ff",
      borderTopColor: OrgColors.serotAzul,
    },
  },
  selected: {
    backgroundColor: "#cce5ff",
    borderTopColor: OrgColors.serotAzul,
  },

  cardFiltros: {
    margin: "auto",
    width: "100%",
    maxWidth: "100%",
    height: "31rem",
    overflowY: "auto",
    //paddingTop: "1.5rem",
    //paddingBottom: "1.5rem",
  },
});

// Componente principal
export function ExecutionLayout() {
  const styles = useStyles();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleSelect = (label: string) => {
    setSelectedType(label);
  };

  return (
    <div className="px-2 m-auto flex flex-col gap-6">
      <Card className={styles.container}>
        <CardPreview>
          <div className="px-6 pt-2">
            <Text size={400} weight="medium">
              Tipo de Homogenizado
            </Text>
            <div className="py-6 px-8 flex flex-wrap gap-4 justify-between">
              {CARD_OPTIONS.map(({ label, icon }) => (
                <Card
                  key={label}
                  size="large"
                  className={mergeClasses(
                    styles.cardBase,
                    selectedType === label && styles.selected
                  )}
                  onClick={() => handleSelect(label)}
                >
                  <div className="flex items-center gap-2">
                    {icon}
                    <Text>{label}</Text>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </CardPreview>
      </Card>

      <Card className={styles.cardFiltros}>
        <CardPreview>
          {/* ✅ CAMBIAR: Mostrar CustomProductLayout solo si se selecciona "Producto a medida" */}
          {selectedType === "Producto a medida" ? (
            <CustomProductLayout />
          ) : (
            <QualityParametersLayout />
          )}
        </CardPreview>
      </Card>
    </div>
  );
}
