import {
  Calendar,
  Clock,
  Video,
  Monitor,
  Headphones,
  MapPin,
  Home,
  UserRound,
  Stethoscope,
  Activity,
  Pill,
  FileText,
  CalendarClock,
  ChevronRight,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAConsultation } from "@/config/service/patient.service";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.bubble.css";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// ─── Consultation type config ───────────────────────────────────────────────

type ConsultationType =
  | "VIDEO"
  | "CHAT"
  | "AUDIO"
  | "MEETADOCTOR"
  | "HOMESERVICE";

const CONSULTATION_CONFIG: Record<
  ConsultationType,
  {
    label: string;
    icon: typeof Video;
    platformLabel: string;
    platformIcon: typeof Monitor;
  }
> = {
  VIDEO: {
    label: "Video Call",
    icon: Video,
    platformLabel: "Zoom Meetings",
    platformIcon: Monitor,
  },
  AUDIO: {
    label: "Audio Call",
    icon: Headphones,
    platformLabel: "Phone Call",
    platformIcon: Headphones,
  },
  CHAT: {
    label: "Chat Session",
    icon: Monitor,
    platformLabel: "In-App Chat",
    platformIcon: Monitor,
  },
  MEETADOCTOR: {
    label: "Meet a Doctor",
    icon: UserRound,
    platformLabel: "In-Person Visit",
    platformIcon: MapPin,
  },
  HOMESERVICE: {
    label: "Home Service",
    icon: Home,
    platformLabel: "Doctor Visit",
    platformIcon: Home,
  },
};

// ─── Component ──────────────────────────────────────────────────────────────

function ViewConsultationDetails() {
  const params = useParams();
  const consultationId = params.id ?? "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["consultation", consultationId],
    queryFn: () => getAConsultation(consultationId),
    enabled: !!consultationId,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6 h-12 w-1/3 bg-muted animate-pulse rounded-lg" />
        <div className="grid grid-cols-[1fr_280px] gap-6">
          <div className="bg-card rounded-[20px] border border-border p-6 h-[400px] animate-pulse" />
          <div className="h-[250px] bg-card rounded-xl border border-border animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[300px]">
        <p className="text-muted-foreground">
          Failed to load consultation details.
        </p>
      </div>
    );
  }

  const consultation = data.data;
  const startDate = new Date(
    consultation.appointment_id?.scheduled_start_at_utc ||
      consultation.createdAt,
  );
  const endDate = new Date(
    consultation.appointment_id?.scheduled_end_at_utc || consultation.createdAt,
  );

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  const consultationType = (consultation.type as ConsultationType) || "VIDEO";
  const config = CONSULTATION_CONFIG[consultationType];
  const TypeIcon = config.icon;
  const PlatformIcon = config.platformIcon;

  return (
    <div className="p-6">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Consultation Details
        </h1>
        <p className="text-sm text-[#6C6C6C] mt-1">
          Reference ID:{" "}
          {consultation.appointment_id?.appointment_number ||
            consultation.consultation_id}
        </p>
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-6">
        {/* Main content card */}
        <div className="bg-card rounded-[20px] border border-border p-6 min-w-0">
          {/* Doctor info */}
          <div className="mb-6 p-5 bg-[#F7F7F7] rounded-xl border border-border/50">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${consultation.doctor_id?.first_name || "Doctor"}`}
                  alt={consultation.doctor_id?.full_name || "Doctor"}
                  className="w-12 h-12 rounded-full"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground text-base">
                    {consultation.doctor_id?.full_name || "Doctor"}
                  </h3>
                </div>
                <p className="text-sm text-primary font-medium mt-0.5">
                  {consultation.doctor_id?.specializations?.join(", ") ||
                    "General physician"}
                </p>
              </div>
            </div>
          </div>

          {/* Date & Time row */}
          <div className="flex gap-12 mb-5">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4" color="#6C6C6C" />
              <span className="text-sm text-foreground">
                {startDate.toLocaleString("default", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4" color="#6C6C6C" />
              <span className="text-sm text-foreground">
                {formatTime(startDate)} - {formatTime(endDate)}
              </span>
            </div>
          </div>

          {/* Consultation type row */}
          <div className="flex gap-12 mb-8">
            <div className="flex items-center gap-2.5">
              <TypeIcon className="w-4 h-4" color="#6C6C6C" />
              <span className="text-sm text-foreground">{config.label}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <PlatformIcon className="w-4 h-4" color="#6C6C6C" />
              <span className="text-sm text-foreground">
                {config.platformLabel}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border mb-6" />

          {/* Reason for Visit (from Appointment) */}
          {consultation.appointment_id?.reason_for_visit && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Stethoscope className="w-4 h-4" color="#6C6C6C" />
                <span className="text-sm font-semibold text-foreground">
                  Reason for Visit (Patient)
                </span>
              </div>
              <div className="ml-6 rounded-lg border border-border bg-[#F7F7F7] overflow-hidden">
                <ReactQuill
                  value={consultation.appointment_id.reason_for_visit}
                  readOnly
                  theme="bubble"
                  modules={{ toolbar: false }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Side panel: Action Items & Insights */}
        <div>
          <div className="bg-card rounded-xl border border-border p-5 sticky top-6">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-5">
              <Activity className="w-4 h-4 text-primary" />
              Next Steps & Insights
            </h3>

            <div className="space-y-4">
              {/* Prescriptions */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer border border-primary/10">
                <div className="bg-primary/20 p-2 rounded-full shrink-0">
                  <Pill className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground">
                    Pick up prescription
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    Amoxicillin 500mg - 2 times daily
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground self-center" />
              </div>

              {/* Document upload */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#F7F7F7] hover:bg-[#EAEAEA] transition-colors cursor-pointer border border-border">
                <div className="bg-background p-2 rounded-full shrink-0 shadow-sm border border-border/50">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground">
                    Upload Lab Results
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Blood test results from Central Lab
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground self-center" />
              </div>

              {/* Follow-up */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#F7F7F7] hover:bg-[#EAEAEA] transition-colors cursor-pointer border border-border">
                <div className="bg-background p-2 rounded-full shrink-0 shadow-sm border border-border/50">
                  <CalendarClock className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground">
                    Schedule Follow-up
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    In 2 weeks for review
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground self-center" />
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground">
                  Recovery Progress
                </span>
                <span className="text-xs font-bold text-primary">75%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: "75%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full rounded-xl bg-white shadow-sm border border-border mt-6">
        <Tabs defaultValue="investigation">
          <div className="flex items-center justify-between px-4">
            <TabsList className="h-auto gap-0 rounded-none bg-transparent p-0 overflow-x-auto">
              <TabsTrigger
                value="investigation"
                className="rounded-none border-b-[3px] border-transparent px-4 py-3 text-sm font-medium shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Investigation
              </TabsTrigger>
              <TabsTrigger
                value="medication"
                className="rounded-none border-b-[3px] border-transparent px-4 py-3 text-sm font-medium shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Medication
              </TabsTrigger>
              <TabsTrigger
                value="referrals"
                className="rounded-none border-b-[3px] border-transparent px-4 py-3 text-sm font-medium shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Referrals
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="py-[12px] px-[16px]">
            <TabsContent value="investigation" className="mt-0">
              <div className="py-8 text-center text-sm text-muted-foreground">
                No investigation data found.
              </div>
            </TabsContent>
            <TabsContent value="medication" className="mt-0">
              <div className="py-8 text-center text-sm text-muted-foreground">
                No medication data found.
              </div>
            </TabsContent>
            <TabsContent value="referrals" className="mt-0">
              <div className="py-8 text-center text-sm text-muted-foreground">
                No referrals found.
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export default ViewConsultationDetails;
