
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import TopBar from "@/components/TopBar";

export const metadata = {
  alternates: { canonical: "https://evwheels.in" },
};

export default function UserRootLayout({ children }) {
    return (
        <main>
            {/* <Header /> */}
            {/* <TopBar/> */}
            <Navbar/>
            {children}
            <Footer />
        </main>
    );
}
