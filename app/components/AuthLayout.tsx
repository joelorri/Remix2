import { Outlet } from "@remix-run/react";

export default function AuthLayout() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="w-full max-w-md p-6 shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-center text-gray-100">
          Benvingut
        </h1>
        <p className="text-center text-gray-400">
          Inicia sessió o registra&apos;t per continuar.
        </p>
        <div className="mt-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
