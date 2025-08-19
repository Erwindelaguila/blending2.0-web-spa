import React, { useReducer, useMemo, forwardRef } from "react";
import {
  Button,
  Label,
  Tag,
  TagPicker,
  TagPickerControl,
  TagPickerGroup,
  TagPickerInput,
  TagPickerList,
  TagPickerOption,
  Text,
} from "@fluentui/react-components";
import { OrgColors } from "@/config/app.config.server";
import { Dismiss16Regular } from "@fluentui/react-icons";

export type KeyValue = {
  key: string;
  value: string;
};

type Props = {
  options: KeyValue[];
  placeholder?: string;
  value: KeyValue[];
  onChange: (selected: KeyValue[]) => void;
  error?: string;
  size?: sizeTagPicker;
  label?: string;
  sizeLabel?: sizeLabel;
  requieredLabel?: boolean;
  errorInput?: boolean;
  keyView?: boolean;
};

type State = {
  inputValue: string;
};

type sizeTagPicker = "medium" | "extra-large" | "large";
type sizeLabel = "small" | "medium" | "large";

type Action = { type: "SET_INPUT"; payload: string } | { type: "RESET_INPUT" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_INPUT":
      return { ...state, inputValue: action.payload };
    case "RESET_INPUT":
      return { ...state, inputValue: "" };
    default:
      return state;
  }
};

export const AppTagPickerKeyValue = forwardRef<HTMLDivElement, Props>(
  (
    {
      options,
      value,
      onChange,
      placeholder = "Seleccione opciones",
      error,
      size = "medium",
      label,
      sizeLabel = "medium",
      requieredLabel = false,
      errorInput = false,
      keyView = false,
    },
    ref
  ) => {
    const [state, dispatch] = useReducer(reducer, {
      inputValue: "",
    });

    const filteredOptions = useMemo(() => {
      return options.filter(
        (opt) =>
          opt.value.toLowerCase().includes(state.inputValue.toLowerCase()) &&
          !value.some((v) => v.key === opt.key)
      );
    }, [options, state.inputValue, value]);

    const handleClear = () => {
      onChange([]);
    };

    return (
      <div ref={ref} className="flex flex-col gap-1">
        {label && (
          <Label
            size={sizeLabel}
            required={requieredLabel}
            htmlFor="AppTagPickerKeyValue"
          >
            {label}
          </Label>
        )}

        <TagPicker
          size={size}
          selectedOptions={value.map((v) => v.key)}
          onOptionSelect={(_, data) => {
            if (data.value === "no-options") return;

            const selectedKeys = data.selectedOptions;
            const selectedKeyValues = options.filter((opt) =>
              selectedKeys.includes(opt.key)
            );

            onChange(selectedKeyValues);
            dispatch({ type: "RESET_INPUT" });
          }}
        >
          <TagPickerControl
            style={
              errorInput
                ? { border: `2px solid ${OrgColors.serotRojo}` }
                : { border: `2px solid ${OrgColors.celeste}` }
            }
            secondaryAction={
              <Button
                appearance="transparent"
                size="small"
                shape="rounded"
                style={{ display: value.length > 0 ? "block" : "none" }}
                onClick={handleClear}
                icon={<Dismiss16Regular />}
              />
            }
          >
            <TagPickerGroup aria-label="Selected Items">
              {value.map((option) => (
                <Tag key={option.key} value={option.key} shape="rounded">
                  {keyView  ? option.key : option.value}
                </Tag>
              ))}
            </TagPickerGroup>

            <TagPickerInput
              aria-label="Select Items"
              placeholder={value.length > 0 ? "" : placeholder}
              value={state.inputValue}
              onChange={(e) =>
                dispatch({ type: "SET_INPUT", payload: e.target.value })
              }
            />
          </TagPickerControl>

          <TagPickerList
            style={{ maxHeight: "15rem", overflowY: "auto" }}
            className="scrollable-list"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <TagPickerOption key={option.key} value={option.key}>
                  {keyView  ? option.key : option.value}
                </TagPickerOption>
              ))
            ) : (
              <TagPickerOption value="no-options">
                No hay opciones
              </TagPickerOption>
            )}
          </TagPickerList>
        </TagPicker>

        {error && (
          <Text role="alert" style={{ color: "red", fontSize: 12 }}>
            {error}
          </Text>
        )}
      </div>
    );
  }
);

AppTagPickerKeyValue.displayName = "AppTagPickerKeyValue";
