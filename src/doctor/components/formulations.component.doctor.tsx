import { getMedicationsForConsultation } from "@/config/service/doctor.service";
import { GeneralReturnInt, MedicationFormulationInt } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const Formulations = React.memo(
  ({ consultationId }: { consultationId: string }) => {
    const { data, isPending } = useQuery<
      GeneralReturnInt<MedicationFormulationInt[]>
    >({
      queryKey: ["medications_doc", consultationId],
      queryFn: () => getMedicationsForConsultation(consultationId),
    });
    const medications = data?.data ?? [];
    if (isPending) return <div className="p-4">Loading........</div>;
    return (
      <div className="">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border text-left">Formulation</th>
                <th className="py-2 px-4 border text-left">Drug</th>
                <th className="py-2 px-4 border text-left">Dosage</th>
                <th className="py-2 px-4 border text-left">Interval</th>
                <th className="py-2 px-4 border text-left">Duration</th>
                <th className="py-2 px-4 border text-left">Status</th>
                <th className="py-2 px-4 border text-left">
                  Prescription Date
                </th>
              </tr>
            </thead>
            <tbody>
              {medications.length < 1 ? (
                <div>No Medications for this consultation</div>
              ) : (
                medications.map((med, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="py-2 px-4 border">{med.formulation}</td>
                    <td className="py-2 px-4 border">{med.drug}</td>
                    <td className="py-2 px-4 border">
                      {med.dose_value} {med.dose_unit}
                    </td>
                    <td className="py-2 px-4 border">{med.interval}</td>
                    <td className="py-2 px-4 border">
                      {med.duration_value} {med.duration_unit}
                    </td>
                    <td className="py-2 px-4 border">{med.status}</td>
                    <td className="py-2 px-4 border">
                      {new Date(med.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  },
);

export default Formulations;
