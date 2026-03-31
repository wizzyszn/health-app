import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function DiagnosisForm({
  onCancel,
  onSave,
  onSaveAndContinue,
}: {
  onCancel: () => void;
  onSave: () => void;
  onSaveAndContinue: () => void;
}) {
  const [provisionalSearch, setProvisionalSearch] = useState("");
  const [finalSearch, setFinalSearch] = useState("");
  const [showProvisionalDropdown, setShowProvisionalDropdown] = useState(false);
  const [showFinalDropdown, setShowFinalDropdown] = useState(false);

  const icd10Suggestions = [
    { code: "G43.0", name: "Migraine without aura" },
    { code: "G43.1", name: "Migraine with aura" },
    { code: "G44.0", name: "Cluster headache syndrome" },
    { code: "G44.2", name: "Tension-type headache" },
    { code: "R51", name: "Headache" },
    { code: "I10", name: "Essential (primary) hypertension" },
    { code: "E11", name: "Type 2 diabetes mellitus" },
    { code: "J06.9", name: "Acute upper respiratory infection" },
    { code: "R50.9", name: "Fever, unspecified" },
  ];

  const filteredProvisional = icd10Suggestions.filter((item) =>
    provisionalSearch
      ? item.code.toLowerCase().includes(provisionalSearch.toLowerCase()) ||
        item.name.toLowerCase().includes(provisionalSearch.toLowerCase())
      : true,
  );

  const filteredFinal = icd10Suggestions.filter((item) =>
    finalSearch
      ? item.code.toLowerCase().includes(finalSearch.toLowerCase()) ||
        item.name.toLowerCase().includes(finalSearch.toLowerCase())
      : true,
  );

  return (
    <div className="bg-white rounded-lg p-6 space-y-5 shadow-sm border border-[#E5E7EB]">
      <div className="grid grid-cols-2 gap-6">
        {/* Provisional Diagnosis */}
        <div>
          <h3 className="text-sm text-[#1F2937] mb-4">Provisional Diagnosis</h3>

          <div className="space-y-3">
            <div className="relative">
              <Label className="block text-[#374151] mb-2 text-xs">
                Search ICD-10
              </Label>
              <Input
                type="text"
                className="!text-xs"
                placeholder="Type to search ICD-10 codes..."
                value={provisionalSearch}
                onChange={(e) => {
                  setProvisionalSearch(e.target.value);
                  setShowProvisionalDropdown(true);
                }}
                onFocus={() => setShowProvisionalDropdown(true)}
              />

              {showProvisionalDropdown && filteredProvisional.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-[#D1D5DB] rounded-lg shadow-lg max-h-[240px] overflow-y-auto">
                  {filteredProvisional.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 hover:bg-[#F9FAFB] cursor-pointer border-b border-[#E5E7EB] last:border-b-0"
                      onClick={() => {
                        setProvisionalSearch(`${item.code} - ${item.name}`);
                        setShowProvisionalDropdown(false);
                      }}
                    >
                      <div className="text-[#5164E8] text-sm font-medium">
                        {item.code}
                      </div>
                      <div className="text-[#374151]">{item.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label className="block text-[#374151] mb-2 text-xs">
                Free Text Diagnosis
              </Label>
              <Textarea
                className="min-h-[100px] !text-xs"
                defaultValue="Migraine without aura - recurrent episodes with typical features including unilateral throbbing headache, photophobia, and nausea."
              />
            </div>
          </div>
        </div>

        {/* Final Diagnosis */}
        <div>
          <h3 className="text-sm text-[#1F2937] mb-4">Final Diagnosis</h3>

          <div className="space-y-3">
            <div className="relative">
              <Label className="block text-[#374151] mb-2 text-xs">
                Search ICD-10
              </Label>
              <Input
                type="text"
                placeholder="Type to search ICD-10 codes..."
                className=" !text-xs"
                value={finalSearch}
                onChange={(e) => {
                  setFinalSearch(e.target.value);
                  setShowFinalDropdown(true);
                }}
                onFocus={() => setShowFinalDropdown(true)}
              />

              {showFinalDropdown && filteredFinal.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-[#D1D5DB] rounded-lg shadow-lg max-h-[240px] overflow-y-auto">
                  {filteredFinal.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 hover:bg-[#F9FAFB] cursor-pointer border-b border-[#E5E7EB] last:border-b-0"
                      onClick={() => {
                        setFinalSearch(`${item.code} - ${item.name}`);
                        setShowFinalDropdown(false);
                      }}
                    >
                      <div className="text-[#5164E8] text-sm font-medium">
                        {item.code}
                      </div>
                      <div className="text-[#374151]">{item.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label className="block text-[#374151] mb-2 !text-xs">
                Free Text Diagnosis
              </Label>
              <Textarea
                className="min-h-[100px] !text-xs"
                placeholder="Enter final diagnosis details..."
              />
            </div>
          </div>
        </div>
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
