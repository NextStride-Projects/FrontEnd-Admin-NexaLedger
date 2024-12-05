import Footer from "@/app/components/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col">
      <section className="flex-grow flex flex-col">{children}</section>
      <Footer />
    </main>
  );
}
