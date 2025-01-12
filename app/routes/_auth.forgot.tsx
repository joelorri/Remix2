import { Form, useActionData } from "@remix-run/react";
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
  const actionData = useActionData();

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Forgot Password</h1>
      {actionData && (
        <p className={`text-${actionData.success ? "green" : "red"}-500`}>
          {actionData.message}
        </p>
      )}
      <Form method="post">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
          Send Reset Link
        </button>
      </Form>
    </div>
  );
}
