import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoveLeft } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import AppointmentConfirmed from "../booking/appointment-confirmed.booking.component.patient";
import StepSidebar from "../booking/step-sidebar.booking.component.patient";
import PersonalDetails from "../booking/personal-details.booking.component.patient";
import FindDoctor from "../booking/find-doctor.booking.component.patient";
import ChooseTimeSlot from "../booking/choose-time-slot.booking.component.patient";
// import ChoosePayment from "../booking/choose-payment.booking.component.patient";
import ConfirmAppointment from "../booking/confirm-appointment.booking.component.patient";
import useUrlSearchParams from "@/shared/hooks/use-url-search-params";
import { Storages } from "@/lib/helpers";
import {
  StorageKeysEnum,
  type Patient,
  type RejectedPayload,
} from "@/lib/types";
import {
  bookAnAppointmentReq,
  getSingleAppointmentReq,
  rescheduleAppointment,
} from "@/config/service/patient.service";
import type { AuthState } from "@/config/stores/slices/auth.slice";
import type { RootState } from "@/config/stores/store";
import {
  bookingSchema,
  BookingFormData,
  STEP_FIELDS,
} from "@/patient/lib/schemas";

const STEP_TITLES = [
  "Personal Details",
  "Choose a time slot",
  "Find a Doctor",
  // "Select Payment Method",
  "Confirm Appointment",
];

const DEFAULT_VALUES: BookingFormData = {
  firstName: "",
  lastName: "",
  dobDay: "",
  dobMonth: "",
  dobYear: "",
  gender: "",
  maritalStatus: "",
  occupation: "",
  complaint: "",
  complaintBrief: "",
  medicalConditions: [],
  allergies: [],
  doctorId: "",
  doctorName: "",
  doctorSpecialty: "",
  consultationType: "VIDEO",
  selectedDate: "",
  timeSlot: "",
};

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Parse the human-readable time-slot string (e.g. "9:00 AM - 10:00 AM")
 * into { startHour, startMinute, durationMinutes }.
 */
const parseTimeSlot = (slot: string) => {
  const parts = slot.split(" - ");
  if (parts.length !== 2)
    return {
      startHour: 9,
      startMinute: 0,
      durationMinutes: 30 as 15 | 30 | 45 | 60,
    };

  const parseTime = (t: string) => {
    const [time, meridian] = t.trim().split(" ");
    // eslint-disable-next-line prefer-const
    let [hours, minutes] = time.split(":").map(Number);
    if (meridian?.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (meridian?.toUpperCase() === "AM" && hours === 12) hours = 0;
    return { hours, minutes };
  };

  const start = parseTime(parts[0]);
  const end = parseTime(parts[1]);
  const durationMinutes =
    end.hours * 60 + end.minutes - (start.hours * 60 + start.minutes);

  // Clamp to the allowed enum values
  const clamp = (m: number): 15 | 30 | 45 | 60 => {
    if (m <= 15) return 15;
    if (m <= 30) return 30;
    if (m <= 45) return 45;
    return 60;
  };

  return {
    startHour: start.hours,
    startMinute: start.minutes,
    durationMinutes: clamp(durationMinutes),
  };
};

// ─── Transform fetched appointment into BookingFormData ─────────────────────
const MONTHS_LIST = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const appointmentToFormData = (
  raw: Awaited<ReturnType<typeof getSingleAppointmentReq>>,
): BookingFormData => {
  const data = raw.data;

  const startDate = new Date(data.scheduled_start_at_utc);
  const endDate = new Date(data.scheduled_end_at_utc);

  const selectedDate = `${startDate.getDate()} ${startDate.toLocaleString("default", { month: "long" })} ${startDate.getFullYear()}`;

  const fmt = (d: Date) => {
    let h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  };

  const timeSlot = `${fmt(startDate)} - ${fmt(endDate)}`;
  const dobParts = data.booking_profile_snapshot?.date_of_birth
    ?.split("T")[0]
    ?.split("-") || ["", "", ""];

  const parsedDay = parseInt(dobParts[2] || "", 10);
  const dobDay = isNaN(parsedDay) ? "" : parsedDay.toString();

  const parsedMonth = parseInt(dobParts[1] || "", 10);
  const dobMonth =
    isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12
      ? ""
      : MONTHS_LIST[parsedMonth - 1];

  return {
    firstName: data.booking_profile_snapshot?.first_name || "",
    lastName: data.booking_profile_snapshot?.last_name || "",
    dobYear: dobParts[0] || "",
    dobMonth,
    dobDay,
    gender: data.booking_profile_snapshot?.gender || "",
    maritalStatus: data.booking_profile_snapshot?.marital_status || "",
    occupation: data.booking_profile_snapshot?.occupation || "",
    complaint: data.reason_for_visit || "",
    complaintBrief: "",
    medicalConditions: [],
    allergies: [],
    doctorId: data.doctor_id?._id || "",
    doctorName: data.doctor_id?.full_name || "",
    doctorSpecialty: data.doctor_id?.specializations?.[0] || "",
    consultationType: data.consultation_id?.type || "VIDEO",
    selectedDate,
    timeSlot,
  };
};

/** Build the API payload from the form data */
const buildPayload = (data: BookingFormData) => {
  // Build date_of_birth as YYYY-MM-DD
  const dob = `${data.dobYear}-${data.dobMonth.padStart(2, "0")}-${data.dobDay.padStart(2, "0")}`;
  // //  const dobDate = new Date(
  //     Date.UTC(
  //       parseInt(data.dobYear),
  //       parseInt(data.dobMonth) - 1,
  //       parseInt(data.dobDay)
  //     )
  //   );
  //   const dob = dobDate.toISOString();

  // Build scheduled_start_at_utc from selectedDate + timeSlot
  const { startHour, startMinute, durationMinutes } = parseTimeSlot(
    data.timeSlot,
  );

  // Parse the selected date — stored as "16 March 2026" format
  // We must construct the date entirely in UTC to avoid local-timezone offsets.
  // new Date(string) + setHours() mixes UTC parsing with local-time mutation,
  // which shifts the result by the user's UTC offset.
  const dateParts = new Date(data.selectedDate);
  const scheduled = new Date(
    Date.UTC(
      dateParts.getFullYear(),
      dateParts.getMonth(),
      dateParts.getDate(),
      startHour,
      startMinute,
      0,
      0,
    ),
  );

  return {
    first_name: data.firstName,
    last_name: data.lastName,
    date_of_birth: dob,
    gender: data.gender,
    marital_status: data.maritalStatus,
    occupation: data.occupation,
    present_complaint: data.complaint,
    complaint_brief: data.complaintBrief || undefined,
    Medical_conditions: data.medicalConditions?.length
      ? data.medicalConditions
      : undefined,
    allergies: data.allergies?.length ? data.allergies : undefined,
    doctor_id: data.doctorId,
    scheduled_start_at_utc: scheduled.toISOString(),
    requested_duration_minutes: durationMinutes,
    reason_for_visit: data.complaint,
    confirm_appointment: true as const,
    consultation_type: data.consultationType as
      | "VIDEO"
      | "CHAT"
      | "AUDIO"
      | "MEETADOCTOR"
      | "HOMESERVICE",
  };
};

// ─── Response type from the API ─────────────────────────────────────────────
export type BookingResponse = {
  _id: string;
  appointment_number: string;
  patient_id: string;
  doctor_id: string;
  scheduled_start_at_utc: string;
  scheduled_end_at_utc: string;
  timezone_snapshot: string;
  status: string;
  reason_for_visit: string;
  booking_profile_snapshot: {
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    marital_status: string;
    occupation: string;
    present_complaint: string;
  };
};

// ─── Component ──────────────────────────────────────────────────────────────

const Booking = () => {
  const { getParam, updateParam, deleteParam } = useUrlSearchParams();
  const queryClient = useQueryClient();
  const urlStep = parseInt(getParam("step") || "0", 10);
  const appointmentId = getParam("appointmentId");
  const isReschedule = !!appointmentId;

  const savedState = useMemo(() => {
    return (
      Storages.getStorage<{ step: number; formData: BookingFormData }>(
        "session",
        StorageKeysEnum.bookingState,
      ) || { step: 0, formData: DEFAULT_VALUES }
    );
  }, []);

  const [currentStep, setCurrentStep] = useState(
    !isNaN(urlStep) ? urlStep : savedState.step,
  );
  const [confirmed, setConfirmed] = useState(false);
  const [bookingResult, setBookingResult] = useState<BookingResponse | null>(
    null,
  );

  const methods = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { ...DEFAULT_VALUES, ...savedState.formData },
    mode: "onTouched",
  });

  const { user } = useSelector(
    (state: RootState) => state.auth,
  ) as AuthState<Patient>;

  useEffect(() => {
    const subscription = methods.watch((values) => {
      Storages.setStorage("session", StorageKeysEnum.bookingState, {
        step: currentStep,
        formData: values,
      });
    });
    return () => subscription.unsubscribe();
  }, [methods, currentStep]);

  // ── Fetch + populate when editing an existing appointment ──────────
  const hasPopulatedRef = useRef(false);

  const { data: appointmentFormData } = useQuery({
    queryKey: ["appointment", appointmentId],
    queryFn: () => getSingleAppointmentReq(appointmentId ?? ""),
    enabled: !!appointmentId,
    select: appointmentToFormData,
  });

  // Populate the form once when the query resolves
  if (appointmentFormData && !hasPopulatedRef.current) {
    hasPopulatedRef.current = true;
    methods.reset(appointmentFormData);
  }

  // ── Auto-fill current user's name for fresh bookings ──────────────
  const hasAutoFilledUserRef = useRef(false);

  if (
    !hasAutoFilledUserRef.current &&
    !appointmentId &&
    savedState.formData.firstName === "" &&
    savedState.formData.lastName === "" &&
    user?.user
  ) {
    hasAutoFilledUserRef.current = true;
    methods.setValue("firstName", user.user.first_name || "");
    methods.setValue("lastName", user.user.last_name || "");
  }

  const syncStep = (step: number) => {
    updateParam("step", String(step));
    Storages.setStorage("session", StorageKeysEnum.bookingState, {
      step,
      formData: methods.getValues(),
    });
  };

  // ─── Booking mutation ───────────────────────────────────────────────────
  const bookingMutation = useMutation({
    mutationFn: (payload: ReturnType<typeof buildPayload>) =>
      bookAnAppointmentReq(payload),
    onSuccess: (response) => {
      toast.success(
        response.response_description || "Appointment booked successfully!",
      );
      setBookingResult(response.data);
      setConfirmed(true);
      Storages.setStorage("session", StorageKeysEnum.bookingState, null);
      if (appointmentId) deleteParam("appointmentId");
      if (getParam("mode")) deleteParam("mode");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
    },
    onError: (error: RejectedPayload) => {
      toast.error(
        error.message || "Failed to book appointment. Please try again.",
      );
      if (
        error.message?.toLowerCase().includes("cannot book a past timeslot")
      ) {
        setCurrentStep(1);
        syncStep(1);
      }
      if (appointmentId) deleteParam("appointmentId");
      if (getParam("mode")) deleteParam("mode");
    },
  });

  // ─── Reschedule mutation ────────────────────────────────────────────────
  const rescheduleMutation = useMutation({
    mutationFn: (payload: {
      scheduled_start_at_utc: string;
      requested_duration_minutes: number;
      reason: string;
    }) => rescheduleAppointment(payload, appointmentId ?? ""),
    onSuccess: () => {
      toast.success("Appointment rescheduled successfully!");
      setConfirmed(true);
      Storages.setStorage("session", StorageKeysEnum.bookingState, null);
      if (appointmentId) deleteParam("appointmentId");
      if (getParam("mode")) deleteParam("mode");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
    },
    onError: (error: RejectedPayload) => {
      toast.error(
        error.message || "Failed to reschedule appointment. Please try again.",
      );
      if (
        error.message?.toLowerCase().includes("cannot book a past timeslot")
      ) {
        setCurrentStep(1);
        syncStep(1);
      }
      if (appointmentId) deleteParam("appointmentId");
      if (getParam("mode")) deleteParam("mode");
    },
  });

  const activeMutation = isReschedule ? rescheduleMutation : bookingMutation;

  const goNext = async () => {
    // Validate only the fields for the current step before advancing
    const fieldsToValidate = STEP_FIELDS[currentStep];
    if (fieldsToValidate) {
      const isValid = await methods.trigger(fieldsToValidate);
      if (!isValid) return;
    }

    if (currentStep === 3) {
      // Final step — build payload and submit
      const allData = methods.getValues();
      if (isReschedule) {
        const { startHour, startMinute, durationMinutes } = parseTimeSlot(
          allData.timeSlot,
        );
        const dateParts = new Date(allData.selectedDate);
        const scheduled = new Date(
          Date.UTC(
            dateParts.getFullYear(),
            dateParts.getMonth(),
            dateParts.getDate(),
            startHour,
            startMinute,
            0,
            0,
          ),
        );
        rescheduleMutation.mutate({
          scheduled_start_at_utc: scheduled.toISOString(),
          requested_duration_minutes: durationMinutes,
          reason: allData.complaint || "Rescheduled by patient",
        });
      } else {
        const payload = buildPayload(allData);
        bookingMutation.mutate(payload);
      }
    } else {
      const nextStep = isReschedule && currentStep === 1 ? 3 : currentStep + 1;
      setCurrentStep(nextStep);
      syncStep(nextStep);
    }
  };

  const goBack = () => {
    const prevStep =
      isReschedule && currentStep === 3 ? 1 : Math.max(0, currentStep - 1);
    setCurrentStep(prevStep);
    syncStep(prevStep);
  };

  const reset = () => {
    setCurrentStep(0);
    methods.reset(DEFAULT_VALUES);
    setConfirmed(false);
    setBookingResult(null);
    updateParam("step", "0");
    if (appointmentId) {
      deleteParam("appointmentId");
    }
    if (getParam("mode")) {
      deleteParam("mode");
    }
    Storages.setStorage("session", StorageKeysEnum.bookingState, null);
  };

  if (confirmed) {
    return (
      <div className="flex items-center justify-center p-4 h-full">
        <AppointmentConfirmed
          data={methods.getValues()}
          appointmentResponse={bookingResult}
          onReset={reset}
        />
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="w-full h-full grid grid-cols-3 gap-4 overflow-hidden">
        <div className="h-full overflow-y-auto hidden-scrollbar">
          <StepSidebar currentStep={currentStep} />
        </div>
        <div className=" col-span-2 border-l border-border flex flex-col h-full overflow-hidden">
          <div className="flex-none flex items-center justify-between p-6 pb-2 border-b">
            <h2 className="text-lg font-semibold text-foreground">
              {STEP_TITLES[currentStep]}
            </h2>
            {currentStep > 0 && (
              <button
                type="button"
                onClick={goBack}
                className="text-muted-foreground hover:text-foreground flex justify-center items-center bg-[#F7F7F7] rounded-full size-10 hover:bg-[#F7F7F7]/20 transition-colors ease-out duration-200"
              >
                <MoveLeft size={20} />
              </button>
            )}
          </div>
          <div className="flex-1 relative px-6 pb-6 mt-4 overflow-y-auto hidden-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className=""
              >
                {currentStep === 0 && (
                  <PersonalDetails
                    onNext={goNext}
                    isReschedule={isReschedule}
                  />
                )}
                {currentStep === 1 && (
                  <ChooseTimeSlot
                    onNext={goNext}
                    onBack={goBack}
                    isReschedule={isReschedule}
                  />
                )}
                {currentStep === 2 && (
                  <FindDoctor onNext={goNext} onBack={goBack} />
                )}
                {/* {currentStep === 3 && (
                  <ChoosePayment onNext={goNext} onBack={goBack} />
                )} */}
                {currentStep === 3 && (
                  <ConfirmAppointment
                    onNext={goNext}
                    onBack={goBack}
                    isPending={activeMutation.isPending}
                    isReschedule={isReschedule}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default Booking;
