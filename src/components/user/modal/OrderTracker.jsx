"use client";

import { useEffect, useState } from "react";
import { humanizeStatus } from "@/lib/format";
import { MapPin, ExternalLink, Loader2 } from "lucide-react";

const steps = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];

// Fetch live tracking when the order is at or past CONFIRMED
const TRACKABLE_STATUSES = ["CONFIRMED", "SHIPPED", "DELIVERED"];

export default function OrderTracker({ status, orderId }) {
  const [tracking, setTracking] = useState(null);
  const [loadingTracking, setLoadingTracking] = useState(false);

  useEffect(() => {
    if (!orderId || !TRACKABLE_STATUSES.includes(status)) return;

    let cancelled = false;
    setLoadingTracking(true);

    fetch(`/api/orders/track?orderId=${orderId}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d.success) setTracking(d);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoadingTracking(false); });

    return () => { cancelled = true; };
  }, [orderId, status]);

  if (status === "CANCELLED") {
    return (
      <div className="mt-6 flex items-center justify-center gap-2 py-3 px-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
        This order has been cancelled
      </div>
    );
  }

  const currentStep = steps.indexOf(status);
  const sr = tracking?.shiprocket;
  const history = tracking?.trackingHistory || [];

  return (
    <div>
      {/* ── Step tracker ── */}
      <div className="flex items-center mt-6">
        {steps.map((step, index) => {
          const active = index <= currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={step} className={`flex items-center ${!isLast ? "flex-1" : ""}`}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors
                    ${active ? "bg-[#19B5D8] text-white" : "bg-neutral-200 text-neutral-500"}`}
                >
                  {index + 1}
                </div>
                <p className={`text-xs mt-1.5 whitespace-nowrap ${active ? "text-[#19B5D8] font-medium" : "text-neutral-400"}`}>
                  {humanizeStatus(step)}
                </p>
              </div>
              {!isLast && (
                <div className={`flex-1 h-0.5 mx-1 mb-4 ${index < currentStep ? "bg-[#19B5D8]" : "bg-neutral-200"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Live tracking section ── */}
      {loadingTracking && (
        <div className="mt-5 flex items-center gap-2 text-sm text-neutral-500">
          <Loader2 size={14} className="animate-spin" /> Loading tracking info…
        </div>
      )}

      {!loadingTracking && sr && (sr.awbCode || sr.shippingStatus) && (
        <div className="mt-5 border border-neutral-200 rounded-xl overflow-hidden">
          {/* Courier info bar */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 px-4 py-3 bg-neutral-50 border-b border-neutral-100">
            {sr.courierName && (
              <div>
                <p className="text-[10px] text-neutral-400 uppercase tracking-wide">Courier</p>
                <p className="text-sm font-medium text-neutral-800">{sr.courierName}</p>
              </div>
            )}
            {sr.awbCode && (
              <div>
                <p className="text-[10px] text-neutral-400 uppercase tracking-wide">AWB</p>
                <p className="text-sm font-mono text-neutral-800">{sr.awbCode}</p>
              </div>
            )}
            {sr.etd && (
              <div>
                <p className="text-[10px] text-neutral-400 uppercase tracking-wide">Expected By</p>
                <p className="text-sm font-medium text-neutral-800">
                  {new Date(sr.etd).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            )}
            {sr.trackingUrl && (
              <a
                href={sr.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-1 text-xs text-[#19B5D8] hover:underline"
              >
                Track on courier <ExternalLink size={11} />
              </a>
            )}
          </div>

          {/* Scan events */}
          {history.length > 0 && (
            <div className="px-4 py-4">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Shipment Events</p>
              <ol className="relative border-l border-neutral-200 space-y-0 ml-1">
                {history.slice(0, 6).map((event, i) => (
                  <li key={i} className="ml-4 pb-4 last:pb-0">
                    <div className="absolute -left-[5px] w-2.5 h-2.5 rounded-full border-2 border-white bg-[#19B5D8] mt-0.5" />
                    <p className="text-sm font-medium text-neutral-900 leading-tight">{event.status}</p>
                    {event.location && (
                      <p className="flex items-center gap-1 text-xs text-neutral-500 mt-0.5">
                        <MapPin size={10} /> {event.location}
                      </p>
                    )}
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {event.date ? new Date(event.date).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—"}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* No scan events yet but AWB exists */}
          {history.length === 0 && sr.awbCode && (
            <p className="px-4 py-4 text-sm text-neutral-400">
              Your package has been handed to {sr.courierName || "the courier"}. Scan events will appear here once the shipment is picked up.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
