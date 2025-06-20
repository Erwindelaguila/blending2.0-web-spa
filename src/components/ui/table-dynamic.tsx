import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHeader,
  TableHeaderCell,
  makeStyles,
} from "@fluentui/react-components";
import { OrgColors } from "@/config/app.config.server";

type Calidad = {
  calidad: string;
  [key: string]: string;
};

interface ITableProps {
  calidades: Calidad[];
  title?: string;
}

const useStyles = makeStyles({
  headerCell: {
    backgroundColor: OrgColors.verde,
    color: "white",
    fontWeight: 600,
    border: "1px solid #1E7D22",
  },
  bodyCell: {
    border: "1px solid #1E7D22",
  },
  cellCentered: {
    textAlign: "center",
  },
});

export function TableDynamic({ calidades, title }: ITableProps) {
  const styles = useStyles();

  if (!calidades || calidades.length === 0) {
    return <p>No hay datos de calidades disponibles.</p>;
  }

  // Respetar el orden original de los parámetros
  const first = calidades[0];
  const paramKeys = Object.keys(first).filter((k) => k !== "calidad");

  const renderContent = () => {
    return calidades.map((row, i) => (
      <TableRow key={i}>
        <TableCell className={styles.bodyCell}>{row.calidad}</TableCell>
        {paramKeys.map((param) => (
          <TableCell key={param} className={styles.bodyCell}>
            {row[param] !== undefined ? row[param] : "-"}
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <div
      style={{
        overflowX: "auto",
        maxWidth: "100%",
      }}
    >
      {/*title && (
        <h3 className="text-base font-semibold mb-2 border-b pb-1">{title}</h3>
      )*/}
      <Table style={{ minWidth: "600px", width: "fit-content" }}>
        <TableHeader>
          <TableRow>
            <TableHeaderCell className={styles.headerCell}>
              CALIDAD
            </TableHeaderCell>
            {paramKeys.map((param) => (
              <TableHeaderCell key={param} className={styles.headerCell}>
                {param}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>{renderContent()}</TableBody>
      </Table>
    </div>
  );
}
