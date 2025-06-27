"use client";

import { 
  Button, 
  Field, 
  ProgressBar, 
} from "@fluentui/react-components";
import { 
  Checkmark24Regular,
} from "@fluentui/react-icons";
import { useButtonsStyles } from "@/styles/button.styles";
import { AsyncActionState } from "@/hooks/use-async-action";

interface AsyncActionDisplayProps {
  state: AsyncActionState;
  loadingMessage: string;  // Obligatorio, sin "?"
  successMessage: string;  // Obligatorio, sin "?"
  onSuccess?: () => void;
}

export const AsyncActionDisplay = ({
  state,
  loadingMessage,  // Sin valor por defecto
  successMessage,  // Sin valor por defecto
  onSuccess,
}: AsyncActionDisplayProps) => {
  const styles = useButtonsStyles();

  // Estado de loading - Progress bar arriba como antes
  if (state === 'loading') {
    return (
      <>
        <Field
          validationMessage={loadingMessage}
          validationState="none"
        >
          <ProgressBar />
        </Field>
      </>
    );
  }

  // Estado de éxito - Check bonito y botón como antes
  if (state === 'success') {
    return (
      <>
        <div>{successMessage}</div>

        <Button
          size="large"
          icon={<Checkmark24Regular />}
          className={styles.buttonCelesteBase}  
          onClick={onSuccess}
          style={{
            width: "100%",  
            justifyContent: "center",  
            display: "flex",
            alignItems: "center",
          }}
        >
          Aceptar
        </Button>
      </>
    );
  }

  // Estado idle - no muestra nada
  return null;
};
