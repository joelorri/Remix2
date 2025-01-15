import { Outlet } from "@remix-run/react";
import Navbar from "~/components/Navbar";

export default function AppLayout() {
  return (
    <div
      className="min-h-screen flex flex-col text-white"
      style={{
        background: "linear-gradient(to bottom, #000428, #004e77, #000000)",
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Contingut principal */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Peu de pàgina */}
      <footer className="bg-gray-900 text-gray-400 text-center py-4">
        <p>&copy; {new Date().getFullYear()} Aplicació. Tots els drets reservats.</p>
      </footer>
    </div>
  );
}
