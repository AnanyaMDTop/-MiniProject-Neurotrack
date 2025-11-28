"use client";

import { PatientPeople } from "@/components/app/patientpeople";

export default function PatientPeoplePage() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-purple-50 to-purple-100 p-6">
      <div className="w-full max-w-4xl">
        <PatientPeople />
      </div>
    </div>
  );
}
