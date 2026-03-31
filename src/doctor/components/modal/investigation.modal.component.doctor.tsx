import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Investigation {
  id: number;
  name: string;
}

interface InvestigationModalProps {
  onClose: () => void;
}

export function InvestigationModal({ onClose }: InvestigationModalProps) {
  const [investigations, setInvestigations] = useState<Investigation[]>([
    { id: 1, name: "" },
  ]);

  const addInvestigation = () => {
    setInvestigations([
      ...investigations,
      { id: investigations.length + 1, name: "" },
    ]);
  };

  const removeInvestigation = (id: number) => {
    if (investigations.length > 1) {
      setInvestigations(investigations.filter((inv) => inv.id !== id));
    }
  };

  const updateInvestigation = (id: number, name: string) => {
    setInvestigations(
      investigations.map((inv) => (inv.id === id ? { ...inv, name } : inv)),
    );
  };

  const handleSave = () => {
    alert("Investigation request saved and PDF generated");
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[800px] p-0 gap-0 overflow-hidden bg-white">
        {/* Header */}
        <DialogHeader className="px-6 py-4 flex flex-row items-center justify-between border-b border-gray-200 space-y-0">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Investigation Request
          </DialogTitle>
        </DialogHeader>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-4">
            {investigations.map((inv) => (
              <div key={inv.id} className="flex items-center gap-3">
                <select
                  value={inv.name}
                  onChange={(e) => updateInvestigation(inv.id, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5164E8]"
                >
                  <option value="">Select Investigation</option>
                  <option value="Blood Glucose">Blood Glucose</option>
                  <option value="HbA1c">HbA1c</option>
                  <option value="Lipid Panel">Lipid Panel</option>
                  <option value="CBC">Complete Blood Count</option>
                  <option value="ECG">ECG</option>
                  <option value="Chest X-ray">Chest X-ray</option>
                  <option value="Echocardiogram">Echocardiogram</option>
                  <option value="Stress Test">Stress Test</option>
                  <option value="CT Scan">CT Scan</option>
                  <option value="MRI">MRI</option>
                  <option value="Ultrasound">Ultrasound</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={addInvestigation}
                    className="p-2 bg-[#077e5c] text-white rounded-lg hover:bg-[#0c926a] transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => removeInvestigation(inv.id)}
                    className="p-2 bg-[#BA1A1A] text-white rounded-lg hover:bg-[#FF5252] transition-colors disabled:opacity-50"
                    disabled={investigations.length === 1}
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
            Save & Generate PDF
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
