import { LoaderFunction, ActionFunction, json, redirect } from "@remix-run/node";
import { getSessionData } from "~/server/auth.server";
import { Playlist, Song } from "../utils/Interfaces";

// Fetch playlist by ID
async function fetchPlaylist(id: string, token: string): Promise<Playlist> {
  const response = await fetch(`http://localhost/api/playlists/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("No s'ha pogut carregar la playlist.");
  }

  const data = await response.json();
  const playlist = data.playlist;

  if (!Array.isArray(playlist.songs)) {
    playlist.songs = [];
  }

  return playlist;
}

// Update playlist by ID
async function updatePlaylist(id: string, token: string, data: { name: string; description: string; songs: Song[] }): Promise<void> {
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
}

// Loader function
export const loader: LoaderFunction = async ({ params, request }) => {
  const { id } = params;
  const { token } = await getSessionData(request);

  if (!id) {
    throw new Error("ID de la playlist no especificat.");
  }

  const playlist = await fetchPlaylist(id, token);

  return json({ playlist, token });
};

// Action function
export const action: ActionFunction = async ({ params, request }) => {
  const { id } = params;
  const { token } = await getSessionData(request);

  if (!id) {
    throw new Error("ID de la playlist no especificat.");
  }

  const formData = await request.formData();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const songs = JSON.parse(formData.get("songs") as string);

  const data = { name, description, songs };
  await updatePlaylist(id, token, data);

  return redirect(`/playlist`);
};
