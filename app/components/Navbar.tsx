import { Link, useNavigate } from "@remix-run/react";
import { useUser } from "~/context/UserContext";
import { toggleRole } from "~/utils/api";
import { useState } from "react";

export default function Navbar() {
  const { user, token, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleToggleRole = async () => {
    if (!token || !user) {
      setError("No s'ha pogut trobar l'usuari o el token.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await toggleRole(token);
      const updatedRole = response?.data?.role;

      if (updatedRole) {
        setUser((prevUser) =>
          prevUser ? { ...prevUser, role: updatedRole } : null
        );
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

  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost/api/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("No s'ha pogut completar la desconnexió.");
      }

      setUser(null);
      document.cookie = "user_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      navigate("/login");
    } catch (err) {
      console.error("Error al desconnectar-se:", err);
      setError("No s'ha pogut desconnectar correctament.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="bg-gray-900 text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold hover:text-gray-300">
          Aplicació
        </Link>

        {/* Botó del menú per a mòbils */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white hover:text-gray-300 focus:outline-none"
          aria-label="Toggle Menu"
        >
          ☰
        </button>

        {/* Links de navegació */}
        <ul
          className={`${
            menuOpen ? "block" : "hidden"
          } absolute top-16 left-0 w-full bg-gray-900 md:static md:flex md:items-center md:space-x-6 text-center md:w-auto`}
        >
          <li>
            <Link
              to="/home"
              className="block py-2 md:py-0 hover:text-gray-300"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/requests"
              className="block py-2 md:py-0 hover:text-gray-300"
            >
              Cançons Demanades
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className="block py-2 md:py-0 hover:text-gray-300"
            >
              Perfil
            </Link>
          </li>
          <li>
            <Link
              to="/playlist"
              className="block py-2 md:py-0 hover:text-gray-300"
            >
              Playlist
            </Link>
          </li>
          {user?.role === "dj" && (
            <li>
              <button
                onClick={handleToggleRole}
                className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700 w-full md:w-auto"
              >
                Canvia a {user.role === "dj" ? "user" : "dj"}
              </button>
            </li>
          )}
          {user?.super === "admin" && (
            <li>
              <Link
                to="/admin-dashboard"
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 block md:inline-block w-full md:w-auto"
              >
                Administració
              </Link>
            </li>
          )}
          {user && (
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 block md:inline-block w-full md:w-auto"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
