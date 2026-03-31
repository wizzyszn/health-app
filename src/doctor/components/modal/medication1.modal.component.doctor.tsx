import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Medication {
  id: number;
  formulary: string;
  name: string;
  dose: string;
  unit: string;
  interval: string;
  durationNumber: string;
  durationUnit: string;
}

interface MedicationModalProps {
  onClose: () => void;
}

export function MedicationModal({ onClose }: MedicationModalProps) {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: 1,
      formulary: "",
      name: "",
      dose: "",
      unit: "",
      interval: "",
      durationNumber: "",
      durationUnit: "",
    },
  ]);

  const addMedication = () => {
    setMedications([
      ...medications,
      {
        id: medications.length + 1,
        formulary: "",
        name: "",
        dose: "",
        unit: "",
        interval: "",
        durationNumber: "",
        durationUnit: "",
      },
    ]);
  };

  const removeMedication = (id: number) => {
    if (medications.length > 1) {
      setMedications(medications.filter((med) => med.id !== id));
    }
  };

  const updateMedication = (id: number, field: string, value: string) => {
    setMedications(
      medications.map((med) =>
        med.id === id ? { ...med, [field]: value } : med,
      ),
    );
  };

  const handleSave = () => {
    alert("Prescription saved and generated");
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[1200px] p-0 gap-0 overflow-hidden bg-white">
        {/* Header */}
        <DialogHeader className="px-6 py-4 flex flex-row items-center justify-between border-b border-gray-200 space-y-0">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Prescription Builder
          </DialogTitle>
        </DialogHeader>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="mb-4 bg-gray-100 p-3 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="flex-1 grid grid-cols-8 gap-3 text-sm text-gray-700 font-semibold items-center">
                <div>Formulary</div>
                <div className="col-span-2">Medication</div>
                <div>Dose</div>
                <div>Unit</div>
                <div>Interval</div>
                <div>Duration</div>
                <div>Unit</div>
              </div>
              <div className="w-[88px]" /> {/* Spacer for action buttons */}
            </div>
          </div>

          <div className="space-y-3">
            {medications.map((med) => (
              <div key={med.id} className="flex items-start gap-3">
                <div className="flex-1 grid grid-cols-8 gap-3">
                  {/* A: Formulary */}
                  <Select
                    value={med.formulary || undefined}
                    onValueChange={(val) =>
                      updateMedication(med.id, "formulary", val)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tabs">Tabs</SelectItem>
                      <SelectItem value="Caps">Caps</SelectItem>
                      <SelectItem value="Syr">Syr</SelectItem>
                      <SelectItem value="Inj">Inj</SelectItem>
                      <SelectItem value="Cream">Cream</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* B: Medication Name */}
                  <Select
                    value={med.name || undefined}
                    onValueChange={(val) =>
                      updateMedication(med.id, "name", val)
                    }
                  >
                    <SelectTrigger className="col-span-2 w-full">
                      <SelectValue placeholder="Select Medication" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Metformin">Metformin</SelectItem>
                      <SelectItem value="Lisinopril">Lisinopril</SelectItem>
                      <SelectItem value="Atorvastatin">Atorvastatin</SelectItem>
                      <SelectItem value="Aspirin">Aspirin</SelectItem>
                      <SelectItem value="Amlodipine">Amlodipine</SelectItem>
                      <SelectItem value="Omeprazole">Omeprazole</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* C: Dose */}
                  <Input
                    type="number"
                    value={med.dose}
                    onChange={(e) =>
                      updateMedication(med.id, "dose", e.target.value)
                    }
                    placeholder="Dose"
                    className="w-full"
                  />

                  {/* D: Unit */}
                  <Select
                    value={med.unit || undefined}
                    onValueChange={(val) =>
                      updateMedication(med.id, "unit", val)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mg">mg</SelectItem>
                      <SelectItem value="g">g</SelectItem>
                      <SelectItem value="ml">ml</SelectItem>
                      <SelectItem value="mcg">mcg</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* E: Interval */}
                  <Select
                    value={med.interval || undefined}
                    onValueChange={(val) =>
                      updateMedication(med.id, "interval", val)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OD">OD</SelectItem>
                      <SelectItem value="BD">BD</SelectItem>
                      <SelectItem value="TDS">TDS</SelectItem>
                      <SelectItem value="QDS">QDS</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* F: Duration Number */}
                  <Input
                    type="number"
                    value={med.durationNumber}
                    onChange={(e) =>
                      updateMedication(med.id, "durationNumber", e.target.value)
                    }
                    placeholder="Num"
                    className="w-full"
                  />

                  {/* G: Duration Unit */}
                  <Select
                    value={med.durationUnit || undefined}
                    onValueChange={(val) =>
                      updateMedication(med.id, "durationUnit", val)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="days">Days</SelectItem>
                      <SelectItem value="weeks">Weeks</SelectItem>
                      <SelectItem value="months">Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Plus/Minus Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={addMedication}
                    className="p-2 bg-[#00C48C] text-white rounded-lg hover:bg-[#00B37E] transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => removeMedication(med.id)}
                    className="p-2 bg-[#FF6B6B] text-white rounded-lg hover:bg-[#FF5252] transition-colors disabled:opacity-50"
                    disabled={medications.length === 1}
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-[#5164E8] text-white rounded-lg hover:bg-[#4153D7] transition-colors"
          >
            Save & Generate Prescription
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
