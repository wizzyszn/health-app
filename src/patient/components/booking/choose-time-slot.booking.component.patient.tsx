import { useState, useRef, useEffect } from "react";
import * as React from "react";
import { motion } from "framer-motion";
import { useFormContext, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { DayButton, getDefaultClassNames } from "react-day-picker";
import { cn } from "@/lib/utils";
import type { BookingFormData } from "@/patient/lib/schemas";

interface ChooseTimeSlotProps {
  onNext: () => void;
  onBack: () => void;
  isReschedule?: boolean;
}

import TimeIntervals from "@/shared/components/time-intervals.component";

const MotionButton = motion.create(Button);

function AnimatedDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  const isSelected =
    modifiers.selected &&
    !modifiers.range_start &&
    !modifiers.range_end &&
    !modifiers.range_middle;

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={isSelected}
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative z-0 flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-1 font-normal leading-none",
        "group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px]",
        isSelected
          ? "text-primary-foreground font-semibold bg-transparent hover:bg-transparent"
          : "",
        "[&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className,
      )}
      {...props}
    >
      {isSelected && (
        <motion.div
          layoutId="active-date"
          className="absolute inset-0 bg-primary rounded-md -z-10"
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
        />
      )}
      {props.children}
    </Button>
  );
}

const ChooseTimeSlot = ({
  onNext,
  onBack,
  isReschedule,
}: ChooseTimeSlotProps) => {
  const {
    watch,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<BookingFormData>();

  const selectedTimeSlot = watch("timeSlot");
  const selectedDateValue = watch("selectedDate");

  // Parse stored date string back to a Date object for the calendar
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    if (selectedDateValue) {
      const parsed = new Date(selectedDateValue);
      return isNaN(parsed.getTime()) ? undefined : parsed;
    }
    return undefined;
  });

  const [calendarMonth, setCalendarMonth] = useState<Date>(
    selectedDate ?? new Date(),
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleSelectDay = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    // Format as "d MMMM yyyy" e.g. "16 March 2026"
    const formatted = `${date.getDate()} ${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;
    setValue("selectedDate", formatted, { shouldValidate: true });
  };

  const handleSelectTime = (slot: string) => {
    setValue("timeSlot", slot, { shouldValidate: true });
  };

  const canContinue = selectedDate && selectedTimeSlot;

  const handleBook = () => {
    if (canContinue) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">
          Consultation Type
        </label>
        <Controller
          name="consultationType"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className=" h-[48px] rounded-[12px] border-border">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIDEO">Video Consultation</SelectItem>
                <SelectItem value="AUDIO">Audio Consultation</SelectItem>
                <SelectItem value="CHAT">Chat Consultation</SelectItem>
                <SelectItem value="MEETADOCTOR">
                  In-Person Doctor Visit
                </SelectItem>
                <SelectItem value="HOMESERVICE">
                  Home Visit Consultation
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.consultationType && (
          <p className="text-xs text-destructive mt-1">
            {errors.consultationType.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-10">
        {/* Calendar */}
        <div className="w-full">
          <p className="text-sm font-medium text-foreground mb-4">
            Select Date
          </p>
          <div className="border rounded-xl p-6 bg-card/50 shadow-sm flex justify-center">
            <div className="w-full max-w-[420px]">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleSelectDay}
                month={calendarMonth}
                onMonthChange={setCalendarMonth}
                disabled={{ before: today }}
                components={{
                  DayButton: AnimatedDayButton,
                }}
                className="p-0 w-full"
                classNames={{
                  month_caption:
                    "flex h-[--cell-size] w-full items-center justify-center px-[--cell-size] mb-4",
                }}
              />
            </div>
          </div>
          {errors.selectedDate && (
            <p className="text-xs text-destructive mt-2 text-center">
              {errors.selectedDate.message}
            </p>
          )}
        </div>

        {/* Time slots */}
        <div className="w-full">
          <p className="text-sm font-medium text-foreground mb-4">
            What Time works for you?
          </p>
          <TimeIntervals
            value={selectedTimeSlot}
            onChange={handleSelectTime}
            className="border-none shadow-none bg-transparent"
          />
          {errors.timeSlot && (
            <p className="text-xs text-destructive mt-2">
              {errors.timeSlot.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-2 ">
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
          className={`flex-1 h-12 ${
            !canContinue ? "bg-[#E3E3E3] text-[#FFFFFF]" : ""
          }`}
          onClick={handleBook}
          type="button"
          disabled={!canContinue}
          whileHover={canContinue ? { scale: 1.02 } : {}}
          whileTap={canContinue ? { scale: 0.98 } : {}}
        >
          {isReschedule ? "Reschedule appointment" : "Book appointments"}
        </MotionButton>
      </div>
    </div>
  );
};

export default ChooseTimeSlot;
