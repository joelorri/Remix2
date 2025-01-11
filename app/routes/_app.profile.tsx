import { LoaderFunction, ActionFunction, json, redirect } from "@remix-run/node";
import { useLoaderData, Form, useActionData } from "@remix-run/react";
import { getSessionData } from "~/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const { user, token } = await getSessionData(request);

  if (!user || !token) {
    throw redirect("/login"); // Redirigeix si no hi ha usuari
  }

  return json({ user, token });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  const { token } = await getSessionData(request);

  if (!token) {
    throw redirect("/login");
  }

  // Petició al backend per actualitzar l'usuari
  const response = await fetch("http://localhost/api/profile/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, email }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    return json({ errors: errorData.errors }, { status: response.status });
  }

  const updatedUser = await response.json();
  return json({ user: updatedUser });
};

export default function ProfilePage() {
  const { user } = useLoaderData();
  const actionData = useActionData();

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Edita el teu perfil</h1>

      <Form method="post" className="space-y-4">
        <div>
          <label className="block font-medium">Nom</label>
          <input
            type="text"
            name="name"
            defaultValue={user.name}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {actionData?.errors?.name && (
            <p className="text-red-500 text-sm">{actionData.errors.name}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Correu electrònic</label>
          <input
            type="email"
            name="email"
            defaultValue={user.email}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {actionData?.errors?.email && (
            <p className="text-red-500 text-sm">{actionData.errors.email}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Desa canvis
        </button>
      </Form>

      {actionData?.user && (
        <p className="mt-4 text-green-500">Perfil actualitzat correctament!</p>
      )}
    </div>
  );
}
