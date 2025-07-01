"use client";
import { NumericInputControl } from "@/components/ui/numeric-input-control";
import { LIMITS } from "@/lib/constants/quality-matrix.constants";
import { useButtonsStyles } from "@/styles/button.styles";
import { Button, mergeClasses } from "@fluentui/react-components";

interface ProcessControlsProps {
  numeroRumas: number;
  divisionRumas: number;
  hasChanges: boolean;
  onRumasIncrement: () => void;
  onRumasDecrement: () => void;
  onRumasInputChange: (value: string) => void;
  onDivisionIncrement: () => void;
  onDivisionDecrement: () => void;
  onDivisionInputChange: (value: string) => void;
  onReset: () => void;
  onStartProcess: () => void;
  disabled?: boolean;
  backProcess: () => void;
}

export function ProcessControls({
  numeroRumas,
  divisionRumas,
  hasChanges,
  onRumasIncrement,
  onRumasDecrement,
  onRumasInputChange,
  onDivisionIncrement,
  onDivisionDecrement,
  onDivisionInputChange,
  onReset,
  onStartProcess,
  disabled = false,
  backProcess,
}: ProcessControlsProps) {
  const style = useButtonsStyles();
  return (
    <div className="flex items-center justify-between  bg-transparent w-full h-full">
      <div className="flex gap-6 items-center flex-1">
        <NumericInputControl
          label="Número de rumas"
          value={numeroRumas}
          onIncrement={onRumasIncrement}
          onDecrement={onRumasDecrement}
          onInputChange={onRumasInputChange}
          min={LIMITS.MIN_RUMAS}
        />

        <NumericInputControl
          label="División de rumas (toneladas)"
          value={divisionRumas}
          onIncrement={onDivisionIncrement}
          onDecrement={onDivisionDecrement}
          onInputChange={onDivisionInputChange}
          min={LIMITS.MIN_DIVISION}
          max={LIMITS.MAX_DIVISION}
        />
      </div>

      <div className="flex flex-col gap-3 items-end flex-shrink-0 ml-auto">
        <Button
          size="large"
          className={mergeClasses(
            `w-[13rem] ${style.buttonVerdeBase}`,
            !hasChanges && style.buttonDisabled
          )}
          onClick={onReset}
          disabled={!hasChanges}
        >
          Restablecer parámetros
        </Button>
        <div className="flex gap-2">
          <Button
            size="large"
            onClick={backProcess}
            className={`w-[13rem] ${style.buttonGrisBase}`}
          >
            Atras
          </Button>
          <Button
            size="large"
            className={mergeClasses(
              `w-[13rem] ${style.buttonCelesteBase}`,
              disabled && style.buttonDisabled
            )}
            onClick={onStartProcess}
            disabled={disabled}
          >
            Iniciar proceso
          </Button>
        </div>
      </div>
    </div>
  );
}
