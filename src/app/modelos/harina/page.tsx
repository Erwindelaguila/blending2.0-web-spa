"use client";

import { TabResult, Stepper, TabData, TabExecution } from "@/components";
import { ITabData } from "@/interface";
import { useAppSelector } from "@/lib/store/hooks";
import { useState } from "react";

export default function HarinaPage() {
  const step = useAppSelector((state) => state.step.current);
  const [tabData, setTabData] = useState<ITabData>({} as ITabData);

  return (
    <>
      <div className="w-full h-full flex flex-col gap-2">
        <div className="w-full flex justify-center h-2/25">
          <Stepper currentStep={step} />
        </div>

        <div className="w-full h-23/25">
          <div className={`w-full h-full ${step === 0 ? "block" : "hidden"}`}>
            <TabData
              onChange={(data) => {
                setTabData(data);
              }}
            />
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
