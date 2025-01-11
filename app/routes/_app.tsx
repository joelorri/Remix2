import { LoaderFunction, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';
import { getSessionData } from "~/auth.server";
import AppLayout from "~/components/AppLayout";
import { useUser } from '~/context/UserContext';

export const loader: LoaderFunction = async ({ request }) => {
  const { user, token } = await getSessionData(request);

  if (!user || !token) {
    return json({ user: null, token: null });
  }

  return json({ user, token });
};

export default function AppRoute() {
  const { user: loaderUser, token: loaderToken } = useLoaderData();
  const { setUser, setToken } = useUser();

  useEffect(() => {
    if (loaderUser && loaderToken) {
      setUser(loaderUser);
      setToken(loaderToken);
    }
  }, [loaderUser, loaderToken, setUser, setToken]);
  return <AppLayout />;
}
