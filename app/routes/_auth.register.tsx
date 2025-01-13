import { Link, useNavigate } from "@remix-run/react";
import { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al registrar-se.");
      }

      setSuccessMessage("Registre complet! Redirigint...");
      setTimeout(() => navigate("/login"), 2000); // Redirigeix a la pàgina d'inici de sessió
    } catch (err) {
      console.error("Error al registrar-se:", err);
      setError(
        err instanceof Error ? err.message : "Hi ha hagut un error desconegut."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="w-full max-w-md p-6 bg-gray-800 shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-100">
          Registra&apos;t
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom complet */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Nom complet
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Nom complet"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-600 rounded bg-gray-700 text-gray-100 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Correu electrònic */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Correu electrònic
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Correu electrònic"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-600 rounded bg-gray-700 text-gray-100 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Contrasenya */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Contrasenya
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Contrasenya"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-600 rounded bg-gray-700 text-gray-100 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Confirmació de contrasenya */}
          <div>
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-300">
              Confirma la contrasenya
            </label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              placeholder="Confirma la contrasenya"
              value={formData.password_confirmation}
              onChange={handleChange}
              className="w-full p-2 mt-1 border border-gray-600 rounded bg-gray-700 text-gray-100 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Botó d'enviament */}
          <button
            type="submit"
            className={`w-full py-2 text-white rounded ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={loading}
          >
            {loading ? "Processant..." : "Registra't"}
          </button>
        </form>

        {/* Enllaç per iniciar sessió */}
        <div className="text-center mt-4">
          <Link to="/login" className="text-blue-400 hover:underline">
            Ja tens compte? Inicia sessió
          </Link>
        </div>

        {/* Missatge d'error */}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {/* Missatge d'èxit */}
        {successMessage && <p className="text-green-500 text-center mt-4">{successMessage}</p>}
      </div>
    </div>
  );
}
