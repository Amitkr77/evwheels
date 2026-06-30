
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import TopBar from "@/components/TopBar";

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
            {children}
            <Footer />
        </main>
    );
}
