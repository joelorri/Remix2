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
