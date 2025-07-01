import { useFooterStyles } from "@/styles/footer.styles";
import { obtenerAnioActual } from "@/utils/date";

export function Footer() {
  const styles = useFooterStyles();


  return (
    <>
      <footer
        className={`${styles.footer}`}
      >
        © Blending 2.0 - TASA {obtenerAnioActual()}
      </footer>
    </>
  );
}
