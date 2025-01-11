import { Outlet } from "@remix-run/react";

export default function AuthLayout() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Benvingut</h1>
        <p className="text-center text-gray-600 mb-6">
          Inicia sessió o registra&apos;t per continuar.
        </p>
        <Outlet />
      </div>
    </div>
  );
}
