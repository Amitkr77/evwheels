/**
 * GET /api/shipping/check?pincode=<6-digit>&cod=0|1&weight=0.5
 *
 * Public endpoint — no auth required.
 * Checks Shiprocket serviceability for delivery from our warehouse
 * (801109, Naubatpur, Patna) to the given pincode.
 *
 * Returns up to 3 courier options sorted by rate.
 */

import { NextResponse } from "next/server";
import { getShippingRates } from "@/lib/shiprocket";

const PICKUP_PINCODE = "801109"; // Naubatpur, Patna

const PINCODE_RE = /^\d{6}$/;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const pincode = (searchParams.get("pincode") || "").trim();
  const cod = searchParams.get("cod") === "1";
  const weight = parseFloat(searchParams.get("weight") || "0.5");

  if (!PINCODE_RE.test(pincode)) {
    return NextResponse.json({ error: "Enter a valid 6-digit pincode" }, { status: 400 });
  }

  if (!process.env.SHIPROCKET_EMAIL || !process.env.SHIPROCKET_PASSWORD) {
    // Shiprocket not configured — return a graceful fallback
    return NextResponse.json({
      success: true,
      serviceable: true,
      couriers: [],
      fallback: true,
      message: "Delivery available. Contact us for exact rates.",
    });
  }

  const result = await getShippingRates({
    pickupPincode: PICKUP_PINCODE,
    deliveryPincode: pincode,
    weightKg: weight,
    cod,
  });

  if (!result.success) {
    // Auth blocked (403) = plan doesn't have API access yet.
    // Fall back gracefully so the product page still works.
    if (result.error?.includes("403") || result.error?.includes("forbidden")) {
      console.warn("[shipping/check] Shiprocket API not enabled on this account — serving fallback");
      return NextResponse.json({
        success: true,
        serviceable: true,
        couriers: [],
        fallback: true,
        message: "Delivery available. Shipping cost calculated at checkout.",
      });
    }
    console.error("[shipping/check] Shiprocket error:", result.error);
    return NextResponse.json(
      { error: "Unable to check delivery right now. Please try again." },
      { status: 502 }
    );
  }

  // Log non-200 responses so we can see Shiprocket's message without breaking the user flow
  if (result.httpStatus && result.httpStatus !== 200) {
    console.info("[shipping/check] Shiprocket %d: %s", result.httpStatus, result.data?.message);
  }

  const companies = result.data?.data?.available_courier_companies || [];

  if (companies.length === 0) {
    return NextResponse.json({ success: true, serviceable: false, couriers: [] });
  }

  // Pick the 3 cheapest options and return only the fields the UI needs
  const sorted = [...companies]
    .sort((a, b) => (a.rate || 0) - (b.rate || 0))
    .slice(0, 3)
    .map((c) => ({
      name: c.courier_name,
      rate: c.rate,
      etd: c.estimated_delivery_days,
      cod: !!c.cod,
      recommended: !!c.is_recommended,
    }));

  return NextResponse.json({ success: true, serviceable: true, couriers: sorted });
}
