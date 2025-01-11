import { useLoaderData } from "@remix-run/react";

type SongRequest = {
  id: number;
  song_details: string;
  comments: string | null;
  status: string;
  user: {
    name: string;
    email: string;
  };
};

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
