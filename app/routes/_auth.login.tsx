import { Form, useActionData } from "@remix-run/react";
import { ActionFunction, json } from "@remix-run/node";
import { login } from "~/auth.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return json({ error: "Tots els camps són obligatoris." }, { status: 400 });
  }

  try {
    return await login({ email, password });
  } catch (error) {
    return json({ error: error.message }, { status: 401 });
  }
};

export default function LoginPage() {
  const actionData = useActionData();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Inicia Sessió</h1>
      <Form method="post" className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Correu electrònic"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Contrasenya"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Inicia sessió
        </button>
      </Form>
      {actionData?.error && <p className="text-red-500">{actionData.error}</p>}
    </div>
  );
}
