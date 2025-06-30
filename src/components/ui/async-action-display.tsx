"use client";

import { 
  Button, 
  Field, 
  ProgressBar,
  MessageBar,
  MessageBarTitle,
  MessageBarBody,
} from "@fluentui/react-components";
import { 
  Checkmark24Regular,
  Dismiss24Regular,
} from "@fluentui/react-icons";
import { useButtonsStyles } from "@/styles/button.styles";
import { AsyncActionState } from "@/hooks/use-async-action";

interface AsyncActionDisplayProps {
  state: AsyncActionState;
  loadingMessage: string;  
  successMessage: string;  
  error?: string | null;   
  onSuccess?: () => void;
  onErrorBack?: () => void; 
  onErrorDismiss?: () => void; 
}

export const AsyncActionDisplay = ({
  state,
  loadingMessage,  
  successMessage, 
  error,
  onSuccess,
  onErrorDismiss,
}: AsyncActionDisplayProps) => {
  const styles = useButtonsStyles();

  // Estado de loading - 
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

  // Estado de éxito 
  if (state === 'success') {
    return (
      <>
        <MessageBar 
          intent="success"
          style={{ marginBottom: '16px' }}
        >
          <MessageBarBody>
            <MessageBarTitle>Éxito</MessageBarTitle>
            {successMessage}
          </MessageBarBody>
        </MessageBar>

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

  // Estado de error 
  if (state === 'error') {
    return (
      <MessageBar 
        intent="error"
        style={{ marginBottom: '16px' }}
      >
        <MessageBarBody>
          <MessageBarTitle>Error</MessageBarTitle>
          {error || 'Ha ocurrido un error inesperado'}
        </MessageBarBody>
        {onErrorDismiss && (
          <Button
            appearance="transparent"
            icon={<Dismiss24Regular />}
            size="small"
            onClick={onErrorDismiss}
            style={{ marginLeft: 'auto' }}
          />
        )}
      </MessageBar>
    );
  }

  // Estado idle - no muestra nada
  return null;
};
