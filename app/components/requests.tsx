import { useLoaderData } from "@remix-run/react";

type SongRequest = {
  id: number;
  song_name: string;
  artist_name: string;
  status: string; // "pending", "approved", "rejected", etc.
  created_at: string;
};

export default function RequestsPage() {
  const { data: songRequests, error } = useLoaderData<{
    data: SongRequest[] | null;
    error?: string;
  }>();

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Cançons Demanades</h1>

      {songRequests && songRequests.length > 0 ? (
        <ul className="space-y-4">
          {songRequests.map((request) => (
            <li
              key={request.id}
              className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md"
            >
              <p>
                <strong>Cançó:</strong> {request.song_name}
              </p>
              <p>
                <strong>Artista:</strong> {request.artist_name}
              </p>
              <p>
                <strong>Estat:</strong> {request.status}
              </p>
              <p className="text-sm text-gray-500">
                Sol·licitat el: {new Date(request.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No hi ha sol·licituds registrades.</p>
      )}
    </div>
  );
}
