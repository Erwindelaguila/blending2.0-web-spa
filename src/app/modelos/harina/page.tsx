"use client";

import { TabResult, Stepper, TabData, TabExecution } from "@/components";
import { useAppSelector } from "@/lib/store/hooks";

export default function HarinaPage() {
  const step = useAppSelector((state) => state.step.current);

  return (
    <>
      <div className="w-full h-full flex flex-col gap-2">
        <div className="w-full flex justify-center h-2/25">
          <Stepper currentStep={step} />
        </div>

        <div className="w-full h-23/25">
          <div className={`w-full h-full ${step === 0 ? "block" : "hidden"}`}>
            <TabData />
          </div>
          <div className={`w-full h-full ${step === 1 ? "block" : "hidden"}`}>
            <TabExecution />
          </div>
          <div className={`w-full h-full ${step === 2 ? "block" : "hidden"}`}>
            <TabResult />
          </div>
        </div>
      </div>
    </>
  );
}
