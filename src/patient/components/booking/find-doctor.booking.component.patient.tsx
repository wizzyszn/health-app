import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NoDoctorIcon from "@/shared/components/svgs/icons/no-doctor.icon";
import {
  lookupAvailableDoctorsReq,
  searchDoctorsReq,
} from "@/config/service/patient.service";
import type { BookingFormData } from "@/patient/lib/schemas";
import { format } from "date-fns";

interface FindDoctorProps {
  onNext: () => void;
  onBack: () => void;
}

const AVATAR_COLORS = [
  "bg-amber-100 text-amber-700",
  "bg-pink-100 text-pink-700",
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-purple-100 text-purple-700",
  "bg-rose-100 text-rose-700",
];

const getInitials = (firstName: string, lastName: string) =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

const MotionButton = motion.create(Button);

const FindDoctor = ({ onNext, onBack }: FindDoctorProps) => {
  const { setValue, watch } = useFormContext<BookingFormData>();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const selectedDate = watch("selectedDate");
  const currentDoctorId = watch("doctorId");

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => {
      setDebouncedSearch(value);
    }, 400);
    setDebounceTimer(timer);
  };

  const isSearching = debouncedSearch.length >= 1;

  const {
    data: searchResponse,
    isLoading: isSearchLoading,
    isError: isSearchError,
  } = useQuery({
    queryKey: ["searchDoctors", debouncedSearch, selectedDate],
    queryFn: () => {
      const params: Parameters<typeof searchDoctorsReq>[0] = {
        q: debouncedSearch,
      };
      if (selectedDate) {
        params.date = format(new Date(selectedDate), "yyyy-MM-dd");
      }
      return searchDoctorsReq(params);
    },
    enabled: isSearching,
  });

  const {
    data: availableResponse,
    isLoading: isAvailableLoading,
    isError: isAvailableError,
  } = useQuery({
    queryKey: ["availableDoctors", selectedDate],
    queryFn: () => {
      const params: Parameters<typeof lookupAvailableDoctorsReq>[0] = {};
      if (selectedDate) {
        params.date = format(new Date(selectedDate), "yyyy-MM-dd");
      }
      return lookupAvailableDoctorsReq(params);
    },
    enabled: !isSearching,
  });

  const isLoading = isSearching ? isSearchLoading : isAvailableLoading;
  const isError = isSearching ? isSearchError : isAvailableError;
  const currentResponse = isSearching ? searchResponse : availableResponse;
  const doctors = currentResponse?.data ?? [];

  // Derived state to determine which doctor is currently active/selected
  const isCurrentDoctorInList = doctors.some((d) => d._id === currentDoctorId);
  const activeDoctor = isCurrentDoctorInList
    ? doctors.find((d) => d._id === currentDoctorId)
    : doctors[0];
  const activeDoctorId = activeDoctor?._id;

  const handleSelectDoctor = (doctor: (typeof doctors)[0]) => {
    setValue("doctorId", doctor._id, { shouldValidate: true });
    setValue("doctorName", doctor.full_name, { shouldValidate: true });
    setValue(
      "doctorSpecialty",
      doctor.specializations?.[0] ?? "General Physician",
      { shouldValidate: true },
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
  };

  const canContinue = !!activeDoctorId;

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex-1 space-y-5">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by name or Specialty"
            className="pl-10 pr-10 border-border transition-colors hover:border-border/80 focus-visible:ring-primary/50 h-12"
          />
          <AnimatePresence>
            {search && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => {
                  setSearch("");
                  setDebouncedSearch("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Loading state */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
            <p className="text-sm text-muted-foreground">
              {isSearching
                ? "Searching doctors…"
                : "Loading available doctors…"}
            </p>
          </motion.div>
        )}

        {/* Error state */}
        {isError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <p className="text-sm text-destructive mb-1">
              Something went wrong while fetching doctors.
            </p>
            <p className="text-xs text-muted-foreground">
              Please try again later.
            </p>
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence mode="wait">
          {!isLoading && !isError && (
            <motion.div
              key={isSearching ? "search-results" : "available-results"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {!isSearching && (
                <p className="text-sm font-medium text-foreground mb-3">
                  Available Doctors
                </p>
              )}

              {doctors.length > 0 ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-2 max-h-[400px] overflow-y-auto pr-2"
                >
                  {doctors.map((doctor, index) => {
                    const isSelected = activeDoctorId === doctor._id;
                    return (
                      <motion.div
                        key={doctor._id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-transparent hover:border-border hover:bg-muted/50 bg-card"
                        }`}
                        onClick={() => handleSelectDoctor(doctor)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            {doctor.profile_picture_url ? (
                              <AvatarImage
                                src={doctor.profile_picture_url}
                                alt={doctor.full_name}
                              />
                            ) : null}
                            <AvatarFallback
                              className={
                                AVATAR_COLORS[index % AVATAR_COLORS.length]
                              }
                            >
                              {getInitials(doctor.first_name, doctor.last_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-foreground line-clamp-1">
                              {doctor.full_name}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {doctor.specializations?.join(", ") ||
                                "General Physician"}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="shrink-0 ml-2 rounded-full px-3 py-1 bg-primary text-primary-foreground text-xs font-medium">
                            Selected
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-10 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <NoDoctorIcon size={80} />
                  </div>
                  <p className="font-semibold text-foreground mb-1">
                    {isSearching ? "No doctors found" : "No available doctors"}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4 max-w-[260px]">
                    {isSearching
                      ? "We couldn't find any doctors matching your search."
                      : "There are currently no doctors available."}
                  </p>
                  {isSearching && (
                    <MotionButton
                      onClick={() => {
                        setSearch("");
                        setDebouncedSearch("");
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Clear search
                    </MotionButton>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-3 pt-2 mt-auto">
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
          onClick={() => {
            if (canContinue) {
              if (activeDoctor && currentDoctorId !== activeDoctor._id) {
                handleSelectDoctor(activeDoctor);
              }
              onNext();
            }
          }}
          type="button"
          disabled={!canContinue}
          whileHover={canContinue ? { scale: 1.02 } : {}}
          whileTap={canContinue ? { scale: 0.98 } : {}}
        >
          Continue
        </MotionButton>
      </div>
    </div>
  );
};

export default FindDoctor;
