import { LoaderFunction, json } from "@remix-run/node";
import { useNavigate, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { getSessionData } from "~/auth.server";

// Loader per carregar les playlists
export const loader: LoaderFunction = async ({ request }) => {
  const { token } = await getSessionData(request);

  const response = await fetch("http://localhost/api/playlistsGet", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("No s'han pogut carregar les playlists.");
  }

  const data = await response.json();

  const playlists = (data.playlists || []).map((playlist: any) => ({
    ...playlist,
    songs: Array.isArray(playlist.songs) ? playlist.songs : [], // Garanteix que `songs` sempre sigui un array
  }));

  return json({ playlists, token });
};

// Tipus de les playlists
type Playlist = {
  id: number;
  name: string;
  description: string;
  songs: { id: number; title: string; artist: string }[];
  created_at: string;
  updated_at: string;
};

export default function PlaylistsPage() {
  const { playlists, token } = useLoaderData<{ playlists: Playlist[]; token: string }>();
  const [playlistList, setPlaylistList] = useState(
    playlists.map((playlist) => ({
      ...playlist,
      songs: Array.isArray(playlist.songs) ? playlist.songs : [], // Garanteix que `songs` sigui un array
    }))
  );
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  // Funció per eliminar una playlist
  const handleDeletePlaylist = async (playlistId: number) => {
    if (!confirm("Estàs segur que vols eliminar aquesta playlist?")) return;

    try {
      const response = await fetch(`http://localhost/api/playlists/${playlistId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("No s'ha pogut eliminar la playlist.");
      }

      alert("Playlist eliminada correctament.");
      setPlaylistList((prev) => prev.filter((playlist) => playlist.id !== playlistId));
    } catch (err) {
      console.error(err);
      alert("Error eliminant la playlist.");
    }
  };

  // Funció per crear una nova playlist
  const handleCreatePlaylist = async (newPlaylist: Playlist) => {
    try {
      const response = await fetch("http://localhost/api/playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPlaylist),
      });

      if (!response.ok) {
        throw new Error("Error creant la playlist.");
      }

      const createdPlaylist = await response.json();
      setPlaylistList((prev) => [...prev, createdPlaylist]);
      setIsCreating(false);
    } catch (err) {
      console.error(err);
      alert("No s'ha pogut crear la playlist.");
    }
  };

  return (
    <div className="py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Les Teves Playlists</h1>

      {/* Botó per crear una nova playlist */}
      <button
        className="mb-6 px-4 py-2 bg-green-500 text-white rounded-md"
        onClick={() => setIsCreating(true)}
      >
        Crear Nova Playlist
      </button>

      {/* Llistat de playlists */}
      {playlistList.length > 0 ? (
        <ul className="space-y-4">
          {playlistList.map((playlist) => (
            <li key={playlist.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-bold">{playlist.name}</h2>
              <p>{playlist.description}</p>
              <p className="text-sm text-gray-500">
                Creada: {new Date(playlist.created_at).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Actualitzada: {new Date(playlist.updated_at).toLocaleString()}
              </p>
              <div className="mt-4">
                <h3 className="text-md font-semibold mb-2">Cançons:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {playlist.songs && Array.isArray(playlist.songs) ? (
                    playlist.songs.map((song) => (
                      <li key={song.id}>
                        <strong>{song.title}</strong> - {song.artist}
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-500">No hi ha cançons en aquesta playlist.</p>
                  )}
                </ul>

                <button
                  onClick={() => handleDeletePlaylist(playlist.id)}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Eliminar
                </button>

                <button
                  onClick={() => navigate(`/playlistedit/${playlist.id}`)}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Editar
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Encara no tens cap playlist.</p>
      )}

      {/* Formulari per crear playlist */}
      {isCreating && (
        <CreatePlaylistModal
          onClose={() => setIsCreating(false)}
          onCreate={handleCreatePlaylist}
        />
      )}
    </div>
  );
}

function CreatePlaylistModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (playlist: Playlist) => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    songs: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreate(formData as Playlist); // Crea la playlist
    window.location.reload(); // Refresca la pàgina
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Crear Nova Playlist</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium">
              Nom
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium">
              Descripció
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Cancel·lar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
