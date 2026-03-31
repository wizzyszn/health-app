import Tabs, { TabTrigger, TabContents } from "@/components/TabComponent";

import Diagnosis from "./diagnosis.component.doctor";
import Investigations from "./investigations.component.doctor";
import React from "react";
import Formulations from "./formulations.component.doctor";
type Props = {
  consultationId: string;
};
function MedicalRecord({ consultationId }: Props) {
  return (
    <div className="mt-8 w-full min-h-44">
      <Tabs defaultValue="investigation" className=" shadow">
        <TabTrigger value="investigation" className="text-lg">
          Investigations
        </TabTrigger>
        <TabTrigger value="diagnosis" className="text-lg">
          Diagnosis
        </TabTrigger>
        <TabTrigger value="medications" className="text-lg">
          Medications
        </TabTrigger>

        <TabContents value="investigation">
          <Investigations consultationId={consultationId} />
        </TabContents>

        <TabContents value="diagnosis">
          <Diagnosis consultationId={consultationId} />
        </TabContents>

        <TabContents value="medications">
          <Formulations consultationId={consultationId} />
        </TabContents>
      </Tabs>
    </div>
  );
}

export default React.memo(MedicalRecord);
