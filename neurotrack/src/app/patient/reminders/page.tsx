"use client";

import { PatientReminders } from "@/components/app/patientreminder";

export default function RemindersPage() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-blue-50 to-blue-100 p-6">
      <div className="w-full max-w-3xl">
        <PatientReminders />
      </div>
    </div>
  );
}
