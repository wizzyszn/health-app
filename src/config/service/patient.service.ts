import {
  Consultation,
  ConsultationReqBody,
  Consultations,
  GeneralReturnInt,
  Patient,
  PatientProfileInterface,
  Schedules,
  UpdatePatientProfileBody,
} from "@/lib/types";
import { options, requestHandler, urlGenerator } from "./config";

// Initiate Patient Registration to get OTP for email verification
export const initiatePatientRegistration = (data: { email: string }) => {
  const url = urlGenerator("auth", "patients/register/initiate", false);
  return requestHandler<GeneralReturnInt<unknown>>(
    url,
    options("POST", data, false),
  );
};

// Verify OTP after initialization
export const verifyOTP = (data: { email: string; otp: string }) => {
  const url = urlGenerator("auth", "patients/register/verify-otp", false);
  return requestHandler<GeneralReturnInt<unknown>>(
    url,
    options("POST", data, false),
  );
};

// Resend OTP
export const resendOTP = (data: { email: string }) => {
  const url = urlGenerator("auth", "patients/register/resend-otp", false);
  return requestHandler<GeneralReturnInt<unknown>>(
    url,
    options("POST", data, false),
  );
};

// Complete registration
export const registration = (data: {
  registration_token: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  phone_number: string;
  password: string;
}) => {
  const url = urlGenerator("auth", "patients/register/complete", false);
  return requestHandler<GeneralReturnInt<unknown>>(
    url,
    options("POST", data, false),
  );
};

// Initialize reset password
export const initializeRestPassword = (data: { email: string }) => {
  const url = urlGenerator("auth", "forgot-password/initiate", false);
  return requestHandler<GeneralReturnInt<unknown>>(
    url,
    options("POST", data, false),
  );
};

export const verifyOtpForForgotPassowrd = (data: {
  email: string;
  otp: string;
}) => {
  const url = urlGenerator("auth", "forgot-password/verify-otp", false);
  return requestHandler<GeneralReturnInt<unknown>>(
    url,
    options("POST", data, false),
  );
};

export const resetPassword = (data: {
  reset_token: string;
  password: string;
  confirm_password: string;
}) => {
  const url = urlGenerator("auth", "forgot-password/reset", false);
  return requestHandler<GeneralReturnInt<unknown>>(
    url,
    options("POST", data, false),
  );
};

// Register Patient with Credentials
export const signUpPatientReq = (data: {
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  password: string;
}) => {
  const url = urlGenerator("auth", "patients/signup", false);
  return requestHandler<GeneralReturnInt<Patient>>(url, options("POST", data));
};

// Login Patient with credentials
export const signInPatienReq = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const url = urlGenerator("auth", "patients/login", false);
  return requestHandler<GeneralReturnInt<Patient>>(
    url,
    options("POST", { email, password }),
  );
};

// Consult a medical practitioner
export const consultADoctor = (data: ConsultationReqBody) => {
  const url = urlGenerator("patients", "consultations", false);
  return requestHandler<GeneralReturnInt<Consultation>>(
    url,
    options("POST", data, true),
  );
};

// Get consultations for a patient
export const getAllConsultations = (
  page: number = 1,
  perPage: number = 5,
  startDate?: string | undefined,
  endDate?: string | undefined,
  q?: string,
) => {
  let param = `page=${page}&perPage=${perPage}&q=${q}`;

  if (startDate && endDate) {
    param += `&startDate=${startDate}&endDate=${endDate}`;
  }

  const url = urlGenerator("patients", "consultations", false, param);
  return requestHandler<GeneralReturnInt<Consultations>>(
    url,
    options("GET", null, true),
  );
};

export const getAllConsultationsForPatient = (
  page: number = 1,
  perPage: number = 3,
  startDate?: string | undefined,
  endDate?: string | undefined,
  q?: string,
) => {
  const params = {
    page: page.toString(),
    perPage: perPage.toString(),
    startDate: startDate ?? "",
    endDate: endDate ?? "",
    q: q ?? "",
  };
  const url = urlGenerator(
    "patients",
    "consultations/all",
    false,
    new URLSearchParams(params).toString(),
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
        };
        type: "VIDEO" | "AUDIO" | "IN_PERSON";
        user_id: string;
        doctor_id: {
          _id: string;
          first_name: string;
          last_name: string;
          full_name: string;
          email: string;
          specializations: string[];
          id: string;
        };
        consoltation_for: "SELF" | "OTHER";
        consultation_id: string;
        title: string;
        details: string;
        status: "PENDING" | "COMPLETED" | "CANCELLED";
        createdAt: string;
        updatedAt: string;
      }>;
      meta: {
        total: number;
        page: number;
        lastPage: number;
      };
    }>
  >(url, options("GET", null, true));
};

// Get a particular consultation
export const getAConsultation = (consultationId: string) => {
  const url = urlGenerator(
    "patients",
    `consultations/${consultationId}`,
    false,
  );
  return requestHandler<
    GeneralReturnInt<{
      _id: string;
      appointment_id: {
        _id: string;
        appointment_number: string;
        scheduled_start_at_utc: string;
        scheduled_end_at_utc: string;
        timezone_snapshot: string;
        status: string;
        reason_for_visit: string;
      };
      type: "VIDEO" | "CHAT" | "AUDIO" | "MEETADOCTOR" | "HOMESERVICE";
      user_id: string;
      doctor_id: {
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
        createdAt: string;
        updatedAt: string;
        id: string;
      };
      consoltation_for: "SELF" | "OTHERS";
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
      createdAt: string;
      updatedAt: string;
    }>
  >(url, options("GET", null, true));
};

// Edit a particular consultation
export const editAConsultation = (
  consultationId: string,
  data: ConsultationReqBody,
) => {
  const url = urlGenerator(
    "patients",
    `consultations/n${consultationId}`,
    false,
  );
  return requestHandler<GeneralReturnInt<Consultation>>(
    url,
    options("POST", data, true),
  );
};

// Get all schedules for a patient
export const getAllSchedulesForPatient = () => {
  const url = urlGenerator(
    "patients",
    "consultations/consultation/weekly",
    false,
  );
  return requestHandler<GeneralReturnInt<Schedules[]>>(
    url,
    options("GET", null, true),
  );
};

// Get medications for a consultation
export const getMedicationsForConsultation = (consultationId: string) => {
  const url = urlGenerator(
    "patients",
    `consultations/medication/${consultationId}`,
    false,
  );
  return requestHandler<GeneralReturnInt<[]>>(url, options("GET", null, true));
};

// ─── Profile ──────────────────────────────────────────────────────────────────

export const getPatientProfileReq = () => {
  const url = urlGenerator("patients", "me", false);
  return requestHandler<GeneralReturnInt<PatientProfileInterface>>(
    url,
    options("GET", null, true),
  );
};

// Update profile fields only (no image) — sends JSON
export const updatePatientProfileReq = (
  data: UpdatePatientProfileBody & {
    profile_picture_url?: string | null; // pass "" or null to clear the photo
  },
) => {
  const url = urlGenerator("patients", "me/profile", false);
  return requestHandler<GeneralReturnInt<PatientProfileInterface>>(
    url,
    options("PATCH", data, true),
  );
};

// Update profile with image — sends multipart/form-data
// Uses options() 4th formData param — handles Bearer token + omits Content-Type for correct boundary
export const updatePatientProfilePictureReq = (data: {
  file: File;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: string;
  marital_status?: string;
  occupation?: string;
  address?: string;
}) => {
  const url = urlGenerator("patients", "me/profile", false);

  const formData = new FormData();
  formData.append("file", data.file); // ✅ field name is "file" per API docs

  if (data.first_name) formData.append("first_name", data.first_name);
  if (data.last_name) formData.append("last_name", data.last_name);
  if (data.phone_number) formData.append("phone_number", data.phone_number);
  if (data.date_of_birth) formData.append("date_of_birth", data.date_of_birth);
  if (data.gender) formData.append("gender", data.gender);
  if (data.marital_status)
    formData.append("marital_status", data.marital_status);
  if (data.occupation) formData.append("occupation", data.occupation);
  if (data.address) formData.append("address", data.address);

  return requestHandler<GeneralReturnInt<PatientProfileInterface>>(
    url,
    options("PATCH", undefined, true, formData),
  );
};

// ─── Appointments ─────────────────────────────────────────────────────────────

export const getAppointmentsReq = (param: {
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
    "patients/appointments",
    false,
    params.toString(),
  );

  return requestHandler<
    GeneralReturnInt<{
      items: {
        _id: string;
        appointment_number: string;
        doctor_id: {
          _id: string;
          first_name: string;
          last_name: string;
          full_name: string;
          email: string;
          specializations: string[];
        };
        patient_id: string;
        scheduled_start_at_utc: string;
        scheduled_end_at_utc: string;
        timezone_snapshot: string;
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
        consultation_id: string;
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
      }[];
      pagination: {
        page: number;
        perPage: number;
        total: number;
        totalPages: number;
      };
    }>
  >(url, options("GET", null, true));
};

export const getSingleAppointmentReq = (id: string) => {
  const url = urlGenerator("booking", `patients/appointments/${id}`, false);

  return requestHandler<
    GeneralReturnInt<{
      _id: string;
      appointment_number: string;
      patient_id: string;
      doctor_id: {
        _id: string;
        first_name: string;
        last_name: string;
        full_name: string;
        email: string;
        specializations: string[];
      };
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
  >(url, options("GET", null, true));
};

export const searchDoctorsReq = (params: {
  q?: string;
  specialization?: string;
  date?: string;
  page?: string;
  perPage?: string;
}) => {
  const param = new URLSearchParams(params);
  const url = urlGenerator(
    "booking",
    `doctors/search`,
    false,
    param.toString(),
  );

  return requestHandler<
    GeneralReturnInt<
      Array<{
        _id: string;
        first_name: string;
        last_name: string;
        full_name: string;
        email: string;
        profile_picture_url: string;
        specializations: string[];
        active: boolean;
        availability: {
          timezone: string;
          weekly_slots: {
            day_of_week: number;
            start_time: string;
            end_time: string;
            slot_duration_minutes: 15 | 30 | 45 | 60;
            is_active: boolean;
          }[];
          effective_from: string;
          effective_to?: string;
        };
      }>
    >
  >(url, options("GET", null, true));
};

export const lookupAvailableDoctorsReq = (params: {
  q?: string;
  specialization?: string;
  date?: string;
  page?: string;
  perPage?: string;
}) => {
  const url = urlGenerator(
    "booking",
    "doctors/available",
    false,
    new URLSearchParams(params).toString(),
  );

  return requestHandler<
    GeneralReturnInt<
      Array<{
        _id: string;
        first_name: string;
        last_name: string;
        full_name: string;
        email: string;
        profile_picture_url: string;
        specializations: string[];
        active: boolean;
        availability: {
          timezone: string;
          weekly_slots: {
            day_of_week: number;
            start_time: string;
            end_time: string;
            slot_duration_minutes: 15 | 30 | 45 | 60;
            is_active: boolean;
          }[];
          effective_from: string;
          effective_to?: string;
        };
      }>
    >
  >(url, options("GET", null, true));
};

export const bookAnAppointmentReq = (data: {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  marital_status: string;
  occupation: string;
  present_complaint: string;
  doctor_id: string;
  scheduled_start_at_utc: string;
  requested_duration_minutes: 15 | 30 | 45 | 60;
  reason_for_visit?: string;
  confirm_appointment: boolean;
  consultation_type?:
    | "VIDEO"
    | "CHAT"
    | "AUDIO"
    | "MEETADOCTOR"
    | "HOMESERVICE";
  complaint_brief?: string;
  Medical_conditions?: string[]; // examples ["Hypertension","Asthma"],
  allergies?: string[];
}) => {
  const url = urlGenerator("booking", "patients/appointments", false);

  const formattedData = {
    ...data,
    date_of_birth: new Date(data.date_of_birth).toISOString().split("T")[0],
  };

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
    }>
  >(url, options("POST", formattedData, true));
};

export const cancelAppointmentReq = (id: string, data: { reason: string }) => {
  const url = urlGenerator(
    "booking",
    `patients/appointments/${id}/cancel`,
    false,
  );

  return requestHandler<
    GeneralReturnInt<{
      _id: string;
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
      cancelled_by: string;
      cancelled_reason: string;
    }>
  >(url, options("PATCH", data, true));
};

// reschedule an appointment

export const rescheduleAppointment = (
  data: {
    scheduled_start_at_utc: string; // example "2026-03-26T10:00:00.000Z"
    requested_duration_minutes: number;
    reason: string; // example "Need a different time due to schedule conflict"
  },
  appointmentId: string,
) => {
  const url = urlGenerator(
    "booking",
    `patients/appointments/${appointmentId}/reschedule`,
    false,
  );

  return requestHandler<GeneralReturnInt<unknown>>(
    url,
    options("PATCH", data, true),
  );
};
