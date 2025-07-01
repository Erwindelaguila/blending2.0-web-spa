import { OrgColors } from "@/config/app.config.server";
import { makeStyles } from "@fluentui/react-components";

export const useCardGroupsStyle = makeStyles({
  cardBase: {
    padding: "1rem",
    width: "100%",
    height: "8rem",
    borderRadius: "0rem",
    border: "0.1rem solid #eee",
    borderLeft: "0.7rem solid #808080",
    boxShadow: "none",
  },

  cardHoverable: {
    ":hover": {
      backgroundColor: "#efefef",
    },
  },
  
  selectCardGrupo: {
    backgroundColor: "#fdfff8",
    borderLeftColor: OrgColors.verde,
    boxShadow: "0 3.2px 7.2px rgba(0,0,0,0.16), 0 0.7px 2.1px rgba(0,0,0,0.14)",
  },
  divider: {
    width: "0.2rem",
    backgroundColor: "#ccc",
  },
  dividerHorizontal: {
    height: "0.1rem",
    backgroundColor: "#ccc",
  },
});