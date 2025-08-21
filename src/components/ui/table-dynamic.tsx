"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHeader,
  TableHeaderCell,
  makeStyles,
  Input,
  Text,
} from "@fluentui/react-components";
import { OrgColors } from "@/config/app.config.server";
import { useEffect, useState } from "react";
import { mergeClasses } from "@fluentui/react-components";

type Calidad = {
  calidad: string;
  [key: string]: string;
};

interface ITableProps {
  calidades: Calidad[];
  title?: string;
  isStickyFirstCol?: boolean;
}

const useStyles = makeStyles({
  container: {
    overflow: "auto",
    maxWidth: "100%",
    maxHeight: "60rem"
  },
  headerCell: {
    backgroundColor: OrgColors.verde,
    color: "white",
    fontWeight: 600,
    border: "1px solid #1E7D22",
    width: "8rem",
    position: "sticky",
    top: 0,
    zIndex: 2, // para que se muestre sobre el resto
  },

  stickyFirstCol: {
    position: "sticky",
    left: 0,
    backgroundColor: OrgColors.verde,
    color: "#fff",
    zIndex: 1,
    boxShadow: "2px 0 0 #1E7D22",
  },

  defaultFirstCol:{
    backgroundColor: OrgColors.verde,
    color:"#fff",
    border: "1px solid #1E7D22",

  },

  defaultDataFirstCol:{
    backgroundColor: "#fff",
    color:"#000",
    border: "1px solid #1E7D22",
  },

  iscolorFirstCol: {},
  stickyFirstHeader: {
    left: 0,
    zIndex: 3, // sobre todo
  },
  bodyCell: {
    border: "1px solid #1E7D22",
  },
  highlight: {
    backgroundColor: "#e0f7e9",
  },
});

interface ITableProps {
  calidades: Calidad[];
  titleFirstCol?: string;
  editable?: boolean;
  onDataChange?: (data: Calidad[]) => void;
  widthFull?: boolean;
  height: string;
  paintRowCol?: boolean;
}

export function TableDynamic({
  calidades,
  titleFirstCol = "defauld",
  editable = false,
  widthFull = false,
  height = "auto",
  isStickyFirstCol = false,
  paintRowCol=false,
  onDataChange,
}: ITableProps) {
  const styles = useStyles();
  const [localData, setLocalData] = useState<Calidad[]>(calidades);
  const [activeCell, setActiveCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  useEffect(() => {
    setLocalData(calidades);
  }, [calidades]);

  const handleChange = (rowIndex: number, key: string, value: string) => {
    const updated = [...localData];
    updated[rowIndex] = { ...updated[rowIndex], [key]: value };
    setLocalData(updated);
    onDataChange?.(updated);
  };

  if (!localData || localData.length === 0) {
    return (
      <div className={styles.container} style={{ height }}>
        <Table style={{ minWidth: widthFull ? "100%" : "20rem", width: "fit-content" }}>
          <TableBody>
            <TableRow>
              <TableCell>
                <Text align="center" size={300}>
                  No hay datos que mostrar
                </Text>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  const first = localData[0];
  const paramKeys = Object.keys(first).filter((k) => k !== "calidad");

  const renderContent = () => {
    return localData.map((row, i) => (
      <TableRow key={i}>
        <TableCell
          className={mergeClasses(isStickyFirstCol ? styles.stickyFirstCol : styles.defaultDataFirstCol)}
        >
          <span>{row.calidad}</span>
        </TableCell>

        {paramKeys.map((param, colIndex) => {
          const isRowMatch =
            activeCell && i === activeCell.row && colIndex <= activeCell.col;
          const isColMatch =
            activeCell && colIndex === activeCell.col && i <= activeCell.row;

          const isHighlighted = editable && paintRowCol && (isRowMatch || isColMatch);

          return (
            <TableCell
              key={param}
              className={mergeClasses(
                styles.bodyCell,
                isHighlighted ? styles.highlight : undefined
              )}
            >
              {editable ? (
                <Input
                  type="text"
                  value={row[param] || ""}
                  onFocus={() => setActiveCell({ row: i, col: colIndex })}
                  onBlur={() => setActiveCell(null)}
                  onChange={(e) => handleChange(i, param, e.target.value)}
                  style={{
                    width: "100%",
                    border: "none",
                    background: "transparent",
                    textAlign: "center",
                  }}
                />
              ) : (
                row[param] ?? "-"
              )}
            </TableCell>
          );
        })}
      </TableRow>
    ));
  };

  return (
    <div className={styles.container} style={{ height }}>
      <Table
        style={{ minWidth: widthFull ? "100%" : "20rem", width: "fit-content" }}
      >
        <TableHeader>
          <TableRow>
            <TableHeaderCell
              className={mergeClasses(
                styles.headerCell,
                isStickyFirstCol
                  ? styles.stickyFirstCol && styles.stickyFirstHeader
                  : styles.defaultFirstCol
              )}
            >
              <span className="text-center w-full uppercase"> {titleFirstCol}</span>
            </TableHeaderCell>
            {paramKeys.map((param) => (
              <TableHeaderCell key={param} className={styles.headerCell}>
                <span className="w-full text-center">{param}</span>
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>{renderContent()}</TableBody>
      </Table>
    </div>
  );
}
