
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function UserRootLayout({ children }) {
    return (
        <main>
            {/* <Header /> */}
            <Navbar/>
            {children}
            <Footer />
        </main>
    );
}
