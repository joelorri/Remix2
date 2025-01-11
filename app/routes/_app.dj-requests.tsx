import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useUser } from "~/context/UserContext";
import { getSessionData } from "~/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const { user, token } = await getSessionData(request);

  if (!user || !token || user.role !== "dj") {
    console.log(user)
  }

  const response = await fetch("http://localhost/api/dj/requests", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const requests = response.ok ? await response.json() : null;

  return json({ user, token, requests });
};

type SongRequest = {
  id: number;
  song_details: string;
  comments: string | null;
  status: string;
  user: {
    name: string;
    email: string;
  };
};

export default function DjRequestsPage() {
    const { user: loaderUser, token, requests } = useLoaderData();
    const { user, setUser } = useUser();

  const [songRequests, setSongRequests] = useState<SongRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Assegura que el context de l'usuari estigui actualitzat
  useEffect(() => {
    if (loaderUser && (!user || user.id !== loaderUser.id)) {
      setUser(loaderUser);
    }
  }, [loaderUser, user, setUser]);

  useEffect(() => {
    if (loaderUser && (!user || user.id !== loaderUser.id || user.role !== loaderUser.role)) {
      setUser(loaderUser); // Sincronitza el context amb el loader
    }
  }, [loaderUser, user, setUser]);
  
  const updateRequestStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost/api/dj/requests/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "No s'ha pogut actualitzar l'estat.");
      }

      // Actualitza l'estat local després de la resposta exitosa
      setSongRequests((prev) =>
        prev.map((request) =>
          request.id === id ? { ...request, status: newStatus } : request
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconegut.");
    }
  };

  return (
    <div className="py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard de Sol·licituds de Cançons</h1>
      {error && <p className="text-red-500">{error}</p>}

      {songRequests.length > 0 ? (
        <ul className="space-y-4">
          {songRequests.map((request) => {
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
                  <strong>Sol·licitant:</strong> {request.user.name} ({request.user.email})
                </p>
                <p>
                  <strong>Estat:</strong> {request.status}
                </p>

                {/* Botons per acceptar o rebutjar */}
                <div className="flex space-x-4 mt-4">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                    onClick={() => updateRequestStatus(request.id, "approved")}
                    disabled={request.status !== "pending"}
                  >
                    Acceptar
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                    onClick={() => updateRequestStatus(request.id, "rejected")}
                    disabled={request.status !== "pending"}
                  >
                    Rebutjar
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500">No hi ha sol·licituds pendents.</p>
      )}
    </div>
  );
}
