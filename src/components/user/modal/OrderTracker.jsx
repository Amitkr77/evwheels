"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Truck,
  Package,
  ClipboardCheck,
  ShoppingCart,
  MapPin,
  ExternalLink,
  Loader2,
  XCircle,
} from "lucide-react";
import { humanizeStatus } from "@/lib/format";

const STEPS = [
  { key: "PLACED",    label: "Placed",    Icon: ShoppingCart },
  { key: "CONFIRMED", label: "Confirmed", Icon: ClipboardCheck },
  { key: "SHIPPED",   label: "Shipped",   Icon: Truck },
  { key: "DELIVERED", label: "Delivered", Icon: Package },
];

const TRACKABLE = ["CONFIRMED", "SHIPPED", "DELIVERED"];

export default function OrderTracker({ status, orderId }) {
  const [tracking,        setTracking]        = useState(null);
  const [loadingTracking, setLoadingTracking] = useState(false);

  useEffect(() => {
    if (!orderId || !TRACKABLE.includes(status)) return;

    let cancelled = false;
    setLoadingTracking(true);

    fetch(`/api/orders/track?orderId=${orderId}`)
      .then((r) => r.json())
      .then((d) => { if (!cancelled && d.success) setTracking(d); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoadingTracking(false); });

    return () => { cancelled = true; };
  }, [orderId, status]);

  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-2 py-3 px-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
        <XCircle size={16} strokeWidth={1.8} className="shrink-0" />
        This order has been cancelled
      </div>
    );
  }

  const currentStep = STEPS.findIndex((s) => s.key === status);
  const sr          = tracking?.shiprocket;
  const history     = tracking?.trackingHistory || [];

  return (
    <div className="space-y-4">

      {/* ── Step tracker ── */}
      <div className="flex items-start gap-0">
        {STEPS.map((step, i) => {
          const done   = i <= currentStep;
          const isCurr = i === currentStep;
          const isLast = i === STEPS.length - 1;
          const { Icon } = step;

          return (
            <div key={step.key} className={`flex items-center ${!isLast ? "flex-1" : ""}`}>
              <div className="flex flex-col items-center gap-1.5 min-w-0 shrink-0">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    done
                      ? isCurr
                        ? "bg-[#19B5D8] ring-4 ring-[#DDF8FD] shadow-sm"
                        : "bg-[#19B5D8]"
                      : "bg-neutral-100"
                  }`}
                >
                  {done && !isCurr ? (
                    <CheckCircle2 size={16} className="text-white" strokeWidth={2.5} />
                  ) : (
                    <Icon
                      size={15}
                      strokeWidth={1.8}
                      className={done ? "text-white" : "text-neutral-400"}
                    />
                  )}
                </div>
                <p
                  className={`text-[10px] font-semibold whitespace-nowrap ${
                    done ? "text-[#19B5D8]" : "text-neutral-400"
                  }`}
                >
                  {step.label}
                </p>
              </div>
              {!isLast && (
                <div
                  className={`flex-1 h-0.5 mx-1 mb-4 transition-colors ${
                    i < currentStep ? "bg-[#19B5D8]" : "bg-neutral-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Loading tracking ── */}
      {loadingTracking && (
        <div className="flex items-center gap-2 text-[12px] text-neutral-500 py-2">
          <Loader2 size={13} className="animate-spin shrink-0" />
          Loading tracking info…
        </div>
      )}

      {/* ── Live tracking info ── */}
      {!loadingTracking && sr && (sr.awbCode || sr.shippingStatus) && (
        <div className="border border-neutral-100 rounded-xl overflow-hidden">

          {/* Courier bar */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 bg-neutral-50 border-b border-neutral-100">
            {sr.courierName && (
              <div>
                <p className="text-[9px] text-neutral-400 font-semibold uppercase tracking-widest mb-0.5">Courier</p>
                <p className="text-[12.5px] font-semibold text-neutral-800">{sr.courierName}</p>
              </div>
            )}
            {sr.awbCode && (
              <div>
                <p className="text-[9px] text-neutral-400 font-semibold uppercase tracking-widest mb-0.5">AWB / Tracking</p>
                <p className="text-[12px] font-mono text-neutral-700">{sr.awbCode}</p>
              </div>
            )}
            {sr.etd && (
              <div>
                <p className="text-[9px] text-neutral-400 font-semibold uppercase tracking-widest mb-0.5">Expected By</p>
                <p className="text-[12.5px] font-semibold text-neutral-800">
                  {new Date(sr.etd).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </p>
              </div>
            )}
            {sr.trackingUrl && (
              <a
                href={sr.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-1 text-[11px] font-medium text-[#19B5D8] hover:text-[#0C7290] hover:underline transition-colors"
              >
                Track on courier <ExternalLink size={11} />
              </a>
            )}
          </div>

          {/* Scan events timeline */}
          {history.length > 0 && (
            <div className="px-4 py-4">
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-3">Shipment Events</p>
              <ol className="relative border-l border-neutral-200 ml-1 space-y-0">
                {history.slice(0, 6).map((event, i) => (
                  <li key={i} className="ml-4 pb-4 last:pb-0">
                    <div className="absolute -left-[5px] w-2.5 h-2.5 rounded-full border-2 border-white bg-[#19B5D8]" />
                    <p className="text-[12.5px] font-semibold text-neutral-900 leading-tight">{event.status}</p>
                    {event.location && (
                      <p className="flex items-center gap-1 text-[11px] text-neutral-500 mt-0.5">
                        <MapPin size={9} className="shrink-0" /> {event.location}
                      </p>
                    )}
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      {event.date
                        ? new Date(event.date).toLocaleString("en-IN", {
                            day: "2-digit", month: "short",
                            hour: "2-digit", minute: "2-digit",
                          })
                        : "—"}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* AWB assigned but no scan events yet */}
          {history.length === 0 && sr.awbCode && (
            <p className="px-4 py-4 text-[12.5px] text-neutral-500 leading-relaxed">
              Your package has been handed to{" "}
              <span className="font-medium text-neutral-700">{sr.courierName || "the courier"}</span>.
              Scan events will appear here once the shipment is picked up.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
