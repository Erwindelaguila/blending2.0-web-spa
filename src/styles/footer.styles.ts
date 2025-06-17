import { OrgColors } from "@/config/app.config.server";
import { makeStyles } from "@fluentui/react-components";

export const useFooterStyles = makeStyles({
    footer: {
        color: OrgColors.grisTexto, // grisTexto
        width: "100%",
        backgroundColor: OrgColors.blanco, // blanco
        textAlign: "center",
        paddingBottom: "0.5rem", // 8px
        paddingTop: "0.5rem", // 8px
        fontWeight: "600", // semi-bold
        fontSize: "0.875rem", // 14px 
        borderTop: "1px solid #e2e8f0",
    }
})