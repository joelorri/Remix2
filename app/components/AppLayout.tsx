import { Outlet } from "@remix-run/react";
import Navbar from "~/components/Navbar";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Contingut principal */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Peu de pàgina */}
      <footer className="bg-gray-800 text-white text-center py-4">
        <p>&copy; {new Date().getFullYear()} Aplicació. Tots els drets reservats.</p>
      </footer>
    </div>
  );
}
