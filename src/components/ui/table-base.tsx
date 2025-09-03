import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Spinner,
  Text,
} from "@fluentui/react-components";
import { ITableBase } from "@/interface";
import { useTableBaseStyles } from "@/styles/table.styles";

type Data = { [key: string]: any };

export function TableBase({
  data,
  columns,
  renderCell,
  isLoading,
  error,
  height = "auto",
  width = "100%",
}: ITableBase) {
  const styles = useTableBaseStyles();

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
              <Spinner
                size="medium"
                labelPosition="after"
                label="Cargando datos ..."
              />
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

    return data?.map((item, idx) => (
      <TableRow key={item.id ?? idx}>
        {columns.map((column) => (
          <TableCell
            key={`${item.id ?? idx}-${column.uid}`}
            className={styles.bodyCell}
            style={{ width: column.width ? `${column.width}%` : "auto" }}
          >
            <div className="w-full h-full flex items-center">
              {renderCell
                ? renderCell(item, column.uid)
                : defaultRenderCell(item, column.uid)}
            </div>
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <div className={styles.container} style={{ height, width }}>
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
