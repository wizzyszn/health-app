import {
  Calendar,
  Video,
  Globe,
  AlarmClock,
  Loader2,
  Phone,
  MessageSquare,
  User,
  Home,
} from "lucide-react";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { BookingFormData } from "@/patient/lib/schemas";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.bubble.css";

interface ConfirmAppointmentProps {
  onNext: () => void;
  onBack: () => void;
  isPending?: boolean;
  isReschedule?: boolean;
}

const MotionButton = motion.create(Button);

const ConfirmAppointment = ({
  onBack,
  onNext,
  isPending,
  isReschedule,
}: ConfirmAppointmentProps) => {
  const { getValues } = useFormContext<BookingFormData>();
  const data = getValues();

  const getConsultationDisplay = (type?: string) => {
    switch (type) {
      case "AUDIO":
        return {
          icon: <Phone size={16} color="#6C6C6C" />,
          label: "Audio Call",
          platform: "Phone Number",
        };
      case "CHAT":
        return {
          icon: <MessageSquare size={16} color="#6C6C6C" />,
          label: "Chat Consultation",
          platform: "In-App Chat",
        };
      case "MEETADOCTOR":
        return {
          icon: <User size={16} color="#6C6C6C" />,
          label: "In-Person Visit",
          platform: "Hospital / Clinic",
        };
      case "HOMESERVICE":
        return {
          icon: <Home size={16} color="#6C6C6C" />,
          label: "Home Service",
          platform: "Patient's Address",
        };
      case "VIDEO":
      default:
        return {
          icon: <Video size={16} color="#6C6C6C" />,
          label: "Video Call",
          platform: "Zoom Meetings",
        };
    }
  };

  const consultationConfig = getConsultationDisplay(data.consultationType);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-5"
    >
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-3 p-4 bg-[#F7F7F7] rounded-lg"
      >
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-amber-100 text-amber-700">
            PA
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {data.doctorName || "Dr. Peace Anthony"}
          </p>
          <p className="text-xs text-muted-foreground">
            {data.doctorSpecialty || "General physician"}
          </p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} color="#6C6C6C" />
          <span className="text-sm text-[#2B2B2B]">
            {data.selectedDate || "May 30, 2025"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <AlarmClock color="#6C6C6C" size={16} />

          <span className="text-sm text-[#2B2B2B]">
            {data.timeSlot || "10:00 PM - 12:00 PM"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {consultationConfig.icon}
          <span className="text-sm text-[#2B2B2B]">
            {consultationConfig.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Globe size={16} color="#6C6C6C" />
          <span className="text-sm text-[#2B2B2B]">
            {consultationConfig.platform}
          </span>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="pt-2">
        <div className="flex items-center gap-2 mb-1">
          <Calendar size={16} color="#6C6C6C" />
          <span className="text-sm font-medium text-[#2B2B2B]">Complaint:</span>
        </div>
        <p className="text-sm text-[#6C6C6C] pl-6 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
          {data.complaint ||
            "General Checkup-Patient reported mild headaches and fatigue"}
        </p>
      </motion.div>

      {data.complaintBrief && (
        <motion.div variants={itemVariants} className="pt-1">
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={16} color="#6C6C6C" />
            <span className="text-sm font-medium text-[#2B2B2B]">
              Complaint Brief:
            </span>
          </div>
          <div className="pl-6 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
            <ReactQuill
              value={data.complaintBrief}
              readOnly
              theme="bubble"
              className="text-sm text-[#6C6C6C] [&_.ql-editor]:p-0"
            />
          </div>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="pt-28">
        <p className="text-sm text-muted-foreground mb-4">
          By clicking {isReschedule ? "reschedule" : "confirm booking"}, you've
          agreed to{" "}
          <span className="text-foreground font-medium">
            MediApp's Consultant's terms
          </span>
        </p>
        <div className="flex gap-3">
          <MotionButton
            variant="ghost"
            className="flex-1 h-12 bg-[#F7F7F7] hover:border-2"
            onClick={onBack}
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Go Back
          </MotionButton>
          <MotionButton
            className="flex-1 h-12"
            onClick={onNext}
            type="button"
            disabled={isPending}
            whileHover={isPending ? {} : { scale: 1.02 }}
            whileTap={isPending ? {} : { scale: 0.98 }}
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isReschedule ? (
              "Reschedule Appointment"
            ) : (
              "Book appointments"
            )}
          </MotionButton>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmAppointment;
