import { OrgColors } from "@/config/app.config.server";
import { hexToRgba } from "@/utils/colors";
import { makeStyles } from "@fluentui/react-components";

const baseButtonStyle = {
  color: "white",
  fontSize: "1rem",
  border: "none",
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

  buttonBase: {
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

  buttonDisabled: {
    backgroundColor: "#f0f0f0",
    color: "#666",
    cursor: "not-allowed",
    opacity: 0.6,
    pointerEvents: "none",
  },
});
