"use client";

import { DataLayout, Stepper } from "@/components";
import { ExecutionLayout } from "@/components/layouts/execution-layout";
import { useAppSelector } from "@/lib/store/hooks";

export default function HarinaPage() {
  const step = useAppSelector((state) => state.step.current);
  return (
    <>
      <div className="w-full">
        <div className="w-full">
          <div className="w-full flex justify-center pb-3">
            <Stepper currentStep={step} />
          </div>

          <div className="w-full pt-2 pb-2">
            {step === 0 && <DataLayout></DataLayout>}
            {step === 1 && <ExecutionLayout></ExecutionLayout>}
            {step === 2 && <>asdasdasd</>}
          </div>

          {/** 
           * <div className="mt-6">
            <Button
              onClick={() => setStep((s) => Math.max(s - 1, 0))}
          
            >
              Anterior
            </Button>
            <Button
              onClick={() => setStep((s) => Math.min(s + 1, 2))}
              appearance="primary"
            >
              Siguiente
            </Button>
          </div>
           * 
          */}
        </div>
      </div>
    </>
  );
}
