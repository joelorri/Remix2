import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { loader } from "~/server/djRequests.server";
import { SongRequest, updateRequestStatus } from "~/utils/djRequests.utils";


export { loader };

export default function DjRequestsPage() {
  const { requests, token } = useLoaderData<{ requests: { data: SongRequest[] }; token: string }>();
  const [songRequests, setSongRequests] = useState<SongRequest[]>(requests.data);

  const handleUpdateStatus = async (id: number, action: string) => {
    try {
      await updateRequestStatus(token, id, action);
      setSongRequests((prev) =>
        prev.map((request) =>
          request.id === id ? { ...request, status: action as SongRequest["status"] } : request
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
        {songRequests.slice().reverse().map((request) => {
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

              <div className="flex space-x-4 mt-4">
                {request.status === "pending" && (
                  <>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                      onClick={() => handleUpdateStatus(request.id, "accepted")}
                    >
                      Acceptar
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                      onClick={() => handleUpdateStatus(request.id, "rejected")}
                    >
                      Rebutjar
                    </button>
                  </>
                )}
                {request.status === "accepted" && (
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                    onClick={() => handleUpdateStatus(request.id, "played")}
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
