import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  TableCellLayout,
  Spinner,
  Text,
} from "@fluentui/react-components";
import { makeStyles, shorthands } from "@fluentui/react-components";
import { OrgColors } from "@/config/app.config.server";
import { ITableBase } from "@/interface";

const useStyles = makeStyles({
  container: {
    ...shorthands.overflow("auto"),
    height: "38rem",
    borderRadius: "0.2rem",
  },
  noBorder: {
    border: "none",
    padding: "0",
  },
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

type Data = { [key: string]: any };

export function TableBase({
  data,
  columns,
  renderCell,
  isLoading,
  error,
  height = "38rem",
}: ITableBase) {
  const styles = useStyles();

  const defaultRenderCell = (item: Data, columnKey: string) =>
    item[columnKey as keyof Data];

  const renderContent = () => {
    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className={styles.bodyCell}>
            <Text align="center" size={300}>
              {error.message}
            </Text>
          </TableCell>
        </TableRow>
      );
    }

    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className={styles.bodyCell}>
            <div style={{ textAlign: "center" }}>
              <Spinner size="tiny" />
              <Text size={200} block>
                Cargando datos...
              </Text>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (data.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className={styles.bodyCell}>
            <Text align="center" size={300}>
              No hay datos que mostrar
            </Text>
          </TableCell>
        </TableRow>
      );
    }

    return data.map((item) => (
      <TableRow key={item.id}>
        {columns.map((column) => (
          <TableCell
            key={`${item.id}-${column.uid}`}
            className={styles.bodyCell}
          >
            <TableCellLayout>
              {renderCell
                ? renderCell(item, column.uid)
                : defaultRenderCell(item, column.uid)}
            </TableCellLayout>
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <div className={styles.container} style={{ height }}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHeaderCell
                key={column.uid}
                className={styles.headerCell}
                style={{ width: column.width ? `${column.width}%` : "auto" }}
              >
                {column.name}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>{renderContent()}</TableBody>
      </Table>
    </div>
  );
}
