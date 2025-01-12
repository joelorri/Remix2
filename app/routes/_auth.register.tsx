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
    <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold text-center mb-6">Registra&apos;t</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nom complet */}
        <input
          type="text"
          name="name"
          placeholder="Nom complet"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />

        {/* Correu electrònic */}
        <input
          type="email"
          name="email"
          placeholder="Correu electrònic"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />

        {/* Contrasenya */}
        <input
          type="password"
          name="password"
          placeholder="Contrasenya"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />

        {/* Confirmació de contrasenya */}
        <input
          type="password"
          name="password_confirmation"
          placeholder="Confirma la contrasenya"
          value={formData.password_confirmation}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />

        {/* Botó d'enviament */}
        <button
          type="submit"
          className={`w-full py-2 text-white rounded ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
          disabled={loading}
        >
          {loading ? "Processant..." : "Registra't"}
        </button>

        {/* Enllaç per iniciar sessió */}
        <div className="text-center">
          <Link to="/login" className="text-blue-600 hover:underline">
            Ja tens compte? Inicia sessió
          </Link>
        </div>
      </form>

      {/* Missatge d'error */}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      {/* Missatge d'èxit */}
      {successMessage && <p className="text-green-500 text-center mt-4">{successMessage}</p>}
    </div>
  );
}
