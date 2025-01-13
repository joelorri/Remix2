import { LoaderFunction, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useUser } from "~/context/UserContext";
import { useEffect, useState, useCallback } from "react";
import { getSessionData } from "~/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const { user, token } = await getSessionData(request);

  if (!user || !token) {
    throw redirect("/login"); // Redirigeix si no hi ha usuari o token
  }

  const fullUser = {
    ...user,
    id: user.id || "",
    email: user.email || "",
    email_verified_at: user.email_verified_at || null,
    created_at: user.created_at || "",
    updated_at: user.updated_at || "",
  };

  return json({ user: fullUser, token });
};

interface Profile {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  role: string;
  super: string;
  image: string;
}

interface DjProfile extends Profile {}

export default function HomePage() {
  const { user: loaderUser, token: loaderToken } = useLoaderData<{
    user: Profile;
    token: string;
  }>();
  const { setUser, setToken } = useUser();

  const [query, setQuery] = useState(""); // Estat per al terme de cerca
  const [results, setResults] = useState<Profile[]>([]); // Estat per als resultats
  const [error, setError] = useState<string | null>(null); // Estat per als errors
  const [hasSearched, setHasSearched] = useState(false); // Estat per saber si s'ha fet cerca

  const getSessionFromDDBB = useCallback(async (): Promise<Profile | null> => {
    try {
      const response = await fetch("http://localhost/api/whoami", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loaderToken}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("No s'ha pogut obtenir la sessió de l'usuari.");
      }

      const data = await response.json();

      if (!data.success || !data.user) {
        console.error("Sessió no vàlida o incompleta:", data);
        return null;
      }

      return data.user;
    } catch (error) {
      console.error("Error obtenint la sessió de l'usuari:", error);
      return null;
    }
  }, [loaderToken]);

  useEffect(() => {
    const syncUserWithDatabase = async () => {
      try {
        const dbUser = await getSessionFromDDBB();

        if (!dbUser) {
          console.error("Error: No s'ha pogut obtenir l'usuari de la BBDD.");
          return;
        }

        if (JSON.stringify(loaderUser) !== JSON.stringify(dbUser)) {
          console.log("Els usuaris no coincideixen. Actualitzant l'estat.");
          setUser(dbUser); // Actualitza l'usuari amb el de la base de dades
        } else {
          console.log("Els usuaris coincideixen. No cal actualitzar.");
        }
      } catch (error) {
        console.error("Error sincronitzant l'usuari amb la BBDD:", error);
      }
    };

    syncUserWithDatabase();
    setUser(loaderUser);
    setToken(loaderToken);
  }, [loaderUser, loaderToken, getSessionFromDDBB, setUser, setToken]);

  const fetchResults = useCallback(async (searchQuery: string = "") => {
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
      setResults(data.data || []);
      setError(null);
    } catch (err) {
      console.error("Error en fer la cerca:", err);
      setError("Error en fer la cerca. Torna-ho a intentar més tard.");
    }
  }, [loaderToken]);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    setHasSearched(true);
    await fetchResults(query);
  };

  const handleSelectDj = (dj: DjProfile) => {
    const cookieValue = encodeURIComponent(JSON.stringify(dj));
    document.cookie = `selectedDj=${cookieValue}; path=/; max-age=86400`;
    alert(`DJ seleccionat: ${dj.name}. Les dades s'han guardat a la cookie.`);
    window.location.href = "/selectsongs";
  };

  return (
    <div className="py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Benvingut, {loaderUser?.name || "Usuari"}</h1>
      <div className="bg-white dark:bg-gray-900 overflow-hidden shadow-lg rounded-lg">
        <div className="p-6">
          <form onSubmit={handleSearch} className="flex items-center space-x-4">
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
