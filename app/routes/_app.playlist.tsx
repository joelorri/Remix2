import { useLoaderData, useNavigate } from "@remix-run/react";
import { useState, useEffect } from "react";
import CreatePlaylistModal from "~/components/CreatePlaylistModal";
import { loader } from "../playlist.server";
import { Playlist } from "~/editPlaylist.server";

export { loader };

export default function PlaylistsPage() {
  const { playlists, token } = useLoaderData<{ playlists: Playlist[]; token: string }>();
  const [playlistList, setPlaylistList] = useState(playlists);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setPlaylistList(playlists);
  }, [playlists]);

  const fetchPlaylists = async () => {
    try {
      const response = await fetch("http://localhost/api/playlistsGet", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("No s'han pogut carregar les playlists.");
      }

      const data = await response.json();
      setPlaylistList(
        (data.playlists || [])
          .map((playlist: Playlist) => ({
            ...playlist,
            songs: Array.isArray(playlist.songs) ? playlist.songs : [],
          }))
          .reverse()
      );
    } catch (err) {
      console.error("Error carregant les playlists:", err);
      alert("Hi ha hagut un error carregant les playlists.");
    }
  };

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
      await fetchPlaylists();
    } catch (err) {
      console.error(err);
      alert("Error eliminant la playlist.");
    }
  };

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

      alert("Playlist creada correctament.");
      await fetchPlaylists();
      setIsCreating(false);
    } catch (err) {
      console.error(err);
      alert("No s'ha pogut crear la playlist.");
    }
  };

  return (
    <div className="py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Les Teves Playlists</h1>
      <button
        className="mb-6 px-4 py-2 bg-green-500 text-white rounded-md"
        onClick={() => setIsCreating(true)}
      >
        Crear Nova Playlist
      </button>

      {playlistList.length > 0 ? (
        <ul className="space-y-4">
          {playlistList.reverse().map((playlist) => (
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
                  {playlist.songs && playlist.songs.length > 0 ? (
                    playlist.songs.reverse().map((song) => (
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

      {isCreating && (
        <CreatePlaylistModal
          onClose={() => setIsCreating(false)}
          onCreate={handleCreatePlaylist}
        />
      )}
    </div>
  );
}
