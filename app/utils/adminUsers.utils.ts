export type User = {
    id: number;
    name: string;
    email: string;
    super: string;
};

// Delete a user
export const deleteUser = async (userId: number, token: string): Promise<void> => {
    const response = await fetch(`http://localhost/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("No s'ha pogut eliminar l'usuari.");
    }
};

// Update a user
export const updateUser = async (user: User, token: string): Promise<User> => {
    const response = await fetch(`http://localhost/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
    });

    if (!response.ok) {
        throw new Error("Failed to update user.");
    }

    return response.json();
};
