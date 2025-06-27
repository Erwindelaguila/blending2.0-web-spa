import { OrgColors } from "@/config/app.config.server";
import { makeStyles } from "@fluentui/react-components";

export const useInputStyles = makeStyles({
  inputGrisBase: {
    width: "100%",
    border: ` 2px solid ${OrgColors.serotGris}`,
  },
});
