import AppBar from "@/app/components/AppBar";
import Footer from "@/app/components/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col">
      {/* AppBar */}
      <AppBar />

      {/* Main Section */}
      <section className="flex-grow m-8 bg-white rounded">{children}</section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
