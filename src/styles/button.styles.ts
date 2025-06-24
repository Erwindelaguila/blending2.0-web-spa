import { OrgColors } from "@/config/app.config.server";
import { hexToRgba } from "@/utils/colors";
import { makeStyles } from "@fluentui/react-components";

const baseButtonStyle = {
  width: "13rem",
  color: "white",
  fontSize: "1rem",
};

const baseShortButtonStyle = {
  width: "9rem",
  color: "white",
  fontSize: "1rem",
};

export const useButtonsStyles = makeStyles({
  buttonVerdeBase: {
    ...baseButtonStyle,
    backgroundColor: OrgColors.verde,
    ":hover": {
      backgroundColor: hexToRgba(OrgColors.verde, 0.8),
      color: "#fff",
    },
  },
  buttonAzulOscuroBase: {
    ...baseButtonStyle,
    backgroundColor: OrgColors.azulOscuro,
    ":hover": {
      backgroundColor: hexToRgba(OrgColors.azulOscuro, 0.8),
      color: "#fff",
    },
  },

  buttonGrisBase: {
    ...baseButtonStyle,
    backgroundColor: OrgColors.gris,
    ":hover": {
      backgroundColor: hexToRgba(OrgColors.gris, 0.8),
      color: "#fff",
    },
  },

  buttonCelesteBase: {
    ...baseButtonStyle,
    backgroundColor: OrgColors.celeste,
    ":hover": {
      backgroundColor: hexToRgba(OrgColors.celeste, 0.8),
      color: "#fff",
    },
  },

  buttonShortRojoBase: {
    ...baseShortButtonStyle,
    backgroundColor: OrgColors.rojo,
    ":hover": {
      backgroundColor: hexToRgba(OrgColors.rojo, 0.8),
      color: "#fff",
    },
  },
});
