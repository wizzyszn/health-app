import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ReferralModalProps {
  onClose: () => void;
}

export function ReferralModal({ onClose }: ReferralModalProps) {
  const [formData, setFormData] = useState({
    specialistName: "",
    hospitalName: "",
    referralDetails: "",
  });

  const handleSave = () => {
    alert("Referral saved successfully");
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[700px] p-0 gap-0 overflow-hidden bg-white">
        {/* Header */}
        <DialogHeader className="px-6 py-4 flex flex-row items-center justify-between border-b border-gray-200 space-y-0">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Referral
          </DialogTitle>
        </DialogHeader>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Specialist Name</label>
            <input
              type="text"
              value={formData.specialistName}
              onChange={(e) =>
                setFormData({ ...formData, specialistName: e.target.value })
              }
              placeholder="Enter specialist name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5164E8]"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Hospital Name</label>
            <select
              value={formData.hospitalName}
              onChange={(e) =>
                setFormData({ ...formData, hospitalName: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5164E8]"
            >
              <option value="">Select Hospital</option>
              <option value="Springfield General Hospital">
                Springfield General Hospital - 123 Main St, Springfield
              </option>
              <option value="City Medical Center">
                City Medical Center - 456 Oak Ave, Springfield
              </option>
              <option value="University Hospital">
                University Hospital - 789 College Rd, Springfield
              </option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Referral Details</label>
            <textarea
              value={formData.referralDetails}
              onChange={(e) =>
                setFormData({ ...formData, referralDetails: e.target.value })
              }
              placeholder="Enter detailed reason for referral"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5164E8] min-h-[150px]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-[#5164E8] text-white rounded-lg hover:bg-[#4153D7] transition-colors"
          >
            Save
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
