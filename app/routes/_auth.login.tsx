import { useActionData } from "@remix-run/react";
import LoginForm from "~/components/LoginForm";
import AuthContainer from "~/components/AuthContainer";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { login } from "~/server/auth.server";

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
    return json({ error: (error as Error).message }, { status: 401 });
  }
};

type ActionData = {
  error?: string;
};

export default function LoginPage() {
  const actionData = useActionData<ActionData>();

  return (
    <AuthContainer>
      <h1 className="text-3xl font-bold text-center text-gray-100">Inicia Sessió</h1>
      <LoginForm error={actionData?.error} />
    </AuthContainer>
  );
}
