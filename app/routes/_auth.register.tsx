import { Link } from "@remix-run/react";

export default function Register() {
    return (
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Nom complet"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="email"
          placeholder="Correu electrònic"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Contrasenya"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Registra&apos;t
        </button>
        <Link
            to="/login"
            className="text-blue-600 hover:underline"
          >
            Ja tens compte? Inicia sessió
          </Link>
      </form>
    );
  }
  