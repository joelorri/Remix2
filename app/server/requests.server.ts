import { LoaderFunction, json } from '@remix-run/node';
import { fetchSongRequests, getSessionData } from "./auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const { user, token } = await getSessionData(request);

  try {
    const songRequests = await fetchSongRequests(token);
    return json({ user, token, songRequests });
  } catch (error) {
    return json({ user, token, songRequests: null });
  }
};
