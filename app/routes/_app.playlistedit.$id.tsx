import { LoaderFunction, ActionFunction, json, redirect } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { useState } from "react";
import { getSessionData } from "~/auth.server";

type Song = {
  id: number;
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

// Loader per carregar la playlist
export const loader: LoaderFunction = async ({ params, request }) => {
  const { id } = params;
  const { token } = await getSessionData(request);

  if (!id) throw new Error("ID de la playlist no especificat.");

  const response = await fetch(`http://localhost/api/playlists/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("No s'ha pogut carregar la playlist.");

  const data = await response.json();

  const playlist = data.playlist;

  // Garantir que songs sigui un array
  if (!Array.isArray(playlist.songs)) {
    playlist.songs = [];
  }

  return json(playlist);
};

// Action per gestionar l'enviament de dades
export const action: ActionFunction = async ({ request, params }) => {
  const { id } = params;
  const { token } = await getSessionData(request);

  if (!id) throw new Error("ID de la playlist no especificat.");

  const formData = await request.formData();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const songs = JSON.parse(formData.get("songs") as string);

  // Construir el JSON final
  const data = { name, description, songs };

  const response = await fetch(`http://localhost/api/playlistsAdd/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Error al guardar la playlist.");
  }

  return redirect(`/playlist`);
};

// Component React
export default function EditPlaylist() {
  const playlist = useLoaderData<Playlist>();

  const [formData, setFormData] = useState({
    name: playlist.name,
    description: playlist.description,
    songs: playlist.songs || [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSongChange = (index: number, field: string, value: string) => {
    const updatedSongs = [...formData.songs];
    updatedSongs[index] = { ...updatedSongs[index], [field]: value };
    setFormData((prevData) => ({ ...prevData, songs: updatedSongs }));
  };

  const addSong = () => {
    setFormData((prevData) => ({
      ...prevData,
      songs: [...prevData.songs, { id: Date.now(), title: "", artist: "" }],
    }));
  };

  const removeSong = (index: number) => {
    const updatedSongs = formData.songs.filter((_, i) => i !== index);
    setFormData((prevData) => ({ ...prevData, songs: updatedSongs }));
  };

  return (
    <div>
      <h1>Editar Playlist</h1>
      <Form method="post">
        <label htmlFor="name">Nom de la Playlist:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="description">Descripció:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>

        <h2>Cançons</h2>
        {formData.songs.map((song, index) => (
          <div key={song.id}>
            <label>Títol:</label>
            <input
              type="text"
              value={song.title}
              onChange={(e) => handleSongChange(index, "title", e.target.value)}
            />
            <label>Artista:</label>
            <input
              type="text"
              value={song.artist}
              onChange={(e) => handleSongChange(index, "artist", e.target.value)}
            />
            <button type="button" onClick={() => removeSong(index)}>
              Elimina
            </button>
          </div>
        ))}

        <button type="button" onClick={addSong}>
          Afegir Cançó
        </button>

        {/* Enviar songs com a JSON */}
        <input type="hidden" name="songs" value={JSON.stringify(formData.songs)} />
        <button type="submit">Guardar Playlist</button>
      </Form>
    </div>
  );
}
