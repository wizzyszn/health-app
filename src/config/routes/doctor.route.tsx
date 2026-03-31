import ProtectedRoute from "@/shared/components/protected-route.component";
import { SideNavOption } from "@/lib/types";
import DashLayout from "@/shared/components/layouts/dash.layout.component";
import { BsCalendar2WeekFill } from "react-icons/bs";
import { RxCountdownTimer } from "react-icons/rx";
import { TbMicroscopeFilled } from "react-icons/tb";
import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import HomeIcon from "@/shared/components/svgs/icons/home.icon";
import MedicineBottleIcon from "@/shared/components/svgs/icons/medicine-bottle.icon";
import { LucideCalendarSearch } from "lucide-react";

const LoginDoctor = lazy(
  () => import("@/auth/doctor/pages/login.doctor.page.auth"),
);
const DoctorSignUp = lazy(
  () => import("@/auth/doctor/pages/register.doctor.page.auth"),
);
const DoctorForgotPassword = lazy(
  () => import("@/auth/doctor/pages/forgot-password.page.auth"),
);

const DoctorDashboard = lazy(
  () => import("@/doctor/pages/dashbord.page.doctor"),
);
const DoctorSchedules = lazy(
  () => import("@/doctor/pages/schedules.page.doctor"),
);
const DoctorConsultations = lazy(
  () => import("@/doctor/pages/consultation.page.doctor"),
);
const ViewConsultationDetails = lazy(
  () => import("@/doctor/pages/view-consultation.page.doctor"),
);
const DoctorAppointmentDetails = lazy(
  () => import("@/doctor/pages/appointment-detail.page.doctor"),
);
const Investigations = lazy(
  () => import("@/doctor/pages/investigation.page.doctor"),
);
const Diagnosis = lazy(() => import("@/doctor/pages/diagnosis.page.doctor"));

const DoctorProfile = lazy(() => import("@/doctor/pages/profile.page.doctor"));
const Appointment = lazy(
  () => import("@/doctor/pages/appointment.page.doctor"),
);

const sideNavOptions: SideNavOption[] = [
  {
    url: "",
    title: "Home",
    Icon: HomeIcon,
  },
  {
    url: "schedules",
    title: "Schedules",
    Icon: BsCalendar2WeekFill,
  },
  {
    url: "appointments",
    title: "Appointments",
    Icon: LucideCalendarSearch,
  },
  {
    url: "consultations",
    title: "Consultations",
    Icon: RxCountdownTimer,
  },
  {
    url: "investigations",
    title: "Investigations",
    Icon: MedicineBottleIcon,
  },
  {
    url: "diagnosis",
    title: "Diagnosis",
    Icon: TbMicroscopeFilled,
  },
];
const doctor_routes: RouteObject[] = [
  {
    path: "login",
    element: <LoginDoctor />,
  },
  {
    path: "sign-up",
    element: <DoctorSignUp />,
  },
  {
    path: "forgot-password",
    element: <DoctorForgotPassword />,
  },
  {
    path: "dashboard",
    element: (
      <ProtectedRoute>
        <DashLayout
          sideNavOptions={sideNavOptions}
          redirectPath="/doctor/dashboard"
        />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        path: "",
        element: <DoctorDashboard />,
      },
      {
        path: "schedules",
        element: <DoctorSchedules />,
      },
      {
        path: "appointments",
        element: <Appointment />,
      },
      {
        path: "consultations",
        element: <DoctorConsultations />,
      },
      {
        path: "consultations/:id",
        element: <ViewConsultationDetails />,
      },
      {
        path: "appointments/:id",
        element: <DoctorAppointmentDetails />,
      },

      {
        path: "investigations",
        element: <Investigations />,
      },
      {
        path: "diagnosis",
        element: <Diagnosis />,
      },
      {
        path: "profile",
        element: <DoctorProfile />,
      },
    ],
  },
];

export default doctor_routes;
