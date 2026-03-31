import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, MessageSquareMore } from "lucide-react";
import { ItemRow } from "./item-row.component.patient";
// import { ConsultationStatusBadge } from "./consultation-status-badge.component.patient";
import { Consultation } from "../types/consultation.types";
import { useQuery } from "@tanstack/react-query";
import { getAllConsultationsForPatient } from "@/config/service/patient.service";
import { Pagination } from "@/shared/components/pagination.component.shared";

export function ConsultationList({
  searchTerm = "",
  inTabs = false,
}: {
  searchTerm?: string;
  inTabs?: boolean;
}) {
  const [page, setPage] = useState(1);
  const perPage = inTabs ? 3 : 10;

  const { data, isLoading } = useQuery({
    queryKey: ["consultations", { perPage, page, searchTerm }],
    queryFn: () =>
      getAllConsultationsForPatient(
        page,
        perPage,
        undefined,
        undefined,
        searchTerm || undefined,
      ),
  });

  const typeMapping: Record<string, string> = {
    VIDEO: "Video Call",
    AUDIO: "Audio Call",
    IN_PERSON: "In Person",
  };

  const rawData = data?.data;
  const consultationItems = rawData?.consultation || [];
  const totalPages = rawData?.meta?.lastPage ?? 1;

  const consultations: Consultation[] = consultationItems.map((item) => {
    const startDate = new Date(item.appointment_id?.scheduled_start_at_utc);
    const endDate = new Date(item.appointment_id?.scheduled_end_at_utc);

    const formatTime = (date: Date) => {
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `${hours}:${minutes}${ampm}`;
    };

    return {
      id: item._id,
      doctorName: item.doctor_id?.full_name || "Unknown Doctor",
      specialty: item.doctor_id?.specializations?.[0] || "General Practitioner",
      ref: item.appointment_id?.appointment_number || item.consultation_id,
      type: typeMapping[item.type] || "Video Call",
      date: {
        day: startDate.getDate(),
        month: startDate.toLocaleString("default", { month: "short" }),
      },
      time: `${formatTime(startDate)} - ${formatTime(endDate)}`,
      status: item.status,
    };
  });

  const filteredConsultations = consultations;

  const content = (
    <div className="mt-0 flex flex-col gap-2">
      {isLoading ? (
        Array.from({ length: inTabs ? 3 : 5 }).map((_, i) => (
          <div
            key={i}
            className="h-[72px] w-full rounded-xl bg-muted animate-pulse border border-border"
          />
        ))
      ) : filteredConsultations.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          No consultations found.
        </div>
      ) : (
        filteredConsultations.map((c) => (
          <Link
            key={c.id}
            to={`/patient/dashboard/consultations/${c.id}`}
            className="block hover:opacity-90 transition-opacity"
          >
            <ItemRow item={c}>
              <div className="flex items-center gap-2">
                {/* <ConsultationStatusBadge status={c.status} /> */}
                <MessageSquareMore color="#969696" />
                <ChevronRight size={16} className="text-muted-foreground" />
              </div>
            </ItemRow>
          </Link>
        ))
      )}
      {inTabs ? (
        <div className="flex justify-end mt-2">
          <Link
            to="/patient/dashboard/consultations"
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
