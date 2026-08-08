"use client";

import { useState, useRef } from "react";
import { MapPin, CheckCircle2, XCircle, Loader2, RotateCcw, Truck } from "lucide-react";

const STORAGE_KEY = "evwheels_last_pincode";

function getPincode() {
  try { return localStorage.getItem(STORAGE_KEY) || ""; } catch { return ""; }
}
function savePincode(pin) {
  try { localStorage.setItem(STORAGE_KEY, pin); } catch {}
}

// Shows ONLY delivery availability + estimated days — no courier names or prices.
// Pricing is revealed at checkout.
export default function PincodeChecker({ cod = false }) {
  const [pincode, setPincode] = useState(() => getPincode());
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const check = async (pin = pincode) => {
    const clean = pin.trim();
    if (!/^\d{6}$/.test(clean)) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const qs = new URLSearchParams({ pincode: clean, cod: cod ? "1" : "0" });
      const res = await fetch(`/api/shipping/check?${qs}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not check delivery. Please try again.");
        return;
      }
      savePincode(clean);
      // Compute fastest ETD from courier list
      const etds = (data.couriers || []).map((c) => Number(c.etd)).filter(Boolean);
      const minEtd = etds.length > 0 ? Math.min(...etds) : null;
      setResult({ ...data, minEtd });
    } catch {
      setError("Could not check delivery. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError("");
    setPincode("");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div className="rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Truck size={14} className="text-[#19B5D8] shrink-0" />
        <p className="text-[13px] font-semibold text-neutral-800">Check Delivery</p>
      </div>

      {/* Input */}
      {!result && (
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={pincode}
            onChange={(e) => {
              setPincode(e.target.value.replace(/\D/g, "").slice(0, 6));
              if (error) setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && check()}
            placeholder="Enter 6-digit pincode"
            aria-label="Delivery pincode"
            className="flex-1 px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-[#19B5D8] transition-colors placeholder:text-neutral-400"
          />
          <button
            onClick={() => check()}
            disabled={loading || pincode.length !== 6}
            className="px-4 py-2.5 text-[12.5px] font-semibold bg-[#19B5D8] text-white rounded-xl hover:bg-[#1297B5] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
          >
            {loading && <Loader2 size={13} className="animate-spin" />}
            {loading ? "Checking…" : "Check"}
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
          <XCircle size={12} /> {error}
        </p>
      )}

      {/* Result */}
      {result && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <MapPin size={12} className="text-neutral-400" />
              <span className="text-[12px] font-mono text-neutral-500">{pincode}</span>
            </div>
            <button
              onClick={reset}
              className="flex items-center gap-1 text-[11px] text-[#19B5D8] hover:text-[#0C7290] transition-colors"
            >
              <RotateCcw size={10} /> Change
            </button>
          </div>

          {!result.serviceable && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <XCircle size={15} className="shrink-0" />
              <span>Delivery not available to this pincode.</span>
            </div>
          )}

          {result.serviceable && (
            <div className="flex items-start gap-2 text-emerald-700 text-sm">
              <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Delivery available</span>
                {result.minEtd ? (
                  <span className="text-neutral-600 font-normal">
                    {" "}— arrives in{" "}
                    <span className="font-semibold text-neutral-900">
                      {result.minEtd}–{result.minEtd + 2} business days
                    </span>
                  </span>
                ) : result.fallback ? (
                  <span className="text-neutral-500 font-normal text-[12px]"> to this pincode</span>
                ) : null}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
