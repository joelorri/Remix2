import { LoaderFunction, redirect, json, ActionFunction } from '@remix-run/node';
import { getSessionData, requireAdmin } from "./auth.server";

// Helper per fer una petició POST
export const createUser = async (token: string, userData: Record<string, unknown>) => {
    const response = await fetch("http://localhost/api/admin/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        throw new Error("No s'ha pogut crear l'usuari.");
    }

    return response.json();
};

// Helper per fer una petició PUT
export const editUser = async (
    token: string,
    userId: string,
    userData: Record<string, unknown>
) => {
    const response = await fetch(`http://localhost/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        throw new Error("No s'ha pogut editar l'usuari.");
    }

    return response.json();
};

export const loader: LoaderFunction = async ({ request }) => {
    const { user, token } = await getSessionData(request);

    // Ensure the user is an admin
    if (user.super !== "admin") {
        throw redirect("/login");
    }

    try {
        const response = await fetch("http://localhost/api/admin/users", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("No s'han pogut carregar els usuaris.");
        }

        const users = await response.json();
        return json({ user, token, users: users.data });
    } catch (error) {
        console.error("Error loading users:", error);
        throw new Error("Error carregant els usuaris.");
    }
};
export const action: ActionFunction = async ({ request }) => {
    const { token } = await requireAdmin(request);
    const formData = await request.formData();
    const userData = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        super: formData.get("super"),
    };

    if (!userData.name || !userData.email || !userData.password) {
        return json(
            { error: "Tots els camps són obligatoris." },
            { status: 400 }
        );
    }

    const response = await fetch("http://localhost/api/admin/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        return json(
            { error: errorData.message || "Error creant l'usuari." },
            { status: response.status }
        );
    }
    return redirect("/admin-dashboard");
};