import { useEffect, useState } from "react";
import DjInfo from "../components/DjInfo";
import SearchForm from "../components/SearchForm";
import TrackList from "../components/TrackList";
import {  useLoaderData, useNavigate } from "@remix-run/react";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { getSessionData } from "~/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const { user, token } = await getSessionData(request);

  if (!user || !token) {
    throw redirect("/login");
  }

  return json({ user, token });
};

interface Dj {
  id: string;
  name: string;
  email: string;
}

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
}

export default function SelectSongs() {
  const { token } = useLoaderData<{ user: Dj; token: string }>();

  const [dj, setDj] = useState<Dj | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTracks, setSelectedTracks] = useState<{ [id: string]: string }>({});
  const [comments, setComments] = useState<{ [id: string]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split("; ").reduce((acc: { [key: string]: string }, cookie) => {
      const [name, value] = cookie.split("=");
      acc[name] = decodeURIComponent(value);
      return acc;
    }, {});

    if (cookies.selectedDj) {
      setDj(JSON.parse(cookies.selectedDj));
    }
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setError("Si us plau, introdueix una cerca.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`http://localhost/api/spotify/search?query=${encodeURIComponent(query)}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("No s'han trobat resultats per la cerca.");
      }

      const data = await response.json();
      setTracks(data.data.tracks || []);
    } catch (err) {
      console.error("Error al fer la cerca:", err);
      setError("Hi ha hagut un error al realitzar la cerca.");
    } finally {
      setIsLoading(false);
    }
  };
  const navigate = useNavigate(); // Inicialitza la funció de navegació

  const handleSubmit = async () => {
    if (!dj || !token || !Object.keys(selectedTracks).length) {
      setError("Selecciona almenys una cançó i assegura't que estàs autenticat.");
      return;
    }
  
    setIsSubmitting(true);
    setError(null);
  
    try {
      const payload = {
        dj_id: dj.id,
        songs: Object.keys(selectedTracks).map((id, index) => index + 1), // Assigna IDs numèrics
        comments: Object.keys(selectedTracks).reduce((acc, id, index) => {
          acc[index + 1] = comments[id] || ""; // Assigna els comentaris amb els nous IDs
          return acc;
        }, {} as { [key: number]: string }),
        tracks: Object.keys(selectedTracks).reduce((acc, id, index) => {
          const track = tracks.find((t) => t.id === id);
          if (track) {
            acc[index + 1] = track.name;
            acc[`${index + 1}_artist`] = track.album?.artists?.[0]?.name || "Desconegut";
          }
          return acc;
        }, {} as { [key: string]: string }),
      };
  
      const response = await fetch("http://localhost/api/requests/stored", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error en enviar les dades.");
      }
  
      alert("Les dades s'han enviat correctament!");
  
      // Elimina la cookie del DJ
      document.cookie = "selectedDj=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  
      // Redirigeix a /home
      navigate("/home");
    } catch (err) {
      console.error("Error al enviar les dades:", err);
      setError(
        err instanceof Error ? err.message : "Hi ha hagut un error desconegut."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
  
  
  

  return (
    <div className="py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Selecciona Cançons</h1>
      {error && <p className="text-red-500">{error}</p>}
      {dj ? <DjInfo dj={dj} /> : <p className="text-gray-500">No s&apos;ha seleccionat cap DJ.</p>}
      <SearchForm onSearch={handleSearch} isLoading={isLoading} />
      {tracks.length > 0 && (
        <TrackList
          tracks={tracks}
          selectedTracks={selectedTracks}
          comments={comments}
          onSelectTrack={(trackId) =>
            setSelectedTracks((prev) => {
              const updated = { ...prev };
              if (updated[trackId]) delete updated[trackId];
              else updated[trackId] = trackId;
              return updated;
            })
          }
          onCommentChange={(trackId, comment) => setComments((prev) => ({ ...prev, [trackId]: comment }))}
        />
      )}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`mt-4 px-6 py-2 ${isSubmitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} text-white rounded-md`}
      >
        {isSubmitting ? "Enviant..." : "Enviar"}
      </button>
    </div>
  );
}
