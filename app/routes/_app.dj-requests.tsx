// routes/dj-requests.tsx
import { LoaderFunction, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { getSessionData } from "~/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const { user, token } = await getSessionData(request);

  if (!user || !token || user.role !== "dj") {
    return redirect("/login"); // Només DJs poden accedir
  }

  const response = await fetch("http://localhost/api/dj/requests", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return json({ error: "No s'han pogut carregar les sol·licituds." }, { status: 500 });
  }

  const data = await response.json();
  return json({ user, token, requests: data });
};

type SongRequest = {
  id: number;
  song_details: string;
  comments: string | null;
  status: "pending" | "accepted" | "rejected" | "played";
  user: {
    name: string;
    email: string;
  };
};

export default function DjRequestsPage() {
    const { requests, token } = useLoaderData<{ requests: { data: SongRequest[] }; token: string }>();
    const [songRequests, setSongRequests] = useState<SongRequest[]>(requests.data);
  
    const updateRequestStatus = async (id: number, action: string) => {
      try {
        const response = await fetch(`http://localhost/api/dj/requests/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ action }), // Enviar { action: "accepted" }
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al canviar l'estat.");
        }
  
        // Actualitza l'estat local
        setSongRequests((prev) =>
          prev.map((request) =>
            request.id === id ? { ...request, status: action } : request
          )
        );
      } catch (err) {
        console.error(err);
        alert("Error: No s'ha pogut actualitzar l'estat.");
      }
    };
  
    return (
      <div className="py-12 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Gestió de Sol·licituds</h1>
        <ul className="space-y-4">
          {songRequests.slice().reverse().map((request) => { // Inverteix l'ordre
            const songDetails = JSON.parse(request.song_details);
  
            return (
              <li key={request.id} className="bg-gray-600 p-4 rounded-lg shadow-md">
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
  
                {/* Botons per gestionar l'estat */}
                <div className="flex space-x-4 mt-4">
                  {request.status === "pending" && (
                    <>
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                        onClick={() => updateRequestStatus(request.id, "accepted")}
                      >
                        Acceptar
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                        onClick={() => updateRequestStatus(request.id, "rejected")}
                      >
                        Rebutjar
                      </button>
                    </>
                  )}
                  {request.status === "accepted" && (
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                      onClick={() => updateRequestStatus(request.id, "played")}
                    >
                      Marcar com a Tocada
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
  
