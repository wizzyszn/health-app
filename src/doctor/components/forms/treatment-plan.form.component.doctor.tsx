import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function TreatmentPlanForm({
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
      <div>
        <Label className="block text-[#374151] mb-2 text-xs">
          Treatment Plan Details
        </Label>
        <Textarea
          className="min-h-[320px] !text-xs"
          placeholder="Enter detailed treatment plan, advice, follow-up instructions..."
          defaultValue={`1. Medication Management:
   - Continue current medications (Amlodipine 5mg OD, Metformin 500mg BD)
   - Start Sumatriptan 50mg as needed for acute migraine attacks (max 2 doses/day)
   - Consider prophylactic therapy if attacks persist

2. Lifestyle Modifications:
   - Maintain regular sleep schedule (7-8 hours)
   - Identify and avoid trigger factors (stress, certain foods)
   - Stay well hydrated (8 glasses water/day)
   - Regular meals, avoid skipping breakfast

3. Pain Management:
   - Use prescribed migraine medication at onset of symptoms
   - Apply cold compress to forehead during attacks
   - Rest in quiet, dark room during episodes

4. Monitoring:
   - Keep headache diary noting frequency, triggers, severity
   - Monitor blood pressure weekly at home
   - Check blood glucose regularly as per diabetic protocol

5. Follow-up:
   - Review in 4 weeks or earlier if symptoms worsen
   - Consider neurology referral if no improvement
   - Return immediately if severe headache with fever, vision changes, or neurological symptoms

6. Patient Education:
   - Discussed migraine triggers and warning signs
   - Provided information leaflet on migraine management
   - Advised to seek emergency care for red flag symptoms`}
        />
        <p className="text-sm text-[#6B7280] mt-2 flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          This will be shared with the patient
        </p>
      </div>

      <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
        <button
          onClick={onCancel}
          className="px-6 py-2.5 bg-white border border-[#D1D5DB] text-[#374151] rounded-lg hover:bg-[#F9FAFB] transition-colors !text-xs"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-6 py-2.5 bg-[#F3F4F6] text-[#374151] rounded-lg hover:bg-[#E5E7EB] transition-colors border border-[#D1D5DB] !text-xs"
        >
          Save
        </button>
        <button
          onClick={onSaveAndContinue}
          className="px-6 py-2.5 bg-[#5164E8] text-white rounded-lg hover:bg-[#4153D6] transition-colors shadow-sm !text-xs"
        >
          Save and Continue
        </button>
      </div>
    </div>
  );
}
