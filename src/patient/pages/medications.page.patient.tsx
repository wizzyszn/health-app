import { Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MedicineBottleIcon from "@/shared/components/svgs/icons/medicine-bottle.icon";
import { CalendarIcon } from "lucide-react"; // Or similar for the date

const MOCK_MEDICATIONS = [
  {
    id: 1,
    doctor: "Dr. Sarah Wilson",
    medications: "Amoxicillin 500mg, Panadol",
    refId: "APT-1001",
    date: "2025-12-10 at 10:30 AM",
  },
  {
    id: 2,
    doctor: "Dr. Michael Chen",
    medications: "Hydrocortisone Cream",
    refId: "APT-1001",
    date: "2025-12-10 at 10:30 AM",
  },
  {
    id: 3,
    doctor: "Dr. Emily Brown",
    medications: "Loratadine 10mg",
    refId: "APT-1001",
    date: "2025-12-10 at 10:30 AM",
  },
];

export default function MedicationsPage() {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900">Medication</h1>
        <p className="text-[15px] text-gray-500">
          View and manage your prescriptions.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-[15px] font-medium text-gray-700">History</h2>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div className="relative mb-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by date, Ref ID or type..."
              className="pl-10 bg-[#F9FAFB] border-none shadow-none text-sm placeholder:text-gray-400 h-11 rounded-lg w-full"
            />
          </div>

          <div className="flex flex-col gap-3">
            {MOCK_MEDICATIONS.map((med) => (
              <div
                key={med.id}
                className="flex bg-[#F7F7F7] items-center justify-between px-4 py-4 rounded-[12px]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center justify-center border h-12 w-12 bg-white rounded-[8px] text-[#6366F1]">
                    <MedicineBottleIcon size={24} color="currentColor" />
                  </div>

                  <div>
                    <p className="text-[16px] font-medium text-foreground">
                      {med.doctor}
                    </p>
                    <p className="text-[13px] text-[#6366F1] font-medium">
                      {med.medications}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-[#6C6C6C]">
                      <span>Ref: {med.refId}</span>
                      <span>•</span>
                      <CalendarIcon className="h-3 w-3" />
                      <span>{med.date}</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 h-9 px-4 text-[13px] font-semibold gap-2 rounded-[8px]"
                >
                  <Download className="h-4 w-4 text-gray-500" />
                  Download PDF
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
