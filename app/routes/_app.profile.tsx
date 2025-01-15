import {
  useLoaderData,
  Form,
  useActionData,
  useNavigate,
} from "@remix-run/react";
import { useEffect } from "react";
import { useUser } from "~/context/UserContext";
import { loader, action } from "../server/profile.server";

export { loader, action };

export default function ProfilePage() {
  const { user } = useLoaderData<{ user: { name: string; email: string } }>();
  const actionData = useActionData<{
    logout?: boolean;
    errors?: { name?: string; email?: string };
  }>();
  const { setToken } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (actionData?.logout) {
      alert("Els canvis s'han desat correctament. Se't desconnectarà ara.");
      setToken(null);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  }, [actionData, setToken, navigate]);

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Edita el teu perfil</h1>

      <Form method="post" className="space-y-4">
        <ProfileInput
          id="name"
          label="Nom"
          name="name"
          defaultValue={user.name}
          error={actionData?.errors?.name}
        />
        <ProfileInput
          id="email"
          label="Correu electrònic"
          name="email"
          type="email"
          defaultValue={user.email}
          error={actionData?.errors?.email}
        />

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
        >
          Desa canvis
        </button>
      </Form>

      {actionData?.logout && (
        <p className="mt-4 text-green-500">Perfil actualitzat correctament!</p>
      )}
    </div>
  );
}

// Reusable Profile Input Component
function ProfileInput({
  id,
  label,
  name,
  type = "text",
  defaultValue,
  error,
}: {
  id: string;
  label: string;
  name: string;
  type?: string;
  defaultValue: string;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        defaultValue={defaultValue}
        className={`w-full p-2 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded focus:ring-2 focus:ring-blue-500`}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
