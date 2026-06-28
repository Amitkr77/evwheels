"use client";

const steps = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];

export default function OrderTracker({ status }) {
  const currentStep = steps.indexOf(status);

  return (
    <div className="flex items-center justify-between mt-6">
      {steps.map((step, index) => {
        const active = index <= currentStep;

        return (
          <div key={step} className="flex-1 flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
              ${active ? "bg-[#19B5D8] text-white" : "bg-gray-200 text-gray-500"}`}
            >
              {index + 1}
            </div>

            <p
              className={`text-xs mt-2 ${
                active ? "text-[#19B5D8]" : "text-gray-400"
              }`}
            >
              {step}
            </p>

            {index !== steps.length - 1 && (
              <div
                className={`h-1 w-full mt-3 ${
                  index < currentStep ? "bg-[#19B5D8]" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}