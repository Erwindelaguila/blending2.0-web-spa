import React, { useEffect, useMemo, useState } from "react";
import { Combobox, Option, Label, Text } from "@fluentui/react-components";
import { OrgColors } from "@/config/app.config.server";

type BasicOption = string;
interface ObjectOption { value: string; label: string; disabled?: boolean; }
type MixedOption = BasicOption | ObjectOption;

interface Props {
  options: MixedOption[];
  value: string; // valor real (id) que se guarda en el formulario
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabledOptions?: string[];
  label?: string;
  labelRequired: boolean;
  error?: string;
  size?: sizeCombobox;
  errorInput?: boolean;
  grayBorder?: boolean;
  showLabelInsteadOfValue?: boolean; // si true, muestra el label de la opción seleccionada en el input (default true)
  allowFreeInput?: boolean; // permitir escribir libre para filtrar (default true)
}

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
  size = "medium",
  errorInput = false,
  grayBorder = false,
  showLabelInsteadOfValue = true,
  allowFreeInput = true,
}) => {
  const borderColor = errorInput
    ? OrgColors.serotRojo
    : grayBorder
    ? OrgColors.serotGris
    : OrgColors.celeste;
  const hasOptions = options.length > 0;

  const mapOption = (opt: MixedOption): { value: string; label: string; disabled: boolean } => {
    if (typeof opt === "string") return { value: opt, label: opt, disabled: disabledOptions.includes(opt) };
    return { value: opt.value, label: opt.label, disabled: !!opt.disabled };
  };

  const mappedOptions = useMemo(() => options.map(mapOption), [options]);
  const selected = mappedOptions.find(o => o.value === value);

  const [inputValue, setInputValue] = useState("");

  // Sincronizar cuando cambia el value externo
  useEffect(() => {
    if (showLabelInsteadOfValue && selected) {
      setInputValue(selected.label);
    } else if (value) {
      setInputValue(value);
    } else {
      setInputValue("");
    }
  }, [value, selected, showLabelInsteadOfValue]);

  const handleOptionSelect = (_: any, data: any) => {
    const opt = mappedOptions.find(o => o.value === data.optionValue);
    if (opt) {
      setInputValue(showLabelInsteadOfValue ? opt.label : opt.value);
      onChange(opt.value);
    } else {
      onChange(undefined);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!allowFreeInput) return;
    const val = event.target.value;
    setInputValue(val);
    if (val === "") onChange(undefined);
  };

  const handleClear = () => {
    setInputValue("");
    onChange(undefined);
  };

  // Filtrado simple en memoria (opcional) basado en lo que escribe el usuario
  const filtered = useMemo(() => {
    if (!allowFreeInput || inputValue.trim() === "") return mappedOptions;
    const txt = inputValue.toLowerCase();
    return mappedOptions.filter(o => o.label.toLowerCase().includes(txt));
  }, [mappedOptions, inputValue, allowFreeInput]);

  return (
    <div className="w-full">
      {label && <Label required={labelRequired}>{label}</Label>}
      <Combobox
        size={size}
        className="w-full"
        style={{ border: `2px solid ${borderColor}` }}
        placeholder={placeholder}
        value={inputValue}
        clearable
        onChange={handleInputChange}
        onOptionSelect={handleOptionSelect}
      >
        {hasOptions && filtered.length > 0 ? (
          filtered.map(o => (
            <Option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </Option>
          ))
        ) : (
          <Option value="no-options" disabled>
            No hay opciones disponibles
          </Option>
        )}
      </Combobox>
      {error && (
        <Text role="alert" style={{ color: "red", fontSize: 12 }}>
          {error}
        </Text>
      )}
    </div>
  );
};
