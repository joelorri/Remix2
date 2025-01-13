import { createCookieSessionStorage, redirect } from "@remix-run/node";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "user_session",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 dies
  },
});

export async function login({ email, password }: { email: string; password: string }) {
  try {
    const response = await fetch(`http://localhost/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Error durant el login.");
    }

    const { token, user } = await response.json();

    if (!token || !user) {
      throw new Error("El servidor no ha retornat dades correctes.");
    }

    // Crea una nova sessió i guarda el token i l'usuari
    const session = await sessionStorage.getSession();
    session.set("token", token);
    session.set("user", user); // Guarda l'usuari complet

    return redirect("/home", {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    });
  } catch (err) {
    console.error("Error al login:", err);
    throw new Error("Credencials incorrectes o problema del servidor.");
  }
}

// Obtenir dades de la sessió
export async function getSessionData(request: Request) {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  return {
    token: session.get("token"),
    user: session.get("user"),
  };
}

export async function logout(request: Request) {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));

  // Elimina el token de la sessió
  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export async function requireAdmin(request: Request) {
  const { user, token } = await getSessionData(request);

  if (!user || !token || user.super !== "admin") {
    throw redirect("/login");
  }

  return { user, token };
}

export type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export async function registerUser(formData: RegisterFormData) {
  const response = await fetch("http://localhost/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al registrar-se.");
  }

  return response.json(); // Retorna la resposta deserialitzada si és necessària
}