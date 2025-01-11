import { Link } from "@remix-run/react";
import { useUser } from "~/context/UserContext";
import { toggleRole } from "~/utils/api";
import { useState } from "react";

export default function Navbar() {
  const { user, token, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleRole = async () => {
    if (!token || !user) {
      setError("No s'ha pogut trobar l'usuari o el token.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await toggleRole(token); // Call the API
      const updatedRole = response?.data?.role; // Extract the updated role

      if (updatedRole) {
        setUser((prevUser) =>
          prevUser ? { ...prevUser, role: updatedRole } : null
        ); // Update user in context
      } else {
        throw new Error("Resposta no vàlida del servidor.");
      }
    } catch (err) {
      console.error("Error canviant el rol:", err);
      setError("No s'ha pogut canviar el rol.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="bg-blue-600 text-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold hover:text-gray-300">
          Aplicació
        </Link>
        <p className="text-gray-600">Rol: {user?.role || "Desconegut"}</p>
        {/* Menu */}
        <ul className="flex space-x-6 items-center">
          {user?.role === "dj" && (
            <Link
              to="/dj-requests"
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md"
            >
              Dashboard DJ
            </Link>
          )}
          <li>
            <Link to="/home" className="hover:text-gray-300">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/requests" className="hover:text-gray-300">
              Cançons Demanades
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
                className={`bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 ${
                  loading ? "cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading
                  ? "Canviant..."
                  : `Canvia a ${user.role === "dj" ? "user" : "dj"}`}
              </button>
            </li>
          )}
        </ul>
      </div>
      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
    </nav>
  );
}
