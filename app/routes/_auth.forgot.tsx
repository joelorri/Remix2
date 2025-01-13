import { Form, useActionData, Link } from "@remix-run/react";
import { ActionFunction, json } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");

  const response = await fetch("http://localhost/api/password/forgot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (response.ok) {
    const data = await response.json();
    return json({ success: true, message: data.message });
  }

  const data = await response.json();
  return json({ success: false, message: data.message });
};

export default function ForgotPassword() {
  const actionData = useActionData<{ success: boolean; message: string }>();

  return (
    <div className=" 4">
      <div className="w-full max-w-md p-6 bg-gray-800 shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Recupera la contrasenya</h1>
        {actionData && (
          <p
            className={`text-center mb-4 ${
              actionData?.success ? "text-green-500" : "text-red-500"
            }`}
          >
            {actionData?.message}
          </p>
        )}
        <Form method="post" className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Adreça electrònica
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="w-full px-4 py-2 mt-1 border border-gray-600 rounded bg-gray-700 text-gray-100 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Introdueix el teu correu"
            />
          </div>
          <div className="flex justify-between space-x-4">
            <button
              type="submit"
              className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Envia l&apos;enllaç de recuperació
            </button>
            <Link
              to="/login"
              className="w-full py-2 text-center text-white bg-gray-600 rounded hover:bg-gray-700"
            >
              Cancel·la
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
