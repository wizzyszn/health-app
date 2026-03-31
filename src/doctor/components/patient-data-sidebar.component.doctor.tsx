import { User, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface ConsultationRecord {
  date: string;
  time: string;
  type: string;
  bookingRef: string;
  doctor: string;
  diagnosis: string;
}

interface InvestigationRecord {
  date: string;
  bookingRef: string;
  invest1: string;
  invest2: string;
  invest3: string;
}

interface MedicationRecord {
  date: string;
  bookingRef: string;
  med1: string;
  med2: string;
}

interface ReferralRecord {
  date: string;
  bookingRef: string;
  referral: string;
}

const consultations: ConsultationRecord[] = [
  {
    date: "2026-03-20",
    time: "10:30",
    type: "Follow-up",
    bookingRef: "BK-1023",
    doctor: "Dr. Smith",
    diagnosis: "Hypertension",
  },
  {
    date: "2026-02-15",
    time: "14:00",
    type: "Initial",
    bookingRef: "BK-0892",
    doctor: "Dr. Sarah",
    diagnosis: "Diabetes Type 2",
  },
  {
    date: "2026-01-10",
    time: "09:15",
    type: "Follow-up",
    bookingRef: "BK-0654",
    doctor: "Dr. Jones",
    diagnosis: "Hypertension",
  },
];

const investigations: InvestigationRecord[] = [
  {
    date: "2026-03-18",
    bookingRef: "BK-1023",
    invest1: "Blood Glucose",
    invest2: "HbA1c",
    invest3: "Lipid Panel",
  },
  {
    date: "2026-02-12",
    bookingRef: "BK-0892",
    invest1: "ECG",
    invest2: "Chest X-ray",
    invest3: "CBC",
  },
];

const medications: MedicationRecord[] = [
  {
    date: "2026-03-20",
    bookingRef: "BK-1023",
    med1: "Metformin 500mg",
    med2: "Lisinopril 10mg",
  },
  {
    date: "2026-02-15",
    bookingRef: "BK-0892",
    med1: "Atorvastatin 20mg",
    med2: "Aspirin 75mg",
  },
];

const referrals: ReferralRecord[] = [
  {
    date: "2026-02-15",
    bookingRef: "BK-0892",
    referral: "Cardiology - Dr. Martinez",
  },
];

export function PatientDataSidebar() {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "consultations",
  );

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="bg-white border-r border-[#E5E7EB] overflow-y-auto h-full shadow-sm">
      <div className="p-6">
        {/* Patient Profile Picture */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-[#5164E8] rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Patient Info Stack */}
        <div className="space-y-3 mb-6">
          <h2 className="text-[#1F2937] text-center">John Michael Anderson</h2>
          <div className="text-[#4B5563] space-y-1">
            <p>
              <span className="font-semibold">Age:</span> 58 years
            </p>
            <p>
              <span className="font-semibold">DOB:</span> 1968-05-12
            </p>
            <p>
              <span className="font-semibold">MRN:</span> MRN-45892
            </p>
            <p>
              <span className="font-semibold">Address:</span> 123 Maple Street,
              Springfield
            </p>
            <p>
              <span className="font-semibold">Marital Status:</span> Married
            </p>
            <p>
              <span className="font-semibold">Occupation:</span> Accountant
            </p>
          </div>

          {/* Allergies */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[#4B5563] font-semibold">Allergies:</span>
            <span className="px-3 py-1 bg-[#00C48C] text-white rounded-full text-sm">
              No Known Allergy
            </span>
          </div>

          {/* Medical Icons */}
          <div className="flex items-center gap-2 mt-3">
            <div className="w-8 h-8 bg-[#FFB800] rounded-full flex items-center justify-center text-white font-bold text-sm">
              D
            </div>
            <div className="w-8 h-8 bg-[#FF6B6B] rounded-full flex items-center justify-center text-white font-bold text-sm">
              H
            </div>
          </div>
        </div>

        {/* Expandable Cards */}
        <div className="space-y-3">
          {/* Consultations */}
          <div className="bg-[#F9FAFB] rounded-lg overflow-hidden border border-[#E5E7EB]">
            <button
              onClick={() => toggleSection("consultations")}
              className="w-full flex items-center justify-between p-4 hover:bg-[#F3F4F6] transition-colors"
            >
              <span className="text-[#1F2937] font-semibold">
                Consultations
              </span>
              {expandedSection === "consultations" ? (
                <ChevronDown className="w-5 h-5 text-[#6B7280]" />
              ) : (
                <ChevronRight className="w-5 h-5 text-[#6B7280]" />
              )}
            </button>
            {expandedSection === "consultations" && (
              <div className="p-4 pt-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-[#6B7280] border-b border-[#E5E7EB]">
                        <th className="text-left py-2 px-1">Date</th>
                        <th className="text-left py-2 px-1">Type</th>
                        <th className="text-left py-2 px-1">Doctor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {consultations.map((consult, idx) => (
                        <tr
                          key={idx}
                          className="text-[#374151] hover:bg-[#F3F4F6] cursor-pointer transition-colors"
                        >
                          <td className="py-2 px-1">{consult.date}</td>
                          <td className="py-2 px-1">{consult.type}</td>
                          <td className="py-2 px-1">{consult.doctor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Investigations */}
          <div className="bg-[#F9FAFB] rounded-lg overflow-hidden border border-[#E5E7EB]">
            <button
              onClick={() => toggleSection("investigations")}
              className="w-full flex items-center justify-between p-4 hover:bg-[#F3F4F6] transition-colors"
            >
              <span className="text-[#1F2937] font-semibold">
                Investigations
              </span>
              {expandedSection === "investigations" ? (
                <ChevronDown className="w-5 h-5 text-[#6B7280]" />
              ) : (
                <ChevronRight className="w-5 h-5 text-[#6B7280]" />
              )}
            </button>
            {expandedSection === "investigations" && (
              <div className="p-4 pt-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-[#6B7280] border-b border-[#E5E7EB]">
                        <th className="text-left py-2 px-1">Date</th>
                        <th className="text-left py-2 px-1">Investigation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {investigations.map((inv, idx) => (
                        <tr
                          key={idx}
                          className="text-[#374151] hover:bg-[#F3F4F6] cursor-pointer transition-colors"
                        >
                          <td className="py-2 px-1">{inv.date}</td>
                          <td className="py-2 px-1">{inv.invest1}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Medications */}
          <div className="bg-[#F9FAFB] rounded-lg overflow-hidden border border-[#E5E7EB]">
            <button
              onClick={() => toggleSection("medications")}
              className="w-full flex items-center justify-between p-4 hover:bg-[#F3F4F6] transition-colors"
            >
              <span className="text-[#1F2937] font-semibold">Medications</span>
              {expandedSection === "medications" ? (
                <ChevronDown className="w-5 h-5 text-[#6B7280]" />
              ) : (
                <ChevronRight className="w-5 h-5 text-[#6B7280]" />
              )}
            </button>
            {expandedSection === "medications" && (
              <div className="p-4 pt-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-[#6B7280] border-b border-[#E5E7EB]">
                        <th className="text-left py-2 px-1">Date</th>
                        <th className="text-left py-2 px-1">Medication</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medications.map((med, idx) => (
                        <tr
                          key={idx}
                          className="text-[#374151] hover:bg-[#F3F4F6] cursor-pointer transition-colors"
                        >
                          <td className="py-2 px-1">{med.date}</td>
                          <td className="py-2 px-1">{med.med1}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Referrals */}
          <div className="bg-[#F9FAFB] rounded-lg overflow-hidden border border-[#E5E7EB]">
            <button
              onClick={() => toggleSection("referrals")}
              className="w-full flex items-center justify-between p-4 hover:bg-[#F3F4F6] transition-colors"
            >
              <span className="text-[#1F2937] font-semibold">Referrals</span>
              {expandedSection === "referrals" ? (
                <ChevronDown className="w-5 h-5 text-[#6B7280]" />
              ) : (
                <ChevronRight className="w-5 h-5 text-[#6B7280]" />
              )}
            </button>
            {expandedSection === "referrals" && (
              <div className="p-4 pt-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-[#6B7280] border-b border-[#E5E7EB]">
                        <th className="text-left py-2 px-1">Date</th>
                        <th className="text-left py-2 px-1">Referral</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referrals.map((ref, idx) => (
                        <tr
                          key={idx}
                          className="text-[#374151] hover:bg-[#F3F4F6] cursor-pointer transition-colors"
                        >
                          <td className="py-2 px-1">{ref.date}</td>
                          <td className="py-2 px-1">{ref.referral}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
