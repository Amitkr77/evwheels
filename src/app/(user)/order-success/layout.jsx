import { Suspense } from "react";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Order Confirmed",
};

export default function orderLayout({ children }) {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <main>{children}</main>
      </Suspense>
    </div>
  );
}
