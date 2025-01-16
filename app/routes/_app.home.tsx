import { LoaderFunction, json, redirect } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { getSessionData } from "~/server/auth.server";
import { Profile, User } from "~/utils/Interfaces";

export const loader: LoaderFunction = async ({ request }) => {
  const { token } = await getSessionData(request);

  if (!token) {
    throw redirect("/login");
  }

  try {
    const response = await fetch("http://localhost/api/whoami", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw redirect("/login");
    }

    const data = await response.json();

    if (!data.success || !data.user) {
      throw redirect("/login");
    }

    return json({ user: data.user, token });
  } catch (error) {
    console.error("Error carregant l'usuari des de whoami:", error);
    throw redirect("/login");
  }
};

export default function HomePage() {

  const { user, token } = useLoaderData<{ user: User; token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [logoutLoading, setLogoutLoading] = useState(false);


  const [results, setResults] = useState<Profile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const toggleRole = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost/api/profile/toggle-role", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error canviant el rol.");
      }

      const data = await response.json();
      alert(`Rol canviat a: ${data.data.role}`);
      window.location.reload();
    } catch (err) {
      console.error("Error canviant el rol:", err);
      setError("No s'ha pogut canviar el rol. Torna-ho a intentar.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      const response = await fetch("http://localhost/api/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("No s'ha pogut completar la desconnexió.");
      }

      document.cookie = "user_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      navigate("/login");
    } catch (err) {
      console.error("Error al desconnectar-se:", err);
      setError("No s'ha pogut desconnectar correctament.");
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    setHasSearched(true);

    try {
      const response = await fetch(
        `http://localhost/api/profile/searchs?query=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error durant la cerca: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.data || []);
      setError(null);
    } catch (err) {
      console.error("Error en fer la cerca:", err);
      setError("Error en fer la cerca. Torna-ho a intentar més tard.");
    }
  };

  const handleSelectDj = (dj: { id: string; name: string; email: string }) => {
    const cookieValue = encodeURIComponent(JSON.stringify(dj));
    document.cookie = `selectedDj=${cookieValue}; path=/; max-age=86400`;
    alert(`DJ seleccionat: ${dj.name}. Les dades s'han guardat a la cookie.`);
    navigate("/selectsongs");
  };

  return (
    <div className="py-12 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">Benvingut, {user.name}</h1>
      <div className="bg-gray-800 dark:bg-gray-900 shadow-lg rounded-lg p-6 space-y-8">
        {/* User Info Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Informació del perfil</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Rol actual:</strong> {user.role}</p>
          <div className="flex space-x-4 mt-4">
            <button
              onClick={toggleRole}
              className={`bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 ${loading ? "opacity-50" : ""}`}
              disabled={loading}
            >
              Canvia a {user.role === "dj" ? "user" : "dj"}
            </button>
            {user.role === "dj" && (
              <button
                onClick={() => navigate("/dj-requests")}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
              >
                Accedeix al DJ Dashboard
              </button>
            )}
          </div>
          {user.super === "admin" && (
            <Link
              to="/admin-dashboard"
              className="mt-4 inline-block bg-red-600 px-4 py-2 rounded text-white hover:bg-red-700"
            >
              Administració
            </Link>
          )}
        </section>

        {/* Search Section */}
        <section>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar per nom o email"
              className="flex-grow px-4 py-2 border rounded-lg dark:bg-gray-800"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Cerca
            </button>
          </form>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </section>

        {/* Results Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            {hasSearched ? "Resultats de la cerca:" : "Comença una cerca per veure resultats"}
          </h2>
          {hasSearched && results.length > 0 ? (
            <ul className="space-y-4">
              {results.map((profile) => (
                <li key={profile.id}>
                  <button
                    onClick={() => handleSelectDj(profile)}
                    className="w-full text-left bg-gray-800 p-4 rounded-lg hover:bg-gray-600"
                  >
                    <p><strong>Nom:</strong> {profile.name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                  </button>
                </li>
              ))}
            </ul>
          ) : hasSearched && <p className="text-gray-500">No s&#39;han trobat resultats.</p>}
        </section>

        {/* Logout Section */}
        <section className="text-right">
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            disabled={logoutLoading}
          >
            {logoutLoading ? "Sortint..." : "Logout"}
          </button>
        </section>
      </div>
    </div>
  );
}
