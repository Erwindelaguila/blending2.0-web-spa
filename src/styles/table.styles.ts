import { OrgColors } from "@/config/app.config.server";
import { makeStyles } from "@fluentui/react-components";

export const useTableBaseStyles = makeStyles({
  container: {
    overflow: "auto",
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