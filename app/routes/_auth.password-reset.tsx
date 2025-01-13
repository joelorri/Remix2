import { ActionFunction, json, redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";

// Funció d'acció per gestionar la sol·licitud de restabliment de contrasenya
export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    let email = formData.get("email") as string | null;
    const password = formData.get("password");
    const password_confirmation = formData.get("password_confirmation");
    const token = formData.get("token");

    // Netegem l'email en cas que contingui valors duplicats o incorrectes
    if (email) {
      const [cleanEmail] = email.split("?email="); // Divideix i selecciona només la primera part
      email = cleanEmail.trim();
    }

    const dataInput = { email, password, password_confirmation, token };

    // Validar que tots els camps estan plens
    if (!email || !password || !password_confirmation || !token) {
      return json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    console.log(dataInput);

    // Enviar la sol·licitud al servidor backend
    const response = await fetch(`http://localhost/api/password/reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataInput),
    });

    if (response.ok) {
      return redirect("/login"); // Redirigir a la pàgina de login en cas d'èxit
    }

    const errorData = await response.json();
    return json({ success: false, message: errorData.message });
  } catch (error) {
    return json({ success: false, message: "An unexpected error occurred." });
  }
};

export default function PasswordReset() {
  const actionData = useActionData<{ success: boolean; message: string }>();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  // Comprovació inicial dels paràmetres
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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
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

function FormField({
  label,
  id,
  name,
  type,
  placeholder,
}: {
  label: string;
  id: string;
  name: string;
  type: string;
  placeholder: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        className="w-full px-4 py-2 border rounded-md"
      />
    </div>
  );
}

function SubmitButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    >
      {label}
    </button>
  );
}