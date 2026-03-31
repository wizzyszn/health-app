import { Check, Circle, CircleEllipsis } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type StepStatus = "completed" | "in-progress" | "pending";

export interface Step {
  id: string;
  label: string;
  status: StepStatus;
}

interface ClinicalStepperProps {
  steps: Step[];
  currentEditingId: string | null;
  onStepEdit: (stepId: string) => void;
}

const StatusIcon = ({ status }: { status: StepStatus }) => {
  if (status === "completed") {
    return (
      <div className="w-6 h-6 shrink-0 bg-[#00825C] rounded-full flex items-center justify-center shadow-sm">
        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
      </div>
    );
  }
  if (status === "in-progress") {
    return (
      <div className="w-6 h-6 shrink-0 bg-[#D97706]/10 rounded-full flex items-center justify-center shadow-sm">
        <CircleEllipsis className="w-4 h-4 text-[#D97706]" strokeWidth={2.5} />
      </div>
    );
  }
  return (
    <div className="w-6 h-6 shrink-0 bg-[#F3F4F6] rounded-full flex items-center justify-center shadow-sm opacity-80 transition-opacity group-hover:opacity-100">
      <Circle className="w-4 h-4 text-[#6B7280]" strokeWidth={2.5} />
    </div>
  );
};

const ClinicalStepper = ({
  steps,
  currentEditingId,
  onStepEdit,
}: ClinicalStepperProps) => {
  return (
    <div className="flex gap-4 p-6 w-full">
      {steps.map((step) => {
        const isEditing = currentEditingId === step.id;
        return (
          <div
            key={step.id}
            onClick={() => onStepEdit(step.id)}
            className={cn(
              "group flex-1 bg-white rounded-xl p-4 flex flex-col relative overflow-hidden shadow-sm border border-[#E5E7EB] transition-all duration-300 cursor-pointer hover:shadow-md hover:-translate-y-0.5",
              (step.status === "completed" || step.status === "in-progress") &&
                "border-l-[4px]",
              step.status === "completed" && "border-l-[#00825C]",
              step.status === "in-progress" && "border-l-[#FFB800]",
              step.status === "pending" &&
                "border-l-[#D1D5DB] hover:border-[#9CA3AF]",
              isEditing &&
                "ring-2 ring-[#5164E8] ring-offset-2 border-transparent shadow-md scale-[1.02] z-10",
            )}
          >
            {/* Soft background glow if editing */}
            {isEditing && (
              <div className="absolute inset-0 bg-gradient-to-br from-[#5164E8]/5 to-transparent pointer-events-none" />
            )}

            <div className="flex items-start justify-between gap-2 relative z-10 mb-3">
              <StatusIcon status={step.status} />
              <Button
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onStepEdit(step.id);
                }}
                className={cn(
                  "shrink-0 text-[8px] font-bold uppercase tracking-widest px-3 rounded-full border h-7 transition-all duration-300",
                  isEditing
                    ? "bg-[#5164E8] text-white hover:bg-[#4153D7] hover:text-white border-[#5164E8] shadow-sm transform scale-105"
                    : "text-[#6B7280] border-transparent bg-transparent hover:bg-[#5164E8]/10 hover:text-[#5164E8] group-hover:border-[#5164E8]/30",
                )}
              >
                {isEditing ? "Editing" : "Edit"}
              </Button>
            </div>

            <div className="flex flex-col mt-auto relative z-10">
              <span
                className={cn(
                  "text-xs xl:text-sm font-semibold leading-snug transition-colors duration-200",
                  isEditing ? "text-[#111827]" : "text-[#4B5563]",
                  step.status === "completed" && "text-[#111827]",
                )}
              >
                {step.label}
              </span>
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wider mt-1",
                  step.status === "completed" && "text-[#00825C]",
                  step.status === "in-progress" && "text-[#D97706]",
                  step.status === "pending" && "text-[#6B7280]",
                )}
              >
                {step.status.replace("-", " ")}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ClinicalStepper;
