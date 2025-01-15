import { LoaderFunction, json } from '@remix-run/node';
import { getSessionData } from "./auth.server";
import { Playlist } from '../utils/Interfaces';


export async function fetchPlaylist(id: string, token: string) {
  const response = await fetch(`http://localhost/api/playlists/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("No s'ha pogut carregar la playlist.");
  }

  const data = await response.json();
  return data.playlist;
}

export async function updatePlaylist(id: string, token: string, data: { name: string; songs: string[] }) {
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

  return response.json();
}

async function fetchPlaylists(token: string): Promise<Playlist[]> {
    const response = await fetch("http://localhost/api/playlistsGet", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error("No s'han pogut carregar les playlists.");
    }
  
    const data = await response.json();
    return (data.playlists || []).map((playlist: Playlist) => ({
      ...playlist,
      songs: Array.isArray(playlist.songs) ? playlist.songs : [],
    }));
  }
  
  export const loader: LoaderFunction = async ({ request }) => {
    const { token } = await getSessionData(request);
    const playlists = await fetchPlaylists(token);
  
    return json({ playlists, token });
  };