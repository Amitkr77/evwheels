"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { analytics } from "@/lib/analytics";

/** Fires a dedicated "404 Viewed" event, distinguishable from a normal $pageview. */
export default function NotFoundTracker() {
  const pathname = usePathname();

  useEffect(() => {
    analytics.track("404 Viewed", { pathname });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
