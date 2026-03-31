import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function PhysicalExamForm({
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
          <Label className="block text-[#374151] mb-2">General Physical</Label>
          <Textarea
            className="min-h-[100px] !text-xs"
            defaultValue="Patient alert and oriented. No pallor, no jaundice, no cyanosis, no clubbing. No lymphadenopathy. BMI 24.5. Vitals: BP 128/82 mmHg, HR 76 bpm, RR 16/min, Temp 36.8°C, SpO2 98% on room air."
          />
        </div>

        <div>
          <Label className="block text-[#374151] mb-2">Nervous System</Label>
          <Textarea
            className="min-h-[100px] !text-xs"
            defaultValue="Conscious and alert. GCS 15/15. Cranial nerves II-XII intact. Power 5/5 in all limbs. Reflexes normal and symmetrical. No sensory deficit. Gait normal. No signs of meningism."
          />
        </div>

        <div>
          <Label className="block text-[#374151] mb-2">
            Respiratory System
          </Label>
          <Textarea
            className="min-h-[100px] !text-xs"
            defaultValue="Chest clear, air entry equal bilaterally. No wheeze, no crepitations. Percussion note resonant. No chest wall deformity."
          />
        </div>

        <div>
          <Label className="block text-[#374151] mb-2">
            Cardiovascular System
          </Label>
          <Textarea
            className="min-h-[100px] !text-xs"
            defaultValue="Heart sounds S1 S2 normal, no murmurs. Apex beat in normal position. Peripheral pulses palpable and equal. No pedal edema. JVP not elevated."
          />
        </div>

        <div>
          <Label className="block text-[#374151] mb-2">
            Gastro-intestinal System
          </Label>
          <Textarea
            className="min-h-[100px] !text-xs"
            defaultValue="Abdomen soft, non-tender. No organomegaly. Bowel sounds present and normal. No masses palpable."
          />
        </div>

        <div>
          <Label className="block text-[#374151] mb-2">
            Genito-urinary System
          </Label>
          <Textarea
            className="min-h-[100px] !text-xs"
            placeholder="Enter examination findings..."
          />
        </div>

        <div>
          <Label className="block text-[#374151] mb-2">
            Musculo-skeletal System
          </Label>
          <Textarea
            className="min-h-[100px] !text-xs"
            defaultValue="Full range of movement in all joints. No swelling, no deformity. Spine examination normal."
          />
        </div>

        <div>
          <Label className="block text-[#374151] mb-2">ENT</Label>
          <Textarea
            className="min-h-[100px] !text-xs"
            placeholder="Enter examination findings..."
          />
        </div>

        <div>
          <Label className="block text-[#374151] mb-2">
            Obstetric / Gynaecological
          </Label>
          <Textarea
            className="min-h-[100px] !text-xs"
            placeholder="Enter examination findings..."
          />
        </div>

        <div>
          <Label className="block text-[#374151] mb-2">Others</Label>
          <Textarea
            className="min-h-[100px] !text-xs"
            placeholder="Any additional examination findings..."
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
          className="px-6 py-2.5 bg-[#5164E8] text-white rounded-lg hover:bg-[#4153D6] transition-colors shadow-sm text-sm"
        >
          Save and Continue
        </button>
      </div>
    </div>
  );
}
