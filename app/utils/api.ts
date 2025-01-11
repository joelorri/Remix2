export async function toggleRole(token: string) {
    try {
        const response = await fetch("http://localhost/api/profile/toggle-role", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error canviant el rol.");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

export async function searchProfiles(query: string, token: string) {
    try {
        const response = await fetch(
            `http://localhost/api/profile/searchs?query=${encodeURIComponent(query)}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Error durant la cerca. Status: ${response.status}`);
        }

        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error("Error durant la cerca de perfils:", error);
        throw new Error("No s'ha pogut completar la cerca.");
    }
}
