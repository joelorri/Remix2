import { Form, useActionData, Link } from "@remix-run/react";
import { ActionFunction, json } from "@remix-run/node";
import FormField from "~/components/FormField";
import SubmitButton from "~/components/SubmitButton";
import { sendForgotPasswordEmail } from "~/auth.server";

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const email = formData.get("email") as string;

    const message = await sendForgotPasswordEmail(email);
    return json({ success: true, message });
  } catch (error) {
    return json({ success: false, message: error instanceof Error ? error.message : "Unknown error" });
  }
};

export default function ForgotPassword() {
  const actionData = useActionData<{ success: boolean; message: string }>();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="w-full max-w-md p-6 bg-gray-800 shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Recupera la contrasenya</h1>
        {actionData && (
          <p
            className={`text-center mb-4 ${
              actionData.success ? "text-green-500" : "text-red-500"
            }`}
          >
            {actionData.message}
          </p>
        )}
        <Form method="post" className="space-y-4">
          <FormField
            label="Adreça electrònica"
            id="email"
            name="email"
            type="email"
            placeholder="Introdueix el teu correu"
          />
          <div className="flex justify-between space-x-4">
            <SubmitButton label="Envia l'enllaç de recuperació" />
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
