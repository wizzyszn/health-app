import { useState } from "react";
import { FileText, TestTube, Pill, Send, CheckCircle2Icon } from "lucide-react";

import { InvestigationModal } from "./modal/investigation.modal.component.doctor";
import { MedicationModal } from "./modal/medication1.modal.component.doctor";
import { ReferralModal } from "./modal/referral.modal.component.doctor";
import { RebookModal } from "./modal/rebook.modal.component.doctor";
import { InvestigationResultsForm } from "./forms/investigations-result.form.component";
import { PhysicalExamForm } from "./forms/physical-exam.form.component.doctor";
import { DiagnosisForm } from "./forms/diagnosis.form.component.doctor";
import { TreatmentPlanForm } from "./forms/treatment-plan.form.component.doctor";
import { HistoryTakingForm } from "./forms/history-taking.form.component.doctor";
import ClinicalStepper from "./clinical-stepper.component.doctor";

interface TabState {
  id: string;
  label: string;
  status: "completed" | "in-progress" | "pending";
}

const tabs: TabState[] = [
  { id: "history", label: "History", status: "completed" },
  { id: "physical", label: "Physical", status: "in-progress" },
  { id: "investigation", label: "Investigation", status: "pending" },
  { id: "diagnosis", label: "Diagnosis", status: "pending" },
  { id: "treatment", label: "Treatment Plan", status: "pending" },
];

export function ConsultationMainContent() {
  const [editingTab, setEditingTab] = useState<string | null>("history");
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleTabEdit = (tabId: string) => {
    setEditingTab(editingTab === tabId ? null : tabId);
  };

  const handleSave = () => {
    setEditingTab(null);
  };

  const handleSaveAndContinue = () => {
    setEditingTab(null);
    // Logic to move to next tab
  };

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-20 shadow-sm">
        <ClinicalStepper
          steps={tabs}
          currentEditingId={editingTab}
          onStepEdit={handleTabEdit}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {editingTab === "history" && (
          <HistoryTakingForm
            onCancel={() => setEditingTab(null)}
            onSave={handleSave}
            onSaveAndContinue={handleSaveAndContinue}
          />
        )}

        {editingTab === "physical" && (
          <PhysicalExamForm
            onCancel={() => setEditingTab(null)}
            onSave={handleSave}
            onSaveAndContinue={handleSaveAndContinue}
          />
        )}

        {editingTab === "investigation" && (
          <InvestigationResultsForm
            onCancel={() => setEditingTab(null)}
            onSave={handleSave}
            onSaveAndContinue={handleSaveAndContinue}
          />
        )}

        {editingTab === "diagnosis" && (
          <DiagnosisForm
            onCancel={() => setEditingTab(null)}
            onSave={handleSave}
            onSaveAndContinue={handleSaveAndContinue}
          />
        )}

        {editingTab === "treatment" && (
          <TreatmentPlanForm
            onCancel={() => setEditingTab(null)}
            onSave={handleSave}
            onSaveAndContinue={handleSaveAndContinue}
          />
        )}

        {!editingTab && (
          <div className="text-center text-[#6B7280] py-12">
            <p>
              Select a tab above and click Edit to view and modify consultation
              details
            </p>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-auto bg-white border-t border-[#E5E7EB] p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 shrink-0">
        <div className="grid grid-cols-5 gap-4 w-full">
          <button
            onClick={() => setActiveModal("investigation")}
            className="flex items-center justify-center gap-3 p-4 bg-[#5164E8] text-white rounded-lg hover:bg-[#4153D7] transition-colors shadow-sm text-xs"
          >
            <TestTube className="w-4 h-4" />
            <span>Investigation</span>
          </button>
          <button
            onClick={() => setActiveModal("medication")}
            className="flex items-center justify-center gap-3 p-4 bg-[#5164E8] text-white rounded-lg hover:bg-[#4153D7] transition-colors shadow-sm text-xs"
          >
            <Pill className="w-4 h-4" />
            <span>Medication</span>
          </button>
          <button
            onClick={() => setActiveModal("referral")}
            className="flex items-center justify-center gap-3 p-4 bg-[#5164E8] text-white rounded-lg hover:bg-[#4153D7] transition-colors shadow-sm text-xs"
          >
            <Send className="w-4 h-4" />
            <span>Referral</span>
          </button>
          <button
            onClick={() => setActiveModal("rebook")}
            className="flex items-center justify-center gap-3 p-4 bg-[#5164E8] text-white rounded-lg hover:bg-[#4153D7] transition-colors shadow-sm text-xs"
          >
            <FileText className="w-4 h-4" />
            <span>Rebook</span>
          </button>
          <button
            onClick={() => setActiveModal("rebook")}
            className="flex items-center justify-center gap-3 p-4 bg-[#5164E8] text-white rounded-lg hover:bg-[#4153D7] transition-colors shadow-sm text-xs"
          >
            <CheckCircle2Icon className="w-4 h-4" />
            <span>Completed</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      {activeModal === "investigation" && (
        <InvestigationModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "medication" && (
        <MedicationModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "referral" && (
        <ReferralModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "rebook" && (
        <RebookModal onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}
