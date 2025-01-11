import { Link } from "@remix-run/react";
import { useUser } from "~/context/UserContext";
import { toggleRole } from "~/utils/api";
import { useState } from "react";

export default function Navbar() {
  const { user, token, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleRole = async () => {
    console.log("Usuari actual al Navbar:", user);
    console.log("Token actual al Navbar:", token);
    if (!token || !user) return; 
    setLoading(true);
    setError(null);

    try {
      const data = await toggleRole(token); // Utilitza el token per fer la petició
      setUser((prevUser) => prevUser ? { ...prevUser, role: data.role } : null); // Actualitza el rol
    } catch (err) {
      setError("No s'ha pogut canviar el rol.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="bg-blue-600 text-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo o Títol */}
        <Link to="/" className="text-2xl font-bold hover:text-gray-300">
          Aplicació
        </Link>

        {/* Menú */}
        <ul className="flex space-x-6 items-center">
          <li>
            <Link to="/dashboard" className="hover:text-gray-300">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/profile" className="hover:text-gray-300">
              Perfil
            </Link>
          </li>
          {user && (
            <li>
              <button
                onClick={handleToggleRole}
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
                disabled={loading}
              >
                {loading ? "Canviant..." : `Canvia a ${user.role === "dj" ? "user" : "dj"}`}
              </button>
            </li>
          )}
        </ul>
      </div>
      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
    </nav>
  );
}
