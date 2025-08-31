import { OrgColors } from "@/config/app.config.server";
import { makeStyles } from "@fluentui/react-components";

export const useInputStyles = makeStyles({
  inputGrisBase: {
    width: "100%",
    border: ` 2px solid ${OrgColors.serotGris}`,
  },
  textareaGrisBase: {
    width: "100%",
    border: `2px solid ${OrgColors.serotGris}`,
    resize: 'none',
    overflowY: 'auto',
    minHeight: '4.5rem', // ~3 líneas
    lineHeight: '1.4rem',
    boxSizing: 'border-box',
  },
});
