import { ActionFunction, json } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { resetPassword } from "~/server/auth.server";

import FormField from "~/components/FormField";
import SubmitButton from "~/components/SubmitButton";

// Action Function
export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;
    const password_confirmation = formData.get("password_confirmation") as
      | string
      | null;
    const token = formData.get("token") as string | null;

    if (!email || !password || !password_confirmation || !token) {
      return json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.split("?email=")[0].trim(); // Sanitize email
    const data = { email: cleanEmail, password, password_confirmation, token };

    return await resetPassword(data);
  } catch (error) {
    return json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
    });
  }
};

export default function PasswordReset() {
  const actionData = useActionData<{ success: boolean; message: string }>();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  if (!token || !email) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-6">Invalid Reset Link</h1>
        <p className="text-red-500">
          The reset link is invalid or missing parameters.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-6">Reset Password</h1>

      {actionData && (
        <p
          className={`mb-4 ${
            actionData.success ? "text-green-500" : "text-red-500"
          }`}
        >
          {actionData.message}
        </p>
      )}

      <Form method="post" className="space-y-4">
        <input type="hidden" name="token" value={token} />
        <input type="hidden" name="email" value={email?.split("?")[0]} />
        <FormField
          label="New Password"
          id="password"
          name="password"
          type="password"
          placeholder="New Password"
        />
        <FormField
          label="Confirm Password"
          id="password_confirmation"
          name="password_confirmation"
          type="password"
          placeholder="Confirm Password"
        />
        <SubmitButton label="Reset Password" />
      </Form>
    </div>
  );
}
