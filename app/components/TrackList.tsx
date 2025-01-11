import React from "react";

interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
}

interface TrackListProps {
  tracks: Track[];
  selectedTracks: { [id: string]: string };
  comments: { [id: string]: string };
  onSelectTrack: (trackId: string) => void;
  onCommentChange: (trackId: string, comment: string) => void;
}

const TrackList: React.FC<TrackListProps> = ({
  tracks,
  selectedTracks,
  comments,
  onSelectTrack,
  onCommentChange,
}) => {
  return (
    <ul className="space-y-4">
      {tracks.map((track) => (
        <li key={track.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md">
          <div className="flex justify-between">
            <span>
              <iframe
                title={`Spotify track ${track.name} by ${track.artist}`}
                src={`https://open.spotify.com/embed/track/${track.id}`}
                width="100%"
                height="80"
                allow="encrypted-media"
                className="rounded-md"
              ></iframe>
            </span>
            <input
              type="checkbox"
              checked={!!selectedTracks[track.id]}
              onChange={() => onSelectTrack(track.id)}
            />
          </div>
          <textarea
            placeholder="Escriu un comentari..."
            value={comments[track.id] || ""}
            onChange={(e) => onCommentChange(track.id, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2"
          />
        </li>
      ))}
    </ul>
  );
};

export default TrackList;
