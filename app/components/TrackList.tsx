import React from "react";
import { TrackListProps } from "~/utils/Interfaces";

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
    <li
      key={track.id}
      className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0 ">
        <iframe
          title={`Spotify track ${track.name} by ${track.artist}`}
          src={`https://open.spotify.com/embed/track/${track.id}`}
          width="100%"
          height="80"
          allow="encrypted-media"
          className="rounded-md sm:flex-grow"
        ></iframe>
        <input
          type="checkbox"
          checked={!!selectedTracks[track.id]}
          onChange={() => onSelectTrack(track.id)}
          className="cursor-pointer w-6 h-6 sm:ml-2"
        />

      </div>
      <textarea
        placeholder="Escriu un comentari..."
        value={comments[track.id] || ""}
        onChange={(e) =>
          onCommentChange(track.id, e.target.value)
        }
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md mt-4 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
      />
    </li>
  ))}
</ul>

  );
};

export default TrackList;
