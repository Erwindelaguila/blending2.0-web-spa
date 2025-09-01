import React, { useEffect, useState } from "react";
import { Combobox, Option, Label, Text } from "@fluentui/react-components";
import { OrgColors } from "@/config/app.config.server";

type OptionType = string | { value: string; label: string };

type Props = {
  options: OptionType[];
  value: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabledOptions?: string[];
  label?: string;
  labelRequired: boolean;
  error?: string;
  size?: sizeCombobox;
  errorInput?: boolean;
  grayBorder?: boolean;
  onTriggerLoad?: () => void; // carga perezosa
  freeform?: boolean;
};

type sizeCombobox = "small" | "medium" | "large";

export const AppCombobox = ({
  options,
  value,
  onChange,
  placeholder = "Seleccione...",
  disabledOptions = [],
  label,
  labelRequired,
  error,
  size = "medium",
  errorInput = false,
  grayBorder = false,
  onTriggerLoad,
  freeform = false,
}) => {
  const [inputText, setInputText] = useState<string>("");

  const hasOptions = options && options.length > 0;
  const borderColor = errorInput
    ? OrgColors.rojo
    : grayBorder
      ? OrgColors.serotGris
      : OrgColors.celeste;

  useEffect(() => {
    if (!value) {
      setInputText("");
      return;
    }
    if (!hasOptions) return;
    if (typeof options[0] === "string") {
      setInputText(String(value));
      return;
    }
    const opt = options.find(o => typeof o === "object" && o.value === value) as any;
    if (opt) setInputText(String(opt.label || ""));
  }, [value, options, hasOptions]);

  const handleClear = () => {
    if (value) onChange(undefined);
    setInputText("");
  };

  return (
    <div className="w-full">
      {label && <Label required={labelRequired}>{label}</Label>}
      <Combobox
        size={size}
        className="w-full"
        style={{ border: `2px solid ${borderColor}` }}
        placeholder={placeholder}
        value={inputText || ""}
        clearable
        freeform={true} 
        onFocus={onTriggerLoad}
        onClick={onTriggerLoad}
      
        onInput={(ev) => {
          const txt = String((ev.target as HTMLInputElement).value || "");
          if (txt === "") {
            handleClear();
            return;
          }
          setInputText(txt);
          onChange(txt);
        }}
        onOptionSelect={(_, data) => {
            if (data.optionValue == null || data.optionValue === "") {
              handleClear();
              return;
            }
            if (typeof options[0] === "string") {
              setInputText(String(data.optionValue));
            } else {
              const opt = options.find(o => typeof o === "object" && o.value === data.optionValue) as any;
              setInputText(opt ? opt.label : String(data.optionValue));
            }
            onChange(data.optionValue);
        }}
        listbox={{ style: { maxHeight: "200px", overflowY: "auto" } }}
      >
        <div className="max-h-96 overflow-auto z-0">
          {hasOptions ? (
            options.map((option) => {
              const optionValue = typeof option === "string" ? option : option.value;
              const optionLabel = typeof option === "string" ? option : option.label;
              const optionKey = optionValue;
              return (
                <Option
                  key={optionKey}
                  value={optionValue}
                  disabled={disabledOptions.includes(optionValue)}
                >
                  {optionLabel}
                </Option>
              );
            })
          ) : (
            <Option value="__noopt" disabled>No hay opciones disponibles</Option>
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
