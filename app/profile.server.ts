import { ActionFunction, LoaderFunction, json } from '@remix-run/node';
import { getSessionData } from "./auth.server";
import { updateProfile } from './main.server';

// Loader Function
export const loader: LoaderFunction = async ({ request }) => {
  const { user, token } = await getSessionData(request);
  return json({ user, token });
};

// Action Function
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  const { token } = await getSessionData(request);

  try {
    const updatedUser = await updateProfile(token, name, email);
    return json({ user: updatedUser, logout: true });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return json({ errors: error.message }, { status: 400 });
    }
    return json({ errors: "Unknown error" }, { status: 400 });
  }
};
