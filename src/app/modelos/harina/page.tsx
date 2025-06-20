"use client";

import { TabResult, Stepper, TabData, TabExecution } from "@/components";
import { useAppSelector } from "@/lib/store/hooks";

export default function HarinaPage() {
  const step = useAppSelector((state) => state.step.current);

  const renderStepComponent = () => {
    switch (step) {
      case 0:
        return <TabData />;
      case 1:
        return <TabExecution />;
      case 2:
        return <TabResult />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="w-full">
        <div className="w-full flex justify-center pb-3">
          <Stepper currentStep={step} />
        </div>
        <div className="w-full pt-2 pb-2">{renderStepComponent()}</div>
      </div>
    </>
  );
}
