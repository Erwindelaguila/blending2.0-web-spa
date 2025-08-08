import * as React from "react";
import { Button, Spinner } from "@fluentui/react-components";
import { useButtonsStyles } from "@/styles/button.styles";
import { DocumentAdd24Filled } from "@fluentui/react-icons";

interface IFileUploadButton {
  onFileSelected: (file: File) => Promise<void>; // async
  accept?: string;
  label?: string;
  icon?: boolean;
  loading?: boolean;
  disabled?: boolean; // Añadido para manejar el estado deshabilitado
}

export const FileUploadButton = ({
  onFileSelected,
  accept = "*",
  label = "Subir archivo",
  icon = false,
  loading = false,
  disabled = false, // Añadido para manejar el estado deshabilitado

}: IFileUploadButton) => {
  const style = useButtonsStyles();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = () => inputRef.current?.click();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onFileSelected(file);
      // Limpia el input para permitir volver a subir el mismo archivo
      e.target.value = "";
    }
  };

  return (
    <>
      <input
        type="file"
        accept={accept}
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleChange}
      />
      {loading ? (
        <>
          <Button size="large" className={`w-[20rem] ${style.buttonCelesteBase}`} icon={<Spinner size="tiny" />} appearance="primary">
            Procesando ...
          </Button>
        </>
      ) : (
        <>
          <Button
            onClick={handleClick}
            size="large"
            icon={icon ? <DocumentAdd24Filled /> : undefined}
            className={`w-[20rem] ${disabled ? style.buttonDisabled : style.buttonCelesteBase}`}
            disabled={disabled} // Usa el estado deshabilitado
          >
            {label}
          </Button>
        </>
      )}
    </>
  );
};
