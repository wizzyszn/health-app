import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { ItemRow } from "./item-row.component.patient";
import { AppointmentStatusBadge } from "./appointment-status-badge.component.patient";
import { Appointment } from "../types/consultation.types";
import { Pagination } from "@/shared/components/pagination.component.shared";

import { useQuery } from "@tanstack/react-query";
import { getAppointmentsReq } from "@/config/service/patient.service";
import EditIcon from "@/shared/components/svgs/icons/edit.icon";
import useUrlSearchParams from "@/shared/hooks/use-url-search-params";

export function AppointmentList({
  searchTerm = "",
  inTabs = false,
}: {
  searchTerm?: string;
  inTabs?: boolean;
}) {
  const [page, setPage] = useState(1);
  const perPage = inTabs ? 3 : 10;
  const { updateParam } = useUrlSearchParams();

  const { data, isLoading } = useQuery({
    queryKey: [
      "appointments",
      { perPage: String(perPage), page: String(page), q: searchTerm },
    ],
    queryFn: () =>
      getAppointmentsReq({
        perPage: String(perPage),
        page: String(page),
        q: searchTerm,
      }),
  });

  const pagination = data?.data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  const appointments: Appointment[] = (data?.data?.items || []).map((item) => {
    const startDate = new Date(item.scheduled_start_at_utc);
    const endDate = new Date(item.scheduled_end_at_utc);

    const formatTime = (date: Date) => {
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `${hours}:${minutes}${ampm}`;
    };

    const typeMapping: Record<string, string> = {
      VIDEO: "Video Call",
      AUDIO: "Audio Call",
      IN_PERSON: "In Person",
      MEETADOCTOR: "Meet a Doctor",
      HOMESERVICE: "Home Service",
    };

    return {
      id: item._id,
      doctorName: item.doctor_id?.full_name || "Unknown Doctor",
      specialty: item.doctor_id?.specializations?.[0] || "General Practitioner",
      ref: item.appointment_number,
      type: typeMapping[item.status] || "Video Call",
      date: {
        day: startDate.getDate(),
        month: startDate.toLocaleString("default", { month: "short" }),
      },
      time: `${formatTime(startDate)} - ${formatTime(endDate)}`,
      status: item.status,
    };
  });

  const filteredAppointments = appointments;

  const content = (
    <div className="mt-0 flex flex-col gap-2">
      {isLoading ? (
        Array.from({ length: inTabs ? 3 : 5 }).map((_, i) => (
          <div
            key={i}
            className="h-[72px] w-full rounded-xl bg-muted animate-pulse border border-border"
          />
        ))
      ) : filteredAppointments.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          No appointments found.
        </div>
      ) : (
        filteredAppointments.map((a) => (
          <Link
            key={a.id}
            to={`/patient/dashboard/appointments/${a.id}`}
            className="block hover:opacity-90 transition-opacity"
          >
            <ItemRow item={a}>
              <div className="flex items-center gap-2">
                <AppointmentStatusBadge status={a.status} />
                {(a.status === "PENDING" || a.status === "CONFIRMED") && (
                  <button
                    type="button"
                    className="p-1 hover:bg-muted rounded-md transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      updateParam("step", "1");
                      updateParam("appointmentId", a.id);
                    }}
                  >
                    <EditIcon />
                  </button>
                )}

                <ChevronRight size={16} className="text-muted-foreground" />
              </div>
            </ItemRow>
          </Link>
        ))
      )}
      {inTabs ? (
        <div className="flex justify-end mt-2">
          <Link
            to="/patient/dashboard/appointments"
            className="text-sm hover:underline "
          >
            see all
          </Link>
        </div>
      ) : (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );

  if (inTabs) {
    return content;
  }

  return (
    <div className="w-full rounded-xl bg-white shadow-sm border border-border p-4">
      {content}
    </div>
  );
}
