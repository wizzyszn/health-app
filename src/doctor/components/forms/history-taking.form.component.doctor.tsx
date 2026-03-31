import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function HistoryTakingForm({
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
      <div className="space-y-5">
        <div>
          <Label className="block text-[#374151] mb-2">Present Complaint</Label>
          <Textarea
            className="min-h-[100px] !text-xs"
            defaultValue="Recurrent headache for 3 weeks, throbbing in nature, associated with nausea and photophobia. Pain intensity 7/10, worse in the morning."
          />
        </div>

        <div>
          <Label className="block text-[#374151] mb-2">
            History of Presenting Complaint (Hx of PC)
          </Label>
          <Textarea
            className="min-h-[100px] !text-xs"
            defaultValue="Patient reports that headaches started approximately 3 weeks ago. Initially mild but have progressively worsened. Episodes occur 3-4 times per week, lasting 4-6 hours each. Patient has tried over-the-counter paracetamol with minimal relief. No recent head trauma or fever."
          />
        </div>

        <div>
          <Label className="block text-[#374151] mb-2">
            Past Medical History / Past Surgical History (PMHx / PSHx)
          </Label>
          <Textarea
            className="min-h-[100px] !text-xs"
            defaultValue="Type 2 Diabetes Mellitus diagnosed 2015, well-controlled. Hypertension diagnosed 2018. Appendectomy in 2010. No other significant medical or surgical history."
          />
        </div>

        <div>
          <Label className="block text-[#374151] mb-2">
            Medication History
          </Label>
          <Textarea
            className="min-h-[80px] !text-xs"
            defaultValue="Amlodipine 5mg once daily, Metformin 500mg BD (twice daily), Aspirin 75mg once daily"
          />
        </div>

        <div>
          <Label className="block text-[#374151] mb-2">Allergy History</Label>
          <div className="flex items-start gap-3 mb-2">
            <span className="px-3 py-1 bg-red-50 text-red-600 rounded-md text-xs border border-red-200">
              Allergy Present
            </span>
          </div>
          <Textarea
            className="min-h-[60px] !text-xs"
            defaultValue="Penicillin - anaphylaxis (documented 2012)"
          />
        </div>

        <div>
          <Label className="block text-[#374151] mb-2">Family History</Label>
          <Textarea
            className="min-h-[80px] !text-xs"
            defaultValue="Father had hypertension and stroke at age 65. Mother has Type 2 Diabetes. No family history of migraine or neurological disorders."
          />
        </div>

        <div>
          <Label className="block text-[#374151] mb-2">Travel History</Label>
          <Textarea
            className="min-h-[60px] !text-xs"
            defaultValue="No recent travel outside the country in the past 6 months."
          />
        </div>

        <div>
          <Label className="block text-[#374151] mb-2">Occupation</Label>
          <Input
            type="text"
            defaultValue="Software Engineer"
            className=" !text-xs"
          />
        </div>

        <div>
          <Label className="block text-[#374151] mb-2">Social History</Label>
          <Textarea
            className="min-h-[80px] !text-xs"
            defaultValue="Non-smoker. Occasional alcohol consumption (1-2 units per week). Regular exercise 3 times per week. Lives with spouse and two children."
          />
        </div>

        <div>
          <Label className="block text-[#374151] mb-2">
            Obstetric / Gynaecological History
          </Label>
          <Textarea
            className="min-h-[60px] !text-xs"
            defaultValue="G2P2, last menstrual period 2 weeks ago, regular cycles"
          />
        </div>

        <div>
          <Label className="block text-[#374151] mb-2">Others</Label>
          <Textarea
            className="min-h-[60px] !text-xs"
            placeholder="Any additional relevant information..."
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
        <button
          onClick={onCancel}
          className="px-6 py-2.5 bg-white border border-[#D1D5DB] text-[#374151] rounded-lg hover:bg-[#F9FAFB] transition-colors text-sm"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-6 py-2.5 bg-[#F3F4F6] text-[#374151] rounded-lg hover:bg-[#E5E7EB] transition-colors border border-[#D1D5DB] text-sm"
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
