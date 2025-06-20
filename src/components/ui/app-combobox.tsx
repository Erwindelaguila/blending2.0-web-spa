import React from "react";
import { Combobox, Option, Label, Text } from "@fluentui/react-components";
import { OrgColors } from "@/config/app.config.server";

type Props = {
  options: string[];
  value: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabledOptions?: string[]; // opciones deshabilitadas
  label?: string;
  labelRequired: boolean; // si el label es requerido
  error?: string;
  size?: sizeCombobox; // tamaño del combobox
  errorInput?: boolean;
  grayBorder?: boolean;
};

type sizeCombobox = "small" | "medium" | "large";

export const AppCombobox: React.FC<Props> = ({
  options,
  value,
  onChange,
  placeholder = "Seleccione una opción",
  disabledOptions = [],
  label,
  labelRequired = false,
  error,
  size = "medium", // tamaño del combobox
  errorInput = false, // si el input tiene error
  grayBorder = false,
}) => {
  const borderColor = errorInput
    ? OrgColors.serotRojo
    : grayBorder
    ? OrgColors.serotGris 
    : OrgColors.celeste;

  return (
    <div className="w-full">
      {label && <Label required={labelRequired}>{label}</Label>}

      <Combobox
        size={size}
        className="w-full"
        style={{ border: `2px solid ${borderColor}` }}
        placeholder={placeholder}
        value={value}
        onOptionSelect={(_, data) => onChange(data.optionValue)}
      >
        {options.map((option) => (
          <Option
            key={option}
            value={option}
            disabled={disabledOptions.includes(option)}
          >
            {option}
          </Option>
        ))}
      </Combobox>

      {error && (
        <Text role="alert" style={{ color: "red", fontSize: 12 }}>
          {error}
        </Text>
      )}
    </div>
  );
};
