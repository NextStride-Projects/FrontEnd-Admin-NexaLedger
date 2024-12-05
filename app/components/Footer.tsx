export default function Footer() {
    return (
      <footer className="bg-green-800 text-white shadow-md">
        <div className="flex justify-center items-center px-4 py-2">
          <p className="text-sm">
            © {new Date().getFullYear()} NexaLedger por NextStride. Todos los
            derechos reservados.
          </p>
        </div>
      </footer>
    );
  }
  