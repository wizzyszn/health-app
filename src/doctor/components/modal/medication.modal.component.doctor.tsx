import React, {
  memo,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { FaPlus, FaTrash, FaEye } from "react-icons/fa";
import { useForm, ControllerRenderProps } from "react-hook-form";
import {
  MedicationFormSchema,
  MedicationFormValues,
} from "@/lib/validation-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GeneralReturnInt, RejectedPayload } from "@/lib/types";

import { toast } from "sonner";
import BtnSpinner from "@/shared/components/btn-spinner.component";
import { z } from "zod";
import { PrescribeMedications } from "@/config/service/doctor.service";

// Static arrays for form options
const formulations = ["CAPSULE", "INJECTION", "SYRUP", "TABLET"] as const;
const intervals = ["DAILY", "WEEKLY", "MONTHLY", "AS_NEEDED"] as const;
const doseUnits = [
  "MILLIGRAM",
  "MICROGRAM",
  "PUFFS",
  "TABS",
  "CAB",
  "MLS",
  "LITRE",
] as const;
const durationUnits = ["MINUTE", "HOUR", "DAY", "MONTH"] as const;

// Derive TypeScript types from arrays
type Formulation = (typeof formulations)[number];
type Interval = (typeof intervals)[number];
type DoseUnit = (typeof doseUnits)[number];
type DurationUnit = (typeof durationUnits)[number];

// Default medication values
const defaultMedication: MedicationFormValues = {
  formulation: "CAPSULE",
  drug: "",
  dose_value: 1,
  dose: "",
  dose_unit: "MILLIGRAM",
  interval: "DAILY",
  duration_value: 0,
  duration_unit: "MINUTE",
  duration: "",
};

// Memoized SelectItem to prevent unnecessary renders
const MemoizedSelectItem = memo(
  ({ value, children }: { value: string; children: React.ReactNode }) => (
    <SelectItem value={value}>{children}</SelectItem>
  ),
  (prev, next) => prev.value === next.value && prev.children === next.children,
);

// Memoized SelectContent to avoid re-rendering option lists
const MemoizedSelectContent = memo(
  ({ children }: { children: React.ReactNode }) => (
    <SelectContent>{children}</SelectContent>
  ),
  (prev, next) => prev.children === next.children,
);

type Props = {
  open: boolean;
  setOpenModal: React.Dispatch<SetStateAction<boolean>>;
  consultationId?: string;
  onOpenChange: (open: boolean) => void;
};

function Medication({
  open,
  onOpenChange,
  consultationId,
  setOpenModal,
}: Props) {
  const [formIndex, setFormIndex] = useState(0);
  const [medications, setMedications] = useState<MedicationFormValues[]>([
    { ...defaultMedication },
  ]);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const form = useForm<MedicationFormValues>({
    resolver: zodResolver(MedicationFormSchema),
    defaultValues: { ...defaultMedication },
  });
  const queryClient = useQueryClient();

  // Load form data when tab changes
  useEffect(() => {
    if (medications[formIndex]) {
      form.reset(medications[formIndex]);
      setIsFormDirty(false);
    } else {
      form.reset(defaultMedication);
      setIsFormDirty(false);
    }
  }, [formIndex, form, medications]);

  // Mark form as dirty on change
  useEffect(() => {
    const subscription = form.watch(() => {
      setIsFormDirty(true);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Define mutation with derived types
  const { isPending, mutate, isError } = useMutation<
    GeneralReturnInt<null>,
    RejectedPayload,
    {
      formulation: Formulation;
      drug: string;
      dose_value: string;
      dose_unit: DoseUnit;
      dose?: string;
      interval: Interval;
      duration_value: string;
      duration_unit: DurationUnit;
      duration?: string;
    }[]
  >({
    mutationFn: (variables) => PrescribeMedications(consultationId!, variables),
    onSuccess: (res) => {
      toast.success(res.response_description);
      queryClient.invalidateQueries({
        queryKey: ["medications_doc"],
      });
      onClose();
    },
    onError: (error) => {
      toast.error(
        error.message || "Failed to save medications. Please try again later.",
      );
    },
  });

  // Save current form before changing tabs
  const handleTabChange = useCallback(
    (index: number) => {
      if (isFormDirty) {
        const currentFormData = form.getValues();
        setMedications((prev) => {
          const updated = [...prev];
          updated[formIndex] = currentFormData;
          return updated;
        });
      }
      setFormIndex(index);
      setIsFormDirty(false);
    },
    [formIndex, form, isFormDirty],
  );

  // Add new medication tab
  const handleAddMedication = useCallback(() => {
    if (isFormDirty) {
      const currentFormData = form.getValues();
      setMedications((prev) => {
        const updated = [...prev];
        updated[formIndex] = currentFormData;
        return updated;
      });
    }

    setMedications((prev) => [...prev, { ...defaultMedication }]);
    setFormIndex(medications.length);
    form.reset(defaultMedication);
    setIsFormDirty(false);
  }, [medications.length, formIndex, form, isFormDirty]);

  // Delete medication tab
  const handleDeleteMedication = useCallback(
    (index: number) => {
      if (medications.length <= 1) {
        return;
      }

      setMedications((prev) => prev.filter((_, i) => i !== index));

      if (index <= formIndex) {
        setFormIndex(Math.max(0, formIndex - 1));
      }
    },
    [medications.length, formIndex],
  );

  // Preview medications before saving
  const handlePreview = useCallback(() => {
    if (isFormDirty) {
      const currentFormData = form.getValues();
      setMedications((prev) => {
        const updated = [...prev];
        updated[formIndex] = currentFormData;
        return updated;
      });
      setIsFormDirty(false);
    }

    setPreviewOpen(true);
  }, [medications, formIndex, form, isFormDirty]);

  // Memoize onValueChange for Select components
  const handleSelectChange = useCallback(
    (field: keyof MedicationFormValues) => (value: string) => {
      form.setValue(field, value);
      setIsFormDirty(true);
    },
    [form],
  );

  const onClose = () => {
    setOpenModal(false);
  };

  const handleSubmit = useCallback(
    () => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      e.preventDefault();
      if (!consultationId) {
        toast.error("Consultation ID is missing. Please try again.");
        return;
      }

      if (medications.length === 0) {
        toast.error(
          "No medications to save. Please add at least one medication.",
        );
        return;
      }

      try {
        const refinedData = medications.map((med, index) => {
          const validated = MedicationFormSchema.parse(med);
          const doseValue = Number(validated.dose_value);
          const durationValue = Number(validated.duration_value);

          if (isNaN(doseValue) || doseValue <= 0) {
            throw new Error(`Invalid dose value for medication ${index + 1}`);
          }
          if (isNaN(durationValue) || durationValue < 0) {
            throw new Error(
              `Invalid duration value for medication ${index + 1}`,
            );
          }

          return {
            ...validated,
            dose: `${doseValue} ${validated.dose_unit}`,
            duration: `${durationValue} ${validated.duration_unit}`,
            duration_value: String(durationValue),
            dose_value: String(doseValue),
          };
        });

        mutate(refinedData);
      } catch (error) {
        const errorMessage =
          error instanceof z.ZodError
            ? "Please ensure all medication fields are valid."
            : (error as Error).message ||
              "Invalid medication data. Please check your inputs.";
        toast.error(errorMessage);
      }
    },
    [consultationId, medications, mutate],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-full min-h-full overflow-scroll">
        <DialogHeader>Prescribe Medications</DialogHeader>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="medication-container"
        >
          {/* Header Section */}
          <div className="tabs-header flex border-b-2 gap-4 items-center p-2">
            <MedicationsHeaders
              medications={medications}
              formIndex={formIndex}
              setFormIndex={handleTabChange}
              onDelete={handleDeleteMedication}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddMedication}
              className="ml-2"
            >
              <FaPlus className="text-[#2563eb]" />
            </Button>
          </div>

          {/* Form */}
          <Form {...form}>
            <form className="flex flex-col gap-3 p-2">
              <FormulationField
                form={form}
                handleSelectChange={handleSelectChange}
              />
              <FormField
                control={form.control}
                name="drug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Drug Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter drug name"
                        className="p-5 rounded-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="dose_value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dose Value</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => {
                              field.onChange(parseFloat(e.target.value) || 0);
                              setIsFormDirty(true);
                            }}
                            placeholder="Enter dose value"
                            className="p-5 rounded-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex-1">
                  <DoseUnitField
                    form={form}
                    handleSelectChange={handleSelectChange}
                  />
                </div>
              </div>

              <IntervalField
                form={form}
                handleSelectChange={handleSelectChange}
              />

              <div className="flex gap-4">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="duration_value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration Value</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => {
                              field.onChange(parseFloat(e.target.value) || 0);
                              setIsFormDirty(true);
                            }}
                            placeholder="Enter duration value"
                            className="p-5 rounded-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex-1">
                  <DurationUnitField
                    form={form}
                    handleSelectChange={handleSelectChange}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <Button
                  type="button"
                  onClick={handlePreview}
                  className="flex items-center gap-2 bg-[#2563eb]"
                  disabled={medications.length === 0}
                >
                  <FaEye size={14} /> Preview Medications
                </Button>
              </div>
            </form>
          </Form>

          {/* Preview Dialog */}
          <MedicationPreviewDialog
            open={previewOpen}
            onOpenChange={(open) => setPreviewOpen(open)}
            medications={medications}
            onClose={() => {
              if (!isError) {
                setPreviewOpen(false);
                setOpenModal(false);
              }
            }}
            onSave={handleSubmit}
            loading={isPending}
          />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

// Medication Preview Dialog
const MedicationPreviewDialog = memo(
  ({
    open,
    onOpenChange,
    medications,
    onSave,
    loading,
  }: {
    open: boolean;
    medications: MedicationFormValues[];
    onClose: () => void;
    onSave: () => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    loading: boolean;
    onOpenChange: (open: boolean) => void;
  }) => {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto rounded-none">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Medication Preview
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {medications.map((med, index) => (
              <MedicationQueen key={index} medication={med} index={index} />
            ))}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={loading}>
                Edit Medications
              </Button>
            </DialogClose>
            <Button
              onClick={onSave()}
              className="bg-[#2563eb]"
              disabled={loading || medications.length === 0}
            >
              {loading ? <BtnSpinner /> : "Save All Medications"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);

// Medication Card for Preview
const MedicationQueen = ({
  medication,
  index,
}: {
  medication: MedicationFormValues;
  index: number;
}) => {
  const title = medication.drug || `Medication ${index + 1}`;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-blue-50 pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <CardDescription>
          {medication.formulation} • {medication.dose_value}{" "}
          {medication.dose_unit}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-600">Dosing:</span>
            <span>{medication.interval}</span>
          </div>

          {medication.duration_value !== 0 && (
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-600">Duration:</span>
              <span>
                {medication.duration_value} {medication.duration_unit}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Medication Headers with delete button
const MedicationsHeaders = memo(
  ({
    medications,
    formIndex,
    setFormIndex,
    onDelete,
  }: {
    medications: MedicationFormValues[];
    formIndex: number;
    setFormIndex: (index: number) => void;
    onDelete: (index: number) => void;
  }) => {
    return (
      <div className="flex overflow-x-auto gap-1 items-center" role="tablist">
        {medications.map((med, i) => (
          <div
            key={i}
            className="flex items-center"
            role="tab"
            aria-selected={formIndex === i}
          >
            <button
              onClick={() => setFormIndex(i)}
              className={`px-3 py-2 whitespace-nowrap ${
                formIndex === i
                  ? "border-b-2 border-blue-600 font-medium text-blue-600"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              {med.drug ? med.drug : `Medication ${i + 1}`}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(i);
              }}
              className="ml-1 text-gray-400 hover:text-red-500"
              aria-label={`Delete medication ${i + 1}`}
            >
              <FaTrash size={12} />
            </button>
          </div>
        ))}
      </div>
    );
  },
);

interface FieldProps {
  form: ReturnType<typeof useForm<MedicationFormValues>>;
  handleSelectChange: (
    field: keyof MedicationFormValues,
  ) => (value: string) => void;
}

const FormulationField = memo(
  ({ form, handleSelectChange }: FieldProps) => {
    const renderField = useCallback(
      ({
        field,
      }: {
        field: ControllerRenderProps<MedicationFormValues, "formulation">;
      }) => (
        <FormItem>
          <FormLabel>Formulation</FormLabel>
          <FormControl>
            <Select
              onValueChange={handleSelectChange("formulation")}
              defaultValue={field.value}
              value={field.value}
            >
              <SelectTrigger className="rounded-sm p-5">
                <SelectValue placeholder="Select formulation" />
              </SelectTrigger>
              <MemoizedSelectContent>
                {formulations.map((formula) => (
                  <MemoizedSelectItem value={formula} key={formula}>
                    {formula}
                  </MemoizedSelectItem>
                ))}
              </MemoizedSelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      ),
      [handleSelectChange],
    );
    return (
      <FormField
        control={form.control}
        name="formulation"
        render={renderField}
      />
    );
  },
  (prev, next) =>
    prev.form === next.form &&
    prev.handleSelectChange === next.handleSelectChange,
);

const DoseUnitField = memo(
  ({ form, handleSelectChange }: FieldProps) => {
    const renderField = useCallback(
      ({
        field,
      }: {
        field: ControllerRenderProps<MedicationFormValues, "dose_unit">;
      }) => {
        return (
          <FormItem>
            <FormLabel>Dose Unit</FormLabel>
            <FormControl>
              <Select
                onValueChange={handleSelectChange("dose_unit")}
                defaultValue={field.value}
                value={field.value}
              >
                <SelectTrigger className="rounded-sm p-5">
                  <SelectValue placeholder="Select dose unit" />
                </SelectTrigger>
                <MemoizedSelectContent>
                  {doseUnits.map((unit) => (
                    <MemoizedSelectItem value={unit} key={unit}>
                      {unit}
                    </MemoizedSelectItem>
                  ))}
                </MemoizedSelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      },
      [handleSelectChange],
    );
    return (
      <FormField control={form.control} name="dose_unit" render={renderField} />
    );
  },
  (prev, next) =>
    prev.form === next.form &&
    prev.handleSelectChange === next.handleSelectChange,
);

const IntervalField = memo(({ form, handleSelectChange }: FieldProps) => {
  const renderField = useCallback(
    ({
      field,
    }: {
      field: ControllerRenderProps<MedicationFormValues, "interval">;
    }) => {
      return (
        <FormItem>
          <FormLabel>Interval</FormLabel>
          <FormControl>
            <Select
              onValueChange={handleSelectChange("interval")}
              defaultValue={field.value}
              value={field.value}
            >
              <SelectTrigger className="rounded-sm p-5">
                <SelectValue placeholder="Select Interval" />
              </SelectTrigger>
              <MemoizedSelectContent>
                {intervals.map((interval) => (
                  <MemoizedSelectItem value={interval} key={interval}>
                    {interval}
                  </MemoizedSelectItem>
                ))}
              </MemoizedSelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      );
    },
    [handleSelectChange],
  );
  return (
    <FormField control={form.control} name="interval" render={renderField} />
  );
});

const DurationUnitField = memo(({ form, handleSelectChange }: FieldProps) => {
  const renderField = useCallback(
    ({
      field,
    }: {
      field: ControllerRenderProps<MedicationFormValues, "duration_unit">;
    }) => {
      return (
        <FormItem>
          <FormLabel>Duration Unit</FormLabel>
          <FormControl>
            <Select
              onValueChange={handleSelectChange("duration_unit")}
              defaultValue={field.value}
              value={field.value}
            >
              <SelectTrigger className="rounded-sm p-5">
                <SelectValue placeholder="Select duration unit" />
              </SelectTrigger>
              <MemoizedSelectContent>
                {durationUnits.map((unit) => (
                  <MemoizedSelectItem value={unit} key={unit}>
                    {unit}
                  </MemoizedSelectItem>
                ))}
              </MemoizedSelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      );
    },
    [handleSelectChange],
  );
  return (
    <FormField
      control={form.control}
      name="duration_unit"
      render={renderField}
    />
  );
});

export default memo(Medication);
