import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import Booking from "./modals/booking.modal.component.patient";
import useUrlSearchParams from "@/shared/hooks/use-url-search-params";

function BookConsultationBtn() {
  const { getParam, deleteParam } = useUrlSearchParams();
  const stepParam = getParam("step");

  const [open, setOpen] = useState(stepParam !== null && stepParam !== "");

  useEffect(() => {
    setOpen(stepParam !== null && stepParam !== "");
  }, [stepParam]);

  const handleOpen = (isOpen: boolean) => {
    if (!isOpen) {
      deleteParam("step");
      if (getParam("appointmentId")) deleteParam("appointmentId");
      if (getParam("mode")) deleteParam("mode");
    }
    setOpen(isOpen);
  };

  return (
    <>
      <Button
        onClick={() => handleOpen(true)}
        className="transition-all duration-300 hover:shadow-md hover:-translate-y-1 active:translate-y-0 active:scale-95"
      >
        Book a consultation
      </Button>
      <Dialog open={open} onOpenChange={handleOpen}>
        <DialogContent className="min-w-[1080px] h-[85vh] flex flex-col overflow-hidden">
          <BookConsultationForm />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default BookConsultationBtn;

const BookConsultationForm = () => {
  return <Booking />;
};
