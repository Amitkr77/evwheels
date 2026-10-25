
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import TopBar from "@/components/TopBar";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { ToastProvider } from "@/components/Toast";

export const metadata = {
  alternates: { canonical: "https://evwheels.in" },
};

export default function UserRootLayout({ children }) {
    return (
        <main suppressHydrationWarning>
            <TopBar />
            <Navbar />
            {/* Spacer so page content clears the combined topbar (36px) + navbar (80px) */}
            <div className="h-9" />
            <ToastProvider>{children}</ToastProvider>
            <Footer />
            <WhatsAppWidget />
        </main>
    );
}
