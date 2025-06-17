import * as React from "react";
import { Text } from "@fluentui/react-components";
import clsx from "clsx";
import { CheckmarkRegular } from "@fluentui/react-icons";

type StepperProps = {
  currentStep: number; // 0 = Datos, 1 = Ejecución, 2 = Resultado
};

const steps = ["Datos", "Ejecución", "Resultado"];

export const Stepper = ({ currentStep }: StepperProps) => {

  return (
    <div className="w-full max-w-5xl px-8">
      <div className="relative flex items-center justify-between">
        {/* Línea de fondo que conecta los círculos */}
        <div
          className="absolute top-9/12 left-8 right-8 h-1 bg-gray-300 -translate-y-1/2 z-0"
          style={{ pointerEvents: "none" }}
        />

        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div
              key={step}
              className="relative z-10 flex flex-col items-center"
              style={{ width: 36 }} // ancho fijo para alinear bien la línea
            >
              <Text
                size={400}
                weight="semibold"
                className={clsx(
                  "mb-1",
                  isActive
                    ? "text-blue-600 font-semibold"
                    : isCompleted
                    ? "text-blue-600"
                    : "text-gray-500"
                )}
              >
                {step}
              </Text>

              <div
                className={clsx(
                  "w-7 h-7 rounded-full border-4 flex items-center justify-center",
                  isActive
                    ? "bg-[#0085fc] border-gray-300"
                    : isCompleted
                    ? "bg-[#0085fc] border-[#0085fc]"
                    : "bg-gray-300 border-gray-300"
                )}
              >
                {isCompleted && (
                  <CheckmarkRegular
                    style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
