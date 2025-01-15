import { createCookieSessionStorage, LoaderFunction, redirect, json } from '@remix-run/node';
import { PasswordResetData, RegisterData } from './utils/Interfaces';

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


export async function registerUser(data: RegisterData) {
  const { name, email, password, password_confirmation } = data;

  if (password !== password_confirmation) {
    throw new Error("Passwords do not match.");
  }

  try {
    const response = await fetch("http://localhost/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error during registration.");
    }

    return { success: true };
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "Unknown error occurred.");
  }
}


export async function resetPassword(data: PasswordResetData) {
  const { email, password, password_confirmation, token } = data;

  // Validate input
  if (!email || !password || !password_confirmation || !token) {
    throw new Error("All fields are required.");
  }

  // Send reset password request to backend
  const response = await fetch("http://localhost/api/password/reset", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, password_confirmation, token }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "An unexpected error occurred.");
  }

  return redirect("/login");
}

export async function sendForgotPasswordEmail(email: string) {
  if (!email) {
    throw new Error("Email is required.");
  }

  const response = await fetch("http://localhost/api/password/forgot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "An error occurred.");
  }

  const data = await response.json();
  return data.message;
}

export async function fetchSongRequests(token: string) {
  const response = await fetch("http://localhost/api/requests/getRequest", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error fetching song requests.");
  }

  return response.json();
}


export const validateToken = async (request: Request) => {
  const { token } = await getSessionData(request);

  if (!token) {
    throw redirect("/login");
  }

  return token;
};

export const fetchUser = async (token: string) => {
  const response = await fetch("http://localhost/api/whoami", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw redirect("/login");
  }

  const data = await response.json();

  if (!data.success || !data.user) {
    throw redirect("/login");
  }

  return data.user;
};


// Loader for fetching user data
export const loader: LoaderFunction = async ({ request }) => {
  const { token } = await getSessionData(request);

  if (!token) {
    throw redirect("/login");
  }

  try {
    const response = await fetch("http://localhost/api/whoami", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw redirect("/login");
    }

    const data = await response.json();

    if (!data.success || !data.user) {
      throw redirect("/login");
    }

    return json({ user: data.user, token });
  } catch (error) {
    console.error("Error carregant l'usuari des de whoami:", error);
    throw redirect("/login");
  }
};

// Toggle user role
export const toggleUserRole = async (token: string): Promise<{ role: string }> => {
  const response = await fetch("http://localhost/api/profile/toggle-role", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Error canviant el rol.");
  }

  const data = await response.json();
  return data.data;
};

// Logout user
export const logoutUser = async (token: string): Promise<void> => {
  const response = await fetch("http://localhost/api/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("No s'ha pogut completar la desconnexió.");
  }
};
