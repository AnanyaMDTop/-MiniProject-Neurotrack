"use client";

import { LocationFeature } from "@/components/app/location-feature";

export default function LocationFeaturePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-8 flex justify-center">
      <div className="w-full max-w-5xl">
        <LocationFeature />
      </div>
    </div>
  );
}
