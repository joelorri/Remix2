import { useLoaderData, Form, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { loader, action } from '../editPlaylist.server';


export { loader, action };

type Song = {
  id: string;
  title: string;
  artist: string;
};

type Playlist = {
  id: number;
  name: string;
  description: string;
  songs: Song[];
  created_at: string;
  updated_at: string;
};
export default function EditPlaylist() {
  const { playlist, token } = useLoaderData<{ playlist: Playlist; token: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: playlist.name,
    description: playlist.description,
    songs: playlist.songs || [],
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const removeSong = (index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      songs: prevData.songs.filter((_, i) => i !== index),
    }));
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Si us plau, introdueix una cerca.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `http://localhost/api/spotify/search?query=${encodeURIComponent(searchQuery)}`,
        { method: "GET", headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) throw new Error("No s'han trobat resultats per la cerca.");

      const data = await response.json();
      const tracks = data.data.tracks || [];
      setSearchResults(
        tracks.map((track: { id: string; name: string; artists: { name: string }[] }) => ({
          id: track.id,
          title: track.name,
          artist: track.artists?.[0]?.name || "Desconegut",
        }))
      );
    } catch {
      setError("Hi ha hagut un error al realitzar la cerca.");
    } finally {
      setIsLoading(false);
    }
  };

  const addSongFromSearch = (song: Song) => {
    setFormData((prevData) => ({
      ...prevData,
      songs: [...prevData.songs, song],
    }));
  };

  const handleCancel = () => {
    navigate("/playlist");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 shadow-lg rounded-md">
      <h1 className="text-2xl font-bold text-white mb-6">Editar Playlist</h1>
      <Form method="post" className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white">
            Nom de la Playlist
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-white">
            Descripció
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <h2 className="text-xl font-semibold text-white">Cançons</h2>
        {formData.songs.map((song, index) => (
          <div key={song.id} className="bg-gray-50 p-4 rounded-md shadow-sm space-y-4">
            <iframe
              title={`Spotify track ${song.title} by ${song.artist}`}
              src={`https://open.spotify.com/embed/track/${song.id}`}
              width="100%"
              height="80"
              allow="encrypted-media"
              className="rounded-md"
            ></iframe>
            <button
              type="button"
              onClick={() => removeSong(index)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Elimina
            </button>
          </div>
        ))}

        <h3 className="text-lg font-semibold text-white">Cerca Cançons</h3>
        <div className="flex space-x-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Introdueix un terme de cerca"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {isLoading ? "Cercant..." : "Cerca"}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <ul className="space-y-4">
          {searchResults.map((result) => (
            <li
              key={result.id}
              className="bg-gray-50 p-4 rounded-md shadow-sm flex items-center justify-between"
            >
              <iframe
                title={`Spotify track ${result.title} by ${result.artist}`}
                src={`https://open.spotify.com/embed/track/${result.id}`}
                width="100%"
                height="80"
                allow="encrypted-media"
                className="rounded-md"
              ></iframe>
              <button
                type="button"
                onClick={() => addSongFromSearch(result)}
                className="ml-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Afegir
              </button>
            </li>
          ))}
        </ul>

        <input type="hidden" name="songs" value={JSON.stringify(formData.songs)} />
        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
          >
            Guardar Playlist
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Cancel·lar
          </button>
        </div>
      </Form>
    </div>
  );
}
