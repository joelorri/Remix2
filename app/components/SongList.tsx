import { SongListProps } from "~/utils/Interfaces";

export default function SongList({ songs, onRemove }: SongListProps) {
  return (
    <div>
      {songs.map((song, index) => (
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
            onClick={() => onRemove(index)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Elimina
          </button>
        </div>
      ))}
    </div>
  );
}
