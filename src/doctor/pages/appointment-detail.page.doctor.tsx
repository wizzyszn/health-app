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
  // CheckCircle,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSingleDoctorAppointmentReq,
  // acceptAppointmentReq,
  cancelDoctorAppointmentReq,
  rescheduleDoctorAppointmentReq,
  // completeAppointmentReq,
  // noShowAppointmentReq,
} from "@/config/service/doctor.service";
import { toast } from "sonner";
import type { RejectedPayload } from "@/lib/types";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.bubble.css";
// import { AppointmentStatusBadge } from "../components/appointment-status-badge.component.doctor";
// import { ConsultationStatusBadge } from "../components/consultation-status-badge.component.doctor";
// import type {
//   AppointmentStatus,
//   ConsultationStatus,
// } from "../types/consultation.types";

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
      "Have the patient's records open and ready for reference",
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
      "Have the patient's history and records ready",
      "Keep a pen and paper handy for any notes",
      "Confirm the patient's identity before proceeding",
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
      "Review the patient's history before starting the chat",
      "Ask clarifying questions about symptoms",
      "Request photos of visible symptoms if applicable",
      "Provide clear written instructions for follow-up",
    ],
  },
  MEETADOCTOR: {
    label: "Meet a Doctor",
    icon: UserRound,
    platformLabel: "In-Person Visit",
    platformIcon: MapPin,
    actionLabel: "View Location",
    actionIcon: MapPin,
    instructions: [
      "Prepare examination room before the patient arrives",
      "Review the patient's history and previous records",
      "Ensure all necessary equipment is sterilised and ready",
      "Have referral and prescription forms available",
    ],
  },
  HOMESERVICE: {
    label: "Home Service",
    icon: Home,
    platformLabel: "Home Visit",
    platformIcon: Home,
    actionLabel: "View Address",
    actionIcon: Home,
    instructions: [
      "Confirm the patient's home address before departure",
      "Pack all necessary examination equipment",
      "Carry prescription pads and referral forms",
      "Contact the patient if you will be delayed",
    ],
  },
};

const DURATION_OPTIONS: { label: string; value: 15 | 30 | 45 | 60 }[] = [
  { label: "15 minutes", value: 15 },
  { label: "30 minutes", value: 30 },
  { label: "45 minutes", value: 45 },
  { label: "60 minutes", value: 60 },
];

// ─── Component ──────────────────────────────────────────────────────────────

function DoctorAppointmentDetails() {
  const params = useParams();
  const queryClient = useQueryClient();
  const appointmentId = params.id ?? "";

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [rescheduleDuration, setRescheduleDuration] = useState<
    15 | 30 | 45 | 60
  >(30);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["doctor-appointment", appointmentId],
    queryFn: () => getSingleDoctorAppointmentReq(appointmentId),
    enabled: !!appointmentId,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["doctor-appointment", appointmentId],
    });
    queryClient.invalidateQueries({ queryKey: ["schedules"] });
  };

  // const acceptMutation = useMutation({
  //   mutationFn: () => acceptAppointmentReq(appointmentId),
  //   onSuccess: (response) => {
  //     toast.success(
  //       response.response_description || "Appointment accepted successfully.",
  //     );
  //     invalidate();
  //   },
  //   onError: (error: RejectedPayload) => {
  //     toast.error(error.message || "Failed to accept appointment.");
  //   },
  // });

  const cancelMutation = useMutation({
    mutationFn: () =>
      cancelDoctorAppointmentReq(appointmentId, { reason: cancelReason }),
    onSuccess: (response) => {
      toast.success(
        response.response_description || "Appointment cancelled successfully.",
      );
      invalidate();
      setCancelDialogOpen(false);
      setCancelReason("");
    },
    onError: (error: RejectedPayload) => {
      toast.error(error.message || "Failed to cancel appointment.");
    },
  });

  const rescheduleMutation = useMutation({
    mutationFn: () => {
      const localDateTimeStr = `${rescheduleDate}T${rescheduleTime}:00`;
      const scheduled_start_at_utc = new Date(localDateTimeStr).toISOString();
      return rescheduleDoctorAppointmentReq(appointmentId, {
        scheduled_start_at_utc,
        requested_duration_minutes: rescheduleDuration,
      });
    },
    onSuccess: (response) => {
      toast.success(
        response.response_description ||
          "Appointment rescheduled successfully.",
      );
      invalidate();
      setRescheduleDialogOpen(false);
      setRescheduleDate("");
      setRescheduleTime("");
      setRescheduleDuration(30);
    },
    onError: (error: RejectedPayload) => {
      toast.error(error.message || "Failed to reschedule appointment.");
    },
  });

  // const completeMutation = useMutation({
  //   mutationFn: () => completeAppointmentReq(appointmentId),
  //   onSuccess: (response) => {
  //     toast.success(
  //       response.response_description || "Appointment marked as completed.",
  //     );
  //     invalidate();
  //   },
  //   onError: (error: RejectedPayload) => {
  //     toast.error(error.message || "Failed to complete appointment.");
  //   },
  // });

  // const noShowMutation = useMutation({
  //   mutationFn: () => noShowAppointmentReq(appointmentId),
  //   onSuccess: (response) => {
  //     toast.success(response.response_description || "Marked as no-show.");
  //     invalidate();
  //   },
  //   onError: (error: RejectedPayload) => {
  //     toast.error(error.message || "Failed to mark as no-show.");
  //   },
  // });

  // ─── Loading / Error states ─────────────────────────────────────────

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

  const patientName = appointment.booking_profile_snapshot
    ? `${appointment.booking_profile_snapshot.first_name} ${appointment.booking_profile_snapshot.last_name}`
    : "Patient";

  const consultationType =
    (appointment.consultation_id?.type as ConsultationType) || "VIDEO";
  const config = CONSULTATION_CONFIG[consultationType];
  const TypeIcon = config.icon;
  const PlatformIcon = config.platformIcon;
  const ActionIcon = config.actionIcon;

  // ─── Button state logic ─────────────────────────────────────────────

  const appointmentStatus = appointment.status;
  // const consultationStatus = appointment.consultation_id?.status;

  const isAppointmentCancelled = appointmentStatus === "CANCELED";
  const isCompleted = appointmentStatus === "COMPLETED";
  // const isAlreadyAccepted =
  //   appointmentStatus === "CONFIRMED" ||
  //   appointmentStatus === "ACTIVE" ||
  //   appointmentStatus === "COMPLETED";

  const canJoin =
    appointmentStatus === "CONFIRMED" || appointmentStatus === "ACTIVE";

  const isTerminal = isAppointmentCancelled || isCompleted;

  const canReschedule = !isTerminal && rescheduleDate && rescheduleTime;

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
          {/* Patient info */}
          <div className="flex items-center gap-3 mb-6 p-4 bg-[#F7F7F7] rounded-lg">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${appointment.booking_profile_snapshot?.first_name || "Patient"}`}
                alt={patientName}
                className="w-10 h-10 rounded-full"
              />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">
                {patientName}
              </p>
              <p className="text-xs text-[#828282]">
                {appointment.booking_profile_snapshot?.occupation || "Patient"}
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

          {/* Patient snapshot details */}
          {appointment.booking_profile_snapshot && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <UserRound className="w-4 h-4" color="#6C6C6C" />
                <span className="text-sm font-semibold text-foreground">
                  Patient Information
                </span>
              </div>
              <div className="ml-6 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Gender:</span>{" "}
                  <span className="text-foreground capitalize">
                    {appointment.booking_profile_snapshot.gender || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">DOB:</span>{" "}
                  <span className="text-foreground">
                    {appointment.booking_profile_snapshot.date_of_birth
                      ? new Date(
                          appointment.booking_profile_snapshot.date_of_birth,
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Marital Status:</span>{" "}
                  <span className="text-foreground capitalize">
                    {appointment.booking_profile_snapshot.marital_status || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Occupation:</span>{" "}
                  <span className="text-foreground">
                    {appointment.booking_profile_snapshot.occupation || "—"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Present Complaint */}
          {appointment.booking_profile_snapshot?.present_complaint && (
            <>
              <div className="border-t border-border mb-6" />
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4" color="#6C6C6C" />
                  <span className="text-sm font-semibold text-foreground">
                    Present Complaint
                  </span>
                </div>
                <p className="ml-6 text-sm text-muted-foreground">
                  {appointment.booking_profile_snapshot.present_complaint}
                </p>
              </div>
            </>
          )}

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

          {/* Instructions */}
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

            {/* Status badges */}
            {/* <div className="mb-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-24 shrink-0">
                  Appointment
                </span>
                <AppointmentStatusBadge
                  status={appointmentStatus as AppointmentStatus}
                />
              </div>
              {consultationStatus && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-24 shrink-0">
                    Consultation
                  </span>
                  <ConsultationStatusBadge
                    status={consultationStatus as ConsultationStatus}
                  />
                </div>
              )}
            </div> */}

            <div className="space-y-3 flex flex-col">
              {/* Accept */}
              {/* <Button
                size="default"
                className="gap-2 rounded-[12px] h-12 bg-[#0BAB4E] hover:bg-[#099040] text-white"
                onClick={() => acceptMutation.mutate()}
                disabled={
                  isAlreadyAccepted || isTerminal || acceptMutation.isPending
                }
              >
                <CheckCircle className="w-4 h-4" />
                {acceptMutation.isPending
                  ? "Accepting..."
                  : isAlreadyAccepted
                    ? "Appointment Accepted"
                    : "Accept Appointment"}
              </Button> */}

              {/* Join */}
              <Button
                size="default"
                className="gap-2 rounded-[12px] h-12"
                disabled={!canJoin}
              >
                <ActionIcon className="w-4 h-4" />
                {config.actionLabel}
              </Button>

              {/* Complete */}
              {/* <Button
                size="default"
                variant="ghost"
                className="gap-2 rounded-[12px] h-12 bg-[#E5F2EA] text-[#0BAB4E] hover:bg-[#d4eddc]"
                onClick={() => completeMutation.mutate()}
                disabled={!canJoin || isTerminal || completeMutation.isPending}
              >
                <CheckCircle className="w-4 h-4" />
                {completeMutation.isPending
                  ? "Completing..."
                  : "Mark as Completed"}
              </Button> */}

              {/* No Show */}
              {/* <Button
                size="default"
                variant="ghost"
                className="gap-2 rounded-[12px] h-12 bg-[#FFF4E5] text-[#B76E00] hover:bg-[#ffe8cc]"
                onClick={() => noShowMutation.mutate()}
                disabled={isTerminal || noShowMutation.isPending}
              >
                <UserRound className="w-4 h-4" />
                {noShowMutation.isPending ? "Marking..." : "Mark as No-Show"}
              </Button> */}

              {/* Reschedule */}
              {/* <Button
                size="default"
                variant="ghost"
                className="gap-2 rounded-[12px] h-12 bg-[#F7F7F7] text-[#2B2B2B]"
                onClick={() => setRescheduleDialogOpen(true)}
                disabled={isTerminal}
              >
                <Calendar className="w-4 h-4" />
                Reschedule
              </Button> */}

              {/* Cancel */}
              <Button
                variant="destructive"
                size="default"
                className="rounded-[12px] h-12 bg-[#FFECEB] text-[#D92D20] hover:text-white"
                onClick={() => setCancelDialogOpen(true)}
                disabled={isTerminal}
              >
                {isAppointmentCancelled
                  ? "Appointment Cancelled"
                  : "Cancel Appointment"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Cancel Dialog ── */}
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

      {/* ── Reschedule Dialog ── */}
      <Dialog
        open={rescheduleDialogOpen}
        onOpenChange={setRescheduleDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>
              Select a new date, time and duration for this appointment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="reschedule-date">New Date</Label>
              <Input
                id="reschedule-date"
                type="date"
                value={rescheduleDate}
                onChange={(e) => setRescheduleDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reschedule-time">New Time</Label>
              <Input
                id="reschedule-time"
                type="time"
                value={rescheduleTime}
                onChange={(e) => setRescheduleTime(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Duration</Label>
              <div className="grid grid-cols-4 gap-2">
                {DURATION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRescheduleDuration(opt.value)}
                    className={`rounded-[10px] border py-2 text-sm font-medium transition-colors ${
                      rescheduleDuration === opt.value
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-[#F7F7F7] text-foreground hover:border-primary"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setRescheduleDialogOpen(false);
                setRescheduleDate("");
                setRescheduleTime("");
                setRescheduleDuration(30);
              }}
              className="rounded-[12px]"
            >
              Go Back
            </Button>
            <Button
              onClick={() => rescheduleMutation.mutate()}
              disabled={!canReschedule || rescheduleMutation.isPending}
              className="rounded-[12px]"
            >
              {rescheduleMutation.isPending
                ? "Rescheduling..."
                : "Confirm Reschedule"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DoctorAppointmentDetails;
