import { useState } from "react";
import {
  Calendar,
  Clock,
  Video,
  Monitor,
  Stethoscope,
  Info,
  Headphones,
  MapPin,
  Home,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSingleAppointmentReq,
  cancelAppointmentReq,
} from "@/config/service/patient.service";
import { toast } from "sonner";
import type { RejectedPayload } from "@/lib/types";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.bubble.css";

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
    actionLabel: string;
    actionIcon: typeof Video;
    instructions: string[];
  }
> = {
  VIDEO: {
    label: "Video Call",
    icon: Video,
    platformLabel: "Zoom Meetings",
    platformIcon: Monitor,
    actionLabel: "Join Video Call",
    actionIcon: Video,
    instructions: [
      "Please join the call 5 minutes early",
      "Ensure your camera and microphone are working",
      "Find a quiet, well-lit environment",
      "Have your medical records or prescriptions ready if available",
    ],
  },
  AUDIO: {
    label: "Audio Call",
    icon: Headphones,
    platformLabel: "Phone Call",
    platformIcon: Headphones,
    actionLabel: "Join Audio Call",
    actionIcon: Headphones,
    instructions: [
      "Ensure you are in a quiet environment with good reception",
      "Have your phone fully charged",
      "Keep a pen and paper handy for any notes",
      "Have your medical records ready if available",
    ],
  },
  CHAT: {
    label: "Chat Session",
    icon: Monitor,
    platformLabel: "In-App Chat",
    platformIcon: Monitor,
    actionLabel: "Open Chat",
    actionIcon: Monitor,
    instructions: [
      "Be ready to describe your symptoms clearly via text",
      "Have photos of any visible symptoms ready to share",
      "Keep your medical records accessible for reference",
    ],
  },
  MEETADOCTOR: {
    label: "Meet a Doctor",
    icon: UserRound,
    platformLabel: "In-Person Visit",
    platformIcon: MapPin,
    actionLabel: "Get Directions",
    actionIcon: MapPin,
    instructions: [
      "Arrive at the clinic 15 minutes before your scheduled time",
      "Bring a valid ID and your insurance card",
      "Carry any recent test results or prescriptions",
      "Wear comfortable clothing for examination",
    ],
  },
  HOMESERVICE: {
    label: "Home Service",
    icon: Home,
    platformLabel: "Doctor Visit",
    platformIcon: Home,
    actionLabel: "Confirm Address",
    actionIcon: Home,
    instructions: [
      "Ensure your home address is correct and accessible",
      "Have a clean, well-lit area prepared for examination",
      "Keep a list of current medications ready",
      "Someone should be available to open the door for the doctor",
    ],
  },
};

// ─── Component ──────────────────────────────────────────────────────────────

const AppointmentDetails = () => {
  const params = useParams();
  const queryClient = useQueryClient();
  const consultationId = params.id ?? "";
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["appointment", consultationId],
    queryFn: () => getSingleAppointmentReq(consultationId),
    enabled: !!consultationId,
  });

  const cancelMutation = useMutation({
    mutationFn: () =>
      cancelAppointmentReq(consultationId, { reason: cancelReason }),
    onSuccess: (response) => {
      toast.success(
        response.response_description || "Appointment cancelled successfully.",
      );
      queryClient.invalidateQueries({
        queryKey: ["appointment", consultationId],
      });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      setCancelDialogOpen(false);
      setCancelReason("");
    },
    onError: (error: RejectedPayload) => {
      toast.error(
        error.message || "Failed to cancel appointment. Please try again.",
      );
    },
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
          Failed to load appointment details.
        </p>
      </div>
    );
  }

  const appointment = data.data;
  const startDate = new Date(appointment.scheduled_start_at_utc);
  const endDate = new Date(appointment.scheduled_end_at_utc);

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  const consultationType =
    (appointment.consultation_id?.type as ConsultationType) || "VIDEO";
  const config = CONSULTATION_CONFIG[consultationType];
  const TypeIcon = config.icon;
  const PlatformIcon = config.platformIcon;
  const ActionIcon = config.actionIcon;

  return (
    <div className="p-6">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">
          Appointment Details
        </h1>
        <p className="text-sm text-[#6C6C6C] mt-1">
          Reference ID: {appointment.appointment_number}
        </p>
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-6">
        {/* Main content card */}
        <div className="bg-card rounded-[20px] border border-border p-6 min-w-0">
          {/* Doctor info */}
          <div className="flex items-center gap-3 mb-6 p-4 bg-[#F7F7F7] rounded-lg">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${appointment.doctor_id?.first_name || "Doctor"}`}
                alt={appointment.doctor_id?.full_name || "Doctor"}
                className="w-10 h-10 rounded-full"
              />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">
                {appointment.doctor_id?.full_name || "Doctor"}
              </p>
              <p className="text-xs text-[#828282]">
                {appointment.doctor_id?.specializations?.[0] ||
                  "General physician"}
              </p>
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

          {/* Reason for Visit */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Stethoscope className="w-4 h-4" color="#6C6C6C" />
              <span className="text-sm font-semibold text-foreground">
                Reason for Visit
              </span>
            </div>
            <div className="ml-6 rounded-lg border border-border bg-[#F7F7F7] overflow-hidden">
              <ReactQuill
                value={appointment.reason_for_visit || "No reason provided"}
                readOnly
                theme="bubble"
                modules={{ toolbar: false }}
              />
            </div>
          </div>

          {/* Instructions — dynamic per consultation type */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4" color="#6C6C6C" />
              <span className="text-sm font-semibold text-foreground">
                Instructions
              </span>
            </div>
            <ul className="space-y-2 ml-6">
              {config.instructions.map((instruction, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  {instruction}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actions panel */}
        <div>
          <div className="bg-card rounded-xl border border-border p-5 sticky top-6">
            <h3 className="text-sm font-semibold text-[#727171] mb-4">
              Actions
            </h3>
            <div className="space-y-3 flex flex-col">
              <Button
                size="default"
                className="gap-2 rounded-[12px] h-12"
                disabled={
                  appointment.status !== "CONFIRMED" &&
                  appointment.status !== "ACTIVE"
                }
              >
                <ActionIcon className="w-4 h-4" />
                {config.actionLabel}
              </Button>
              {appointment.status != "RESCHEDULED" && (
                <Button size="default" className="gap-2 rounded-[12px] h-12">
                  <Calendar className="w-4 h-4" />
                  Reschedule
                </Button>
              )}

              <Button
                variant="destructive"
                size="default"
                className="rounded-[12px] h-12 bg-[#FFECEB] text-[#D92D20] hover:text-white"
                onClick={() => setCancelDialogOpen(true)}
                disabled={
                  appointment.status === "CANCELED" ||
                  appointment.status === "COMPLETED"
                }
              >
                Cancel Appointment
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            <Textarea
              placeholder="Please provide a reason for cancellation..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setCancelDialogOpen(false);
                setCancelReason("");
              }}
              className="rounded-[12px]"
            >
              Go Back
            </Button>
            <Button
              variant="destructive"
              onClick={() => cancelMutation.mutate()}
              disabled={!cancelReason.trim() || cancelMutation.isPending}
              className="rounded-[12px] bg-[#D92D20] hover:bg-[#B42318]"
            >
              {cancelMutation.isPending
                ? "Cancelling..."
                : "Confirm Cancellation"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentDetails;
