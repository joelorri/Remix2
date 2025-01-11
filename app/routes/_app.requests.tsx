import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { getSessionData } from "~/auth.server";
import { useUser } from "~/context/UserContext";

// Loader per obtenir usuari i token
export const loader: LoaderFunction = async ({ request }) => {
  const { user, token } = await getSessionData(request);

  if (!user || !token) {
    throw redirect("/login"); // Redirigeix si no hi ha usuari o token
  }

  const response = await fetch("http://localhost/api/requests/getRequest/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const songRequests = response.ok ? await response.json() : null;

  return json({ user, token, songRequests });
};

// Tipus de les sol·licituds
type SongRequest = {
  id: number;
  song_details: string; // JSON string
  comments: string | null;
  status: string; // "pending", "approved", "rejected", etc.
  dj_name: string;
};

export default function RequestsPage() {
  const { user: loaderUser, token: loaderToken, songRequests } = useLoaderData<{
    user: { id: number; name: string; email: string };
    token: string;
    songRequests: { data: SongRequest[] } | null;
  }>();
  const { setUser, setToken } = useUser();

  const [requests, setRequests] = useState<SongRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Inicialitza el context amb dades del loader
  useEffect(() => {
    setUser(loaderUser);
    setToken(loaderToken);

    if (songRequests?.data) {
      setRequests(songRequests.data);
    } else {
      setError("No s'han trobat sol·licituds per aquest usuari.");
    }
  }, [loaderUser, loaderToken, setUser, setToken, songRequests]);

  return (
    <div className="py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Cançons Demanades</h1>
      {error && <p className="text-red-500">{error}</p>}

      {/* Informació de l'usuari */}
      <div className="mb-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md">
        <p>
          <strong className="font-semibold">Usuari:</strong> {loaderUser.name}
        </p>
        <p>
          <strong className="font-semibold">Email:</strong> {loaderUser.email}
        </p>
      </div>

      {/* Llista de sol·licituds */}
      {requests.length > 0 ? (
        <ul className="space-y-4">
          {requests.map((request) => {
            const songDetails = JSON.parse(request.song_details);

            return (
              <li key={request.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md">
                <p>
                  <strong>Cançó:</strong> {songDetails.title}
                </p>
                <p>
                  <strong>Artista:</strong> {songDetails.artist || "Desconegut"}
                </p>
                <p>
                  <strong>Comentaris:</strong> {request.comments || "Sense comentaris"}
                </p>
                <p>
                  <strong>Estat:</strong> {request.status}
                </p>
                <p>
                  <strong>DJ:</strong> {request.dj_name}
                </p>
                <p className="text-sm text-gray-500">
                  Sol·licitat el: {new Date(request.created_at).toLocaleString()}
                </p>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500">No hi ha sol·licituds registrades.</p>
      )}
    </div>
  );
}