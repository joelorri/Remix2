import { Form } from "@remix-run/react";
import { LoginFormProps } from "~/utils/Interfaces";

export default function LoginForm({ error }: LoginFormProps) {
  return (
    <>
      <Form method="post" className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300"
          >
            Correu electrònic
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Correu electrònic"
            className="w-full p-2 mt-1 border border-gray-600 rounded bg-gray-700 text-gray-100 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-300"
          >
            Contrasenya
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Contrasenya"
            className="w-full p-2 mt-1 border border-gray-600 rounded bg-gray-700 text-gray-100 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Inicia sessió
        </button>
      </Form>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="flex justify-between items-center mt-4 text-gray-300">
        <a
          href="/register"
          className="text-sm font-medium text-blue-400 hover:underline"
        >
          Registrar-se
        </a>
        <a
          href="/forgot"
          className="text-sm font-medium text-blue-400 hover:underline"
        >
          He oblidat la contrasenya
        </a>
      </div>
    </>
  );
}
