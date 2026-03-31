import { getDoctorSchedules, getDoctorAvailabilitySlotReq } from "@/config/service/doctor.service";
import { FullCalendarData } from "@/lib/types";
import ViewSchedules from "@/shared/components/view-schedules.component";
import { format, parseISO, getISOWeek, getYear } from "date-fns";
import { useState } from "react";
import { DatesSetArg } from "@fullcalendar/core/index.js";

import { useQuery } from "@tanstack/react-query";

function Schedules() {
  const [dateRange, setDateRange] = useState({
    week: "",
    year: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["schedules", dateRange.week, dateRange.year],
    queryFn: () =>
      getDoctorSchedules({
        weekly: dateRange.week,
        year: dateRange.year,
      }),
    enabled: !!dateRange.week && !!dateRange.year,
  });

  const { data: availabilityData } = useQuery({
    queryKey: ["availability"],
    queryFn: () => getDoctorAvailabilitySlotReq(),
  });

  const refinedAppointments: FullCalendarData = (
    data?.data?.appointments || []
  ).map((appointment) => {
    const startUtcStripped = appointment.scheduled_start_at_utc.replace(
      "Z",
      "",
    );
    const endUtcStripped = appointment.scheduled_end_at_utc.replace("Z", "");

    const startDate = parseISO(startUtcStripped);

    const patientName = appointment.patient_id
      ? `${appointment.patient_id.first_name} ${appointment.patient_id.last_name}`
      : "Patient";
    const consType = "";

    const baseTitle =
      appointment.reason_for_visit ||
      `Appointment ${appointment.appointment_number}`;
    const uniqueId = appointment.appointment_number;
    const fullTitle = `${patientName}  - ${uniqueId} - ${baseTitle}`;

    // The main title doctors see on the slot
    const title = patientName;

    return {
      start: startUtcStripped,
      end: endUtcStripped,
      endStr: endUtcStripped,
      startStr: startUtcStripped,
      date: format(startDate, "yyyy-MM-dd"),
      _id: appointment._id || "",
      title: title.trim(),
      fullTitle: fullTitle.trim(),
      details: appointment.reason_for_visit,
      patientName: patientName,
      consultationType: consType,
      status: appointment.status,
    };
  });

  const refinedBlackouts: FullCalendarData = (data?.data?.blackouts || []).map(
    (blackout) => {
      const startUtcStripped = blackout.start_at_utc.replace("Z", "");
      const endUtcStripped = blackout.end_at_utc.replace("Z", "");

      const startDate = parseISO(startUtcStripped);

      return {
        start: startUtcStripped,
        end: endUtcStripped,
        endStr: endUtcStripped,
        startStr: startUtcStripped,
        date: format(startDate, "yyyy-MM-dd"),
        _id: blackout._id || "",
        title: "Unavailable",
        display: "background",
        status: "BLACKOUT",
      };
    },
  );

  const refinedAvailability: FullCalendarData = (
    availabilityData?.data?.weekly_slots || []
  )
    .filter((slot) => slot.is_active)
    .map((slot) => {
      return {
        _id: `availability-${slot.day_of_week}-${slot.start_time}`,
        title: "Unavailable",
        start: "",
        end: "",
        endStr: "",
        startStr: "",
        date: "",
        startTime: slot.start_time,
        endTime: slot.end_time,
        daysOfWeek: [slot.day_of_week],
        display: "inverse-background",
        status: "BLACKOUT",
        groupId: "availableForInverse",
      };
    });

  const refinedData: FullCalendarData = [
    ...(refinedAppointments || []),
    ...(refinedBlackouts || []),
    ...(refinedAvailability || []),
  ];

  const handleDatesSet = (dateInfo: DatesSetArg) => {
    // Utilize the midpoint to safely capture the current viewing week
    const midpoint = new Date(
      (dateInfo.start.getTime() + dateInfo.end.getTime()) / 2,
    );
    setDateRange({
      week: getISOWeek(midpoint).toString(),
      year: getYear(midpoint).toString(),
    });
  };

  return (
    <ViewSchedules
      data={refinedData}
      loading={isLoading}
      user="doctor"
      datesSetHandler={handleDatesSet}
    />
  );
}

export default Schedules;
