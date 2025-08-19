"use Client";

import { OrgColors } from "@/config/app.config.server";
import { makeStyles } from "@fluentui/react-components";

export const useTableDynamicStyles = makeStyles({
  container: {
    overflow: "auto",
    maxWidth: "100%",
    maxHeight: "60rem",
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

  defaultFirstCol: {
    backgroundColor: OrgColors.verde,
    color: "#fff",
    border: "1px solid #1E7D22",
  },

  defaultDataFirstCol: {
    backgroundColor: "#fff",
    color: "#000",
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
  boldFirstCol: {
    fontWeight: "bold !important",
    color: "black !important",
  },
  redHighlight: {
    backgroundColor: "#ffd6d6", // rojo claro
  },
  whiteHighlight: {
    backgroundColor: "#ffd6d6", // rojo claro
  },

  
});
