import { useLoaderData } from "@remix-run/react";
import { SongRequest } from "~/utils/Interfaces";


export default function DjRequestsList() {
  const { requests } = useLoaderData<{ requests: { data: SongRequest[] } }>();

  return (
    <ul>
      {requests.data.map((request) => {
        const songDetails = JSON.parse(request.song_details);
        return (
          <li key={request.id}>
            <p>Cançó: {songDetails.title}</p>
            <p>Estat: {request.status}</p>
          </li>
        );
      })}
    </ul>
  );
}
