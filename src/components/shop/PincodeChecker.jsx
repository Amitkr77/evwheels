"use client";

import { useState, useRef } from "react";
import { MapPin, CheckCircle2, XCircle, Loader2, RotateCcw } from "lucide-react";

const STORAGE_KEY = "evwheels_last_pincode";

function getPincode() {
  try { return localStorage.getItem(STORAGE_KEY) || ""; } catch { return ""; }
}
function savePincode(pin) {
  try { localStorage.setItem(STORAGE_KEY, pin); } catch {}
}

export default function PincodeChecker({ cod = false }) {
  const [pincode, setPincode] = useState(() => getPincode());
  const [result, setResult] = useState(null); // { serviceable, couriers, fallback, message } | null
  const [error, setError] = useState("");
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
      setResult(data);
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

  const handleKey = (e) => {
    if (e.key === "Enter") check();
  };

  return (
    <div className="border border-neutral-200 rounded-2xl p-4 bg-neutral-50/60">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <MapPin size={15} className="text-[#19B5D8] shrink-0" />
        <p className="text-sm font-semibold text-neutral-800">Check Delivery</p>
      </div>

      {/* Input row */}
      {!result && (
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={pincode}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "").slice(0, 6);
              setPincode(v);
              if (error) setError("");
            }}
            onKeyDown={handleKey}
            placeholder="Enter pincode"
            aria-label="Delivery pincode"
            className="flex-1 px-3.5 py-2.5 text-sm border border-neutral-300 rounded-xl focus:outline-none focus:border-[#19B5D8] transition-colors bg-white placeholder:text-neutral-400"
          />
          <button
            onClick={() => check()}
            disabled={loading || pincode.length !== 6}
            className="px-4 py-2.5 text-sm font-semibold bg-[#19B5D8] text-white rounded-xl hover:bg-[#1297B5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? "Checking…" : "Check"}
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
          <XCircle size={13} /> {error}
        </p>
      )}

      {/* Result */}
      {result && (
        <div>
          {/* Pincode + reset row */}
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="text-neutral-400" />
              <span className="text-sm font-mono text-neutral-600">{pincode}</span>
            </div>
            <button
              onClick={reset}
              className="flex items-center gap-1 text-xs text-[#19B5D8] hover:text-[#0C7290] transition-colors"
            >
              <RotateCcw size={11} /> Change
            </button>
          </div>

          {/* Not serviceable */}
          {!result.serviceable && (
            <div className="flex items-start gap-2 text-red-600 text-sm">
              <XCircle size={16} className="shrink-0 mt-0.5" />
              <p>Sorry, we don&apos;t deliver to this pincode yet.</p>
            </div>
          )}

          {/* Serviceable — fallback (no live rates) */}
          {result.serviceable && result.fallback && (
            <div className="flex items-start gap-2 text-emerald-700 text-sm">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <p>{result.message || "Delivery available to this pincode."}</p>
            </div>
          )}

          {/* Serviceable — live courier options */}
          {result.serviceable && !result.fallback && result.couriers.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-emerald-700 text-sm font-semibold mb-2.5">
                <CheckCircle2 size={15} />
                Delivery available
              </div>
              <div className="space-y-2">
                {result.couriers.map((c, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-sm ${
                      c.recommended
                        ? "border-[#19B5D8]/40 bg-[#DDF8FD]/30"
                        : "border-neutral-200 bg-white"
                    }`}
                  >
                    <div>
                      <span className="font-medium text-neutral-900">{c.name}</span>
                      {c.recommended && (
                        <span className="ml-1.5 text-[10px] px-1.5 py-0.5 bg-[#19B5D8] text-white rounded-full font-medium">
                          Recommended
                        </span>
                      )}
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Estimated {c.etd} day{c.etd !== 1 ? "s" : ""}
                        {c.cod ? " · COD available" : ""}
                      </p>
                    </div>
                    <span className="font-semibold text-neutral-800">
                      ₹{c.rate}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
