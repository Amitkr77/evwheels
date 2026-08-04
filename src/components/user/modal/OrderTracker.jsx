"use client";

import { humanizeStatus } from "@/lib/format";

const steps = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];

export default function OrderTracker({ status }) {
  // A cancelled order isn't a step on the PLACED→DELIVERED line — rendering
  // it against that scale (as index -1) used to make a cancelled order look
  // identical to a freshly-placed one, since neither step lit up.
  if (status === "CANCELLED") {
    return (
      <div className="mt-6 flex items-center justify-center gap-2 py-3 px-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
        This order has been cancelled
      </div>
    );
  }

  const currentStep = steps.indexOf(status);

  return (
    <div className="flex items-center justify-between mt-6">
      {steps.map((step, index) => {
        const active = index <= currentStep;

        return (
          <div key={step} className="flex-1 flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
              ${active ? "bg-[#19B5D8] text-white" : "bg-neutral-200 text-neutral-500"}`}
            >
              {index + 1}
            </div>

            <p
              className={`text-xs mt-2 ${
                active ? "text-[#19B5D8]" : "text-neutral-400"
              }`}
            >
              {humanizeStatus(step)}
            </p>

            {index !== steps.length - 1 && (
              <div
                className={`h-1 w-full mt-3 ${
                  index < currentStep ? "bg-[#19B5D8]" : "bg-neutral-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
