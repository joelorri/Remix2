import { LoaderFunction, ActionFunction, json, redirect } from "@remix-run/node";
import { useLoaderData, Form, useActionData, useNavigate } from "@remix-run/react";
import { getSessionData } from "~/auth.server";
import { useUser } from "~/context/UserContext";
import { useEffect} from "react";

export const loader: LoaderFunction = async ({ request }) => {
  const sessionData = await getSessionData(request);
  const { user, token } = sessionData;

  if (!user || !token) {
    throw redirect("/login");
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

  // Petició al backend per actualitzar el perfil
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
  return json({ user: updatedUser, logout: true }); // Indica que s'ha d'executar el logout
};

export default function ProfilePage() {
  const { user } = useLoaderData<{ user: { name: string; email: string } }>();
  const actionData = useActionData<{ logout?: boolean; errors?: { name?: string; email?: string } }>();
  const { setToken } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Si el backend retorna logout, mostra l'alerta i redirigeix després de 3 segons
    if (actionData?.logout) {
      alert("Els canvis s'han desat correctament. Se't desconnectarà ara.");
      setToken(null); // Elimina el token del context
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  }, [actionData, setToken, navigate]);

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Edita el teu perfil</h1>

      <Form method="post" className="space-y-4">
        <div>
          <label htmlFor="name" className="block font-medium">Nom</label>
          <input
            id="name"
            type="text"
            name="name"
            defaultValue={user.name}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          {actionData?.errors?.name && (
            <p className="text-red-500 text-sm">{actionData.errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block font-medium">Correu electrònic</label>
          <input
            type="email"
            name="email"
            defaultValue={user.email}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          {actionData?.errors?.email && (
            <p className="text-red-500 text-sm">{actionData.errors.email}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
        >
          Desa canvis
        </button>
      </Form>

      {!actionData?.errors && (
        <p className="mt-4 text-green-500">Perfil actualitzat correctament!</p>
      )}
    </div>
  );
}
