import React from "react";
import { Combobox, Option, Label, Text } from "@fluentui/react-components";
import { OrgColors } from "@/config/app.config.server";
import { IComboboxApp } from "@/interface";



export const AppCombobox = ({
  options,
  value,
  onChange,
  placeholder = "Seleccione una opción",
  disabledOptions = [],
  label,
  labelRequired = false,
  error,
  size = "medium",
  errorInput = false,
  grayBorder = false,
}: IComboboxApp) => {
  const borderColor = errorInput
    ? OrgColors.serotRojo
    : grayBorder
    ? OrgColors.serotGris
    : OrgColors.celeste;

  const hasOptions = options.length > 0;

  return (
    <div className="w-full">
      {label && <Label required={labelRequired}>{label}</Label>}

      <Combobox
        size={size}
        className="w-full"
        style={{ border: `2px solid ${borderColor}` }}
        placeholder={placeholder}
        value={value}
        selectedOptions={value ? [value] : []}
        clearable
        onOptionSelect={(_, data) => onChange(data.optionValue)}
        listbox={{ style: { maxHeight: "5px", overflowY: "auto" } }}
      >
        <div className="max-h-96 overflow-auto z-0">
          {hasOptions ? (
            options.map((option) => (
              <Option
                key={option}
                value={option}
                disabled={disabledOptions.includes(option)}
              >
                {option}
              </Option>
            ))
          ) : (
            <Option value="no-options" disabled>
              No hay opciones disponibles
            </Option>
          )}
        </div>
      </Combobox>

      {error && (
        <Text role="alert" style={{ color: "red", fontSize: 12 }}>
          {error}
        </Text>
      )}
    </div>
  );
};
