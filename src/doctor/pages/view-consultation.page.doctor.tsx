import { PatientDataSidebar } from "../components/patient-data-sidebar.component.doctor";
import { ConsultationMainContent } from "../components/consultation-space-main-content.component.doctor";

function ViewConsultationDetails() {
  return (
    <div className="flex flex-col h-[calc(100dvh-120px)]">
      {/* Title */}
      <div className="mb-6 shrink-0">
        <h1 className="text-2xl font-semibold text-foreground">
          Consultation Details
        </h1>
      </div>
      <div className="grid grid-cols-4 gap-6 items-start flex-1 min-h-0">
        <div className="col-span-1 sticky top-0 h-full overflow-y-auto">
          <PatientDataSidebar />
        </div>

        <div className="col-span-3 h-full  shadow-sm overflow-hidden bg-white flex flex-col">
          <ConsultationMainContent />
        </div>
      </div>
    </div>
  );
}

export default ViewConsultationDetails;
