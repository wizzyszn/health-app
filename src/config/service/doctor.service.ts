import {
  //Consultation,
  Consultations,
  Diagnosis,
  Doctor,
  GeneralReturnInt,
  Investigation,
  Investigations,
  MedicationFormulationInt,
  Schedules,
} from "@/lib/types";
import { RawDoctorConsultationDetail } from "@/doctor/types/consultation.types";
import { options, requestHandler, urlGenerator } from "./config";

// Login Doctor with creds
export const loginDoctor = (data: { email: string; password: string }) => {
  const url = urlGenerator("auth", "doctors/login", false);
  return requestHandler<GeneralReturnInt<Doctor>>(
    url,
    options("POST", data, true),
  );
};

// get all consultations for a doctor
export const getAllConsultationsForDoc = (
  page: number = 1,
  perPage: number = 5,
  startDate?: string | undefined,
  endDate?: string | undefined,
  searchTerm?: string | undefined,
) => {
  let param = `page=${page}&perPage=${perPage}`;

  if (startDate && endDate) {
    param += `&startDate=${startDate}&endDate=${endDate}`;
  }

  if (searchTerm) {
    param += `&search=${searchTerm}`;
  }

  const url = urlGenerator("doctors", "consultations", false, param);
  return requestHandler<GeneralReturnInt<Consultations>>(
    url,
    options("GET", null, true),
  );
};

// get paginated consultations for a doctor

export const getDoctorConsultationsReq = (param?: {
  page?: string;
  perPage?: string;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
  q?: string;
}) => {
  const url = urlGenerator(
    "doctors",
    "consultations",
    false,
    new URLSearchParams(param).toString(),
  );

  return requestHandler<
    GeneralReturnInt<{
      consultation: Array<{
        _id: string;
        appointment_id: {
          _id: string;
          appointment_number: string;
          scheduled_start_at_utc: string;
          scheduled_end_at_utc: string;
          timezone_snapshot: string;
          status: "PENDING" | "CONFIRMED" | "RESCHEDULED";
          reason_for_visit: string;
        };
        type: "VIDEO" | "AUDIO";
        user_id: {
          _id: string;
          first_name: string;
          last_name: string;
          email: string;
          date_of_birth: string;
          full_name: string;
          gender: string;
          phone_number: string;
          profile_picture_url: string;
          id: string;
        };
        doctor_id: {
          _id: string;
          first_name: string;
          last_name: string;
          full_name: string;
          email: string;
          phone_number: string;
          specializations: string[];
          profile_picture_url: string;
          id: string;
        };
        consoltation_for: "SELF";
        consultation_id: string;
        title: string;
        details: string;
        status: "PENDING" | "CONFIRMED" | "RESCHEDULED";
      }>;
      meta: {
        total: number;
        page: number;
        lastPage: number;
      };
    }>
  >(url, options("GET", null, true));
};

// get a single consultation for a doctor
export const getAConsultationsForDoc = (consultationId: string) => {
  const url = urlGenerator("doctors", `consultations/${consultationId}`, false);
  return requestHandler<GeneralReturnInt<RawDoctorConsultationDetail>>(
    url,
    options("GET", null, true),
  );
};

// ─── Appointment actions ─────────────────────────────────────────────────────

// Accept appointment (doctor accepts)
export const acceptAppointmentReq = (appointmentId: string) => {
  const url = urlGenerator(
    "booking",
    `doctors/me/appointments/${appointmentId}/accept`,
    false,
  );
  return requestHandler<GeneralReturnInt<{ message: string }>>(
    url,
    options("PATCH", {}, true),
  );
};

// Confirm appointment
export const confirmAppointmentReq = (appointmentId: string) => {
  const url = urlGenerator(
    "booking",
    `appointments/${appointmentId}/confirm`,
    false,
  );
  return requestHandler<GeneralReturnInt<{ message: string }>>(
    url,
    options("PATCH", {}, true),
  );
};

// Complete appointment
export const completeAppointmentReq = (appointmentId: string) => {
  const url = urlGenerator(
    "booking",
    `appointments/${appointmentId}/complete`,
    false,
  );
  return requestHandler<GeneralReturnInt<{ message: string }>>(
    url,
    options("PATCH", {}, true),
  );
};

// Mark appointment as no-show
export const noShowAppointmentReq = (appointmentId: string) => {
  const url = urlGenerator(
    "booking",
    `appointments/${appointmentId}/no-show`,
    false,
  );
  return requestHandler<GeneralReturnInt<{ message: string }>>(
    url,
    options("PATCH", {}, true),
  );
};

// Cancel appointment (general)
export const cancelAppointmentReq = (
  appointmentId: string,
  data: { reason: string },
) => {
  const url = urlGenerator(
    "booking",
    `appointments/${appointmentId}/cancel`,
    false,
  );
  return requestHandler<GeneralReturnInt<{ message: string }>>(
    url,
    options("PATCH", data, true),
  );
};

// Cancel doctor appointment (doctor-specific cancel)
export const cancelDoctorAppointmentReq = (
  appointmentId: string,
  data: { reason: string },
) => {
  const url = urlGenerator(
    "booking",
    `doctors/me/appointments/${appointmentId}/cancel`,
    false,
  );
  return requestHandler<GeneralReturnInt<{ message: string }>>(
    url,
    options("PATCH", data, true),
  );
};

// Reschedule doctor appointment
export const rescheduleDoctorAppointmentReq = (
  appointmentId: string,
  data: {
    scheduled_start_at_utc: string;
    requested_duration_minutes: 15 | 30 | 45 | 60;
  },
) => {
  const url = urlGenerator(
    "booking",
    `doctors/me/appointments/${appointmentId}/reschedule`,
    false,
  );
  return requestHandler<GeneralReturnInt<{ message: string }>>(
    url,
    options("PATCH", data, true),
  );
};

// ─── Appointments ────────────────────────────────────────────────────────────

export const getDoctorAppointmentsReq = (param: {
  status?:
    | "PENDING"
    | "CONFIRMED"
    | "ACTIVE"
    | "COMPLETED"
    | "CANCELED"
    | "NO_SHOW"
    | "FAILED"
    | "FORFEITED"
    | "RESCHEDULED";
  from?: string;
  to?: string;
  page?: string;
  perPage?: string;
  q?: string;
}) => {
  const params = new URLSearchParams(param);
  const url = urlGenerator(
    "booking",
    "doctors/me/appointments",
    false,
    params.toString(),
  );
  return requestHandler<
    GeneralReturnInt<{
      items: {
        _id: string;
        appointment_number: string;
        doctor_id: string;
        patient_id: string;
        scheduled_start_at_utc: string;
        scheduled_end_at_utc: string;
        timezone_snapshot: string;
        status:
          | "PENDING"
          | "CONFIRMED"
          | "ACTIVE"
          | "COMPLETED"
          | "CANCELED"
          | "NO_SHOW"
          | "FAILED"
          | "FORFEITED"
          | "RESCHEDULED";
        reason_for_visit: string;
        booking_profile_snapshot?: {
          first_name: string;
          last_name: string;
          date_of_birth: string;
          gender: string;
          marital_status: string;
          occupation: string;
          present_complaint: string;
        };
        consultation_id?: string;
        rescheduled_from_appointment_id?: string;
      }[];
      pagination: {
        page: number;
        total: number;
        lastPage: number;
        totalPages: number;
      };
    }>
  >(url, options("GET", null, true));
};

// Get a single appointment for a doctor
export const getSingleDoctorAppointmentReq = (appointmentId: string) => {
  const url = urlGenerator(
    "booking",
    `doctors/me/appointments/${appointmentId}`,
    false,
  );
  return requestHandler<
    GeneralReturnInt<{
      _id: string;
      appointment_number: string;
      patient_id: string;
      doctor_id: string;
      scheduled_start_at_utc: string;
      scheduled_end_at_utc: string;
      timezone_snapshot: string;
      status:
        | "PENDING"
        | "CONFIRMED"
        | "ACTIVE"
        | "COMPLETED"
        | "CANCELED"
        | "NO_SHOW"
        | "FAILED"
        | "FORFEITED"
        | "RESCHEDULED";
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
      consultation_id: {
        _id: string;
        appointment_id: string;
        type: "VIDEO" | "CHAT" | "AUDIO" | "MEETADOCTOR" | "HOMESERVICE";
        consultation_id: string;
        title: string;
        details: string;
        status:
          | "PENDING"
          | "CONFIRMED"
          | "ACTIVE"
          | "COMPLETED"
          | "CANCELED"
          | "NO_SHOW"
          | "FAILED"
          | "FORFEITED"
          | "RESCHEDULED";
      };
      rescheduled_from_appointment_id?: string;
    }>
  >(url, options("GET", null, true));
};

export const getAllDoctorAppointmentsReq = () => {
  const url = urlGenerator("booking", "doctors/me/appointments/all", false);
  return requestHandler<
    GeneralReturnInt<
      Array<{
        _id: string;
        appointment_number: string;
        patient_id: string;
        doctor_id: string;
        scheduled_start_at_utc: string;
        scheduled_end_at_utc: string;
        timezone_snapshot: string;
        status:
          | "PENDING"
          | "CONFIRMED"
          | "ACTIVE"
          | "COMPLETED"
          | "CANCELED"
          | "NO_SHOW"
          | "FAILED"
          | "FORFEITED"
          | "RESCHEDULED";
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
        consultation_id: {
          _id: string;
          appointment_id: string;
          type: "VIDEO" | "CHAT" | "AUDIO" | "MEETADOCTOR" | "HOMESERVICE";
          consultation_id: string;
          title: string;
          details: string;
          status:
            | "PENDING"
            | "CONFIRMED"
            | "ACTIVE"
            | "COMPLETED"
            | "CANCELED"
            | "NO_SHOW"
            | "FAILED"
            | "FORFEITED"
            | "RESCHEDULED";
        };
      }>
    >
  >(url, options("GET", null, true));
};

// ─── Profile ──────────────────────────────────────────────────────────────────

export const getDoctorProfileReq = () => {
  const url = urlGenerator("doctors", "me", false);
  return requestHandler<
    GeneralReturnInt<{
      _id: string;
      doctor_no: string;
      first_name: string;
      last_name: string;
      full_name: string;
      email: string;
      phone_number: string;
      active: boolean;
      specializations: string[];
      license_no: string;
      profile_picture_url?: string;
      createdAt: string;
      updatedAt: string;
      id: string;
    }>
  >(url, options("GET", null, true));
};

// Update profile fields only (no image) — sends JSON
export const updateDoctorProfileReq = (data: {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  profile_picture_url?: string | null; // pass "" or null to clear the photo
}) => {
  const url = urlGenerator("doctors", "me/profile", false);
  return requestHandler<GeneralReturnInt<unknown>>(
    url,
    options("PATCH", data, true),
  );
};

// Update profile with image — sends multipart/form-data
// Uses options() 4th formData param — handles Bearer token + omits Content-Type for correct boundary
export const updateDoctorProfilePictureReq = (data: {
  file: File;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
}) => {
  const url = urlGenerator("doctors", "me/profile", false);

  const formData = new FormData();
  formData.append("file", data.file);

  if (data.first_name) formData.append("first_name", data.first_name);
  if (data.last_name) formData.append("last_name", data.last_name);
  if (data.phone_number) formData.append("phone_number", data.phone_number);

  return requestHandler<GeneralReturnInt<{ profile_picture_url?: string }>>(
    url,
    options("PATCH", undefined, true, formData),
  );
};

// ─── Availability ─────────────────────────────────────────────────────────────

// Set doctor's availability slots
export const setDoctorAvailabilitySlotReq = (data: {
  timezone: string; // "Africa/Lagos"
  weekly_slots: {
    day_of_week: number;
    start_time: string; // "09:00"
    end_time: string; // "10:00"
    slot_duration_minutes: number;
    is_active: boolean; // default true
  }[];
  effective_from: string; // "2026-03-20"
  effective_to: string; // "2026-12-31"
}) => {
  const url = urlGenerator("booking", "doctors/me/availability", false);
  return requestHandler<
    GeneralReturnInt<{
      _id: string;
      doctor_id: string;
      timezone: string;
      weekly_slots: {
        day_of_week: number;
        start_time: string;
        end_time: string;
        slot_duration_minutes: 15 | 30 | 45 | 60;
        is_active: boolean;
      }[];
    }>
  >(url, options("PUT", data, true));
};

// Get doctor's availability slots
export const getDoctorAvailabilitySlotReq = () => {
  const url = urlGenerator("booking", "doctors/me/availability", false);
  return requestHandler<
    GeneralReturnInt<{
      _id: string;
      doctor_id: string;
      timezone: string;
      weekly_slots: {
        day_of_week: number;
        start_time: string; // "09:00"
        end_time: string; // "13:00"
        slot_duration_minutes: number;
        is_active: true;
      }[];
    }>
  >(url, options("GET", null, true));
};

// ─── Existing endpoints ──────────────────────────────────────────────────────

export const conductDiagnosis = (
  consultationId: string,
  data: { title: string; description: string },
) => {
  const url = urlGenerator(
    "doctors",
    `consultations/${consultationId}/diagnosis`,
    false,
  );
  return requestHandler<GeneralReturnInt<Diagnosis>>(
    url,
    options("POST", data, true),
  );
};

export const investigateConsultation = (
  consultationId: string,
  data: { name: string[] },
) => {
  const url = urlGenerator(
    "doctors",
    `consultations/${consultationId}/investigation`,
    false,
  );
  return requestHandler<GeneralReturnInt<{ message: string }>>(
    url,
    options("POST", data, true),
  );
};

export const getAllSchedulesForDoctor = () => {
  const url = urlGenerator(
    "doctors",
    "consultations/consultation/weekly",
    false,
  );
  return requestHandler<GeneralReturnInt<Schedules[]>>(
    url,
    options("GET", null, true),
  );
};

export const getAllInvestigationsForDoc = (
  page = 1,
  perPage = 5,
  startDate?: string,
  endDate?: string,
) => {
  let params = `page=${page}&perPage=${perPage}`;
  if (startDate && endDate)
    params += `&startDate=${startDate}&endDate=${endDate}`;

  const url = urlGenerator(
    "doctors",
    "consultations/investigation/list",
    false,
    params,
  );
  return requestHandler<GeneralReturnInt<Investigations>>(
    url,
    options("GET", null, true),
  );
};

export const getAllDiagnosis = () => {
  const url = urlGenerator("doctors", "consultations/diagnosis/list", false);
  return requestHandler<GeneralReturnInt<Diagnosis[]>>(
    url,
    options("GET", null, true),
  );
};

export const getMedicationsForConsultation = (consultationId: string) => {
  const url = urlGenerator(
    "doctors",
    `consultations/${consultationId}/medication`,
    false,
  );
  return requestHandler<GeneralReturnInt<MedicationFormulationInt[]>>(
    url,
    options("GET", null, true),
  );
};

export const getDiagnosisForConsultation = (consultationId: string) => {
  const url = urlGenerator(
    "doctors",
    `consultations/${consultationId}/diagnosis`,
    false,
  );
  return requestHandler<GeneralReturnInt<Diagnosis[]>>(
    url,
    options("GET", null, true),
  );
};

export const getInvestigationForConsultation = (consultationId: string) => {
  const url = urlGenerator(
    "doctors",
    `consultations/${consultationId}/investigation`,
    false,
  );
  return requestHandler<GeneralReturnInt<{ data: Investigation[] }>>(
    url,
    options("GET", null, true),
  );
};

export const PrescribeMedications = (
  consultationId: string,
  data: {
    formulation: "TABLET" | "SYRUP" | "CAPSULE" | "INJECTION";
    drug: string;
    dose_value: string;
    dose_unit:
      | "MILLIGRAM"
      | "MICROGRAM"
      | "PUFFS"
      | "TABS"
      | "CAB"
      | "MLS"
      | "LITRE";
    dose?: string;
    interval: "DAILY" | "WEEKLY" | "MONTHLY" | "AS_NEEDED";
    duration_value: string;
    duration_unit: "MINUTE" | "HOUR" | "DAY" | "MONTH";
    duration?: string;
  }[],
) => {
  const url = urlGenerator(
    "doctors",
    `consultations/${consultationId}/medication`,
    false,
  );
  return requestHandler<GeneralReturnInt<null>>(
    url,
    options("POST", data, true),
  );
};

export const getDoctorSchedules = (param: {
  weekly: string; //ISO week number (1-53). Returns schedule for that specific week with week metadata. Omit to fetch everything.
  year: string; //Year used with weekly. Defaults to current UTC year.
}) => {
  const url = urlGenerator(
    "booking",
    "doctors/me/schedule",
    false,
    new URLSearchParams(param).toString(),
  );

  return requestHandler<
    GeneralReturnInt<{
      appointments: {
        _id: string;
        appointment_number: string;
        patient_id: {
          _id: string;
          first_name: string;
          last_name: string;
          full_name: string;
          email: string;
        };
        scheduled_start_at_utc: string;
        scheduled_end_at_utc: string;
        status: "PENDING" | "CONFIRMED" | "RESCHEDULED";
        reason_for_visit: string;
      }[];
      blackouts: {
        _id: string;
        start_at_utc: string;
        end_at_utc: string;
        reason: string;
        reccuring: boolean;
        recurring_rule_id: string;
      }[];
    }>
  >(url, options("GET", null, true));
};

export const setDoctorBlackoutSlotReq = (data: {
  blackouts: {
    start_at_utc: string; //"2026-03-25T08:00:00.000Z";
    end_at_utc: string; //"2026-03-25T17:00:00.000Z"
    reason: string;
    reccuring: boolean;
  }[];
}) => {
  const url = urlGenerator("booking", "doctors/me/blackouts", false);

  return requestHandler<GeneralReturnInt<unknown>>(
    url,
    options("POST", data, true),
  );
};

export const getDoctorBlackoutsReq = () => {
  const url = urlGenerator("booking", "doctors/me/blackouts", false);

  return requestHandler<
    GeneralReturnInt<
      {
        _id: string;
        doctor_id: string;
        start_at_utc: string; //"2026-03-30T08:00:00.000Z"
        end_at_utc: string; ///"2026-03-30T16:00:00.000Z"
        reason: string;
        reccuring: boolean;
        day_of_week: number;
        start_time_minutes: number; //480
        end_time_minutes: number; //960
      }[]
    >
  >(url, options("GET", null, true));
};

export const deleteDoctorBlackoutsReq = (id: string) => {
  const url = urlGenerator("booking", `doctors/me/blackouts/${id}`, false);

  return requestHandler<GeneralReturnInt<unknown>>(
    url,
    options("DELETE", {}, true),
  );
};
