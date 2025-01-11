import { LoaderFunction, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useUser } from "~/context/UserContext";
import { useEffect, useState } from "react";
import { getSessionData } from "~/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const { user, token } = await getSessionData(request);

  if (!user || !token) {
    throw redirect("/login"); // Redirigeix si no hi ha usuari o token
  }

  return json({ user, token });
};

export default function HomePage() {
  const { user: loaderUser, token: loaderToken } = useLoaderData();
  const { setUser, setToken } = useUser();

  const [query, setQuery] = useState(""); // Estat per al terme de cerca
  interface Profile {
    id: string;
    name: string;
    email: string;
  }

  const [results, setResults] = useState<Profile[]>([]); // Estat per als resultats
  const [error, setError] = useState<string | null>(null); // Estat per als errors
  const [hasSearched, setHasSearched] = useState(false); // Estat per saber si s'ha fet cerca

  // Inicialitza el context amb les dades del loader
  useEffect(() => {
    setUser(loaderUser);
    setToken(loaderToken);
  }, [loaderUser, loaderToken, setUser, setToken]);

  // Funció per fer la cerca
  const fetchResults = async (searchQuery: string = "") => {
    try {
      const response = await fetch(
        `http://localhost/api/profile/searchs?query=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            Authorization: `Bearer ${loaderToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error durant la cerca: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.data || []); // Actualitza els resultats
      setError(null); // Restableix l'error
    } catch (err) {
      console.error("Error en fer la cerca:", err);
      setError("Error en fer la cerca. Torna-ho a intentar més tard.");
    }
  };

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Cercant amb query:", query); // LOG: Comprova el valor de query
    setHasSearched(true); // Marca que s'ha fet cerca
    await fetchResults(query); // Passa el valor de la cerca
  };

  // Funció per seleccionar un DJ i guardar les dades en una cookie
  interface DjProfile {
    id: string;
    name: string;
    email: string;
  }

  const handleSelectDj = (dj: DjProfile) => {
    const cookieValue = encodeURIComponent(JSON.stringify(dj));
    document.cookie = `selectedDj=${cookieValue}; path=/; max-age=86400`; // Guarda la cookie per 1 dia
    alert(`DJ seleccionat: ${dj.name}. Les dades s'han guardat a la cookie.`);
    window.location.href = "/selectsongs"; // Redirigeix a /selectsongs
  };

  return (
    <div className="py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Benvingut, {loaderUser?.name || "Usuari"}</h1>
      

      <div className="bg-white dark:bg-gray-900 overflow-hidden shadow-lg rounded-lg">
        <div className="p-6">
          {/* Cercador */}
          <form
            onSubmit={handleSearch}
            className="flex items-center space-x-4"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar per nom o email"
              className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition ease-in-out duration-200"
            >
              Cerca
            </button>
          </form>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>

        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {hasSearched ? "Resultats de la cerca:" : "Comença una cerca per veure resultats"}
          </h2>
          {hasSearched && results.length > 0 ? (
            <ul className="space-y-4">
              {results.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => handleSelectDj(profile)}
                  className="w-full text-left cursor-pointer mb-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <p>
                    <strong className="font-semibold">Nom:</strong> {profile.name}
                  </p>
                  <p>
                    <strong className="font-semibold">Email:</strong> {profile.email}
                  </p>
                </button>
              ))}
            </ul>
          ) : (
            hasSearched && <p className="text-gray-500">No s&#39;han trobat resultats.</p>
          )}
        </div>
      </div>
    </div>
  );
}
