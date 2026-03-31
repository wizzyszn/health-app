import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function InvestigationResultsForm({
  onCancel,
  onSave,
  onSaveAndContinue,
}: {
  onCancel: () => void;
  onSave: () => void;
  onSaveAndContinue: () => void;
}) {
  return (
    <div className="bg-white rounded-lg p-6 space-y-5 shadow-sm border border-[#E5E7EB]">
      <div className="grid grid-cols-2 gap-5">
        <div>
          <Label className="block text-[#374151] mb-2">Blood Test</Label>
          <Textarea
            className="min-h-[140px] font-mono !text-xs"
            defaultValue={`Complete Blood Count:
Hb: 12.5 g/dL (normal)
WBC: 7.2 x10^9/L (normal)
Platelets: 245 x10^9/L (normal)

Renal Function:
Creatinine: 82 μmol/L (normal)
eGFR: >90 mL/min/1.73m²

HbA1c: 6.8% (controlled)`}
          />
        </div>

        <div>
          <Label className="block text-[#374151] mb-2">Microbiology</Label>
          <Textarea
            className="min-h-[140px] !text-xs"
            placeholder="Enter microbiology results..."
          />
        </div>

        <div>
          <Label className="block text-[#374151] mb-2">Radiology</Label>
          <Textarea
            className="min-h-[140px] !text-xs"
            defaultValue={`Chest X-ray (AP view):
- Normal heart size and shape
- Clear lung fields bilaterally
- No pleural effusion
- No pneumothorax
- Bones and soft tissues normal

Impression: Normal chest radiograph`}
          />
        </div>

        <div>
          <Label className="block text-[#374151] mb-2">Cardiovascular</Label>
          <Textarea
            className="min-h-[140px] !text-xs"
            defaultValue={`ECG:
- Sinus rhythm
- Rate: 76 bpm
- Normal axis
- No ST-T changes
- QTc: 420 ms (normal)`}
          />
        </div>

        <div>
          <Label className="block text-[#374151] mb-2">Procedures</Label>
          <Textarea
            className="min-h-[140px] !text-xs"
            placeholder="Enter procedure results..."
          />
        </div>

        <div>
          <Label className="block text-[#374151] mb-2">Others</Label>
          <Textarea
            className="min-h-[140px] !text-xs"
            placeholder="Any additional investigation results..."
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
        <button
          onClick={onCancel}
          className="px-6 py-2.5 bg-white border border-[#D1D5DB] text-[#374151] rounded-lg hover:bg-[#F9FAFB] transition-colors text-xs"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-6 py-2.5 bg-[#F3F4F6] text-[#374151] rounded-lg hover:bg-[#E5E7EB] transition-colors border border-[#D1D5DB] text-xs"
        >
          Save
        </button>
        <button
          onClick={onSaveAndContinue}
          className="px-6 py-2.5 bg-[#5164E8] text-white rounded-lg hover:bg-[#4153D6] transition-colors shadow-sm text-xs"
        >
          Save and Continue
        </button>
      </div>
    </div>
  );
}
