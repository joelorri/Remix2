export type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    role: string;
    super: string;
    image: string;
};

export type SessionResponse = {
    success: boolean;
    user?: User;
    token?: string;
};

export async function getSessionFromDDBB(): Promise<SessionResponse | null> {
    try {
        const response = await fetch("http://localhost/api/whoami", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Inclou cookies per a l'autenticació si són necessàries
        });

        if (!response.ok) {
            throw new Error("No s'ha pogut obtenir la sessió de l'usuari.");
        }

        const data: SessionResponse = await response.json();

        if (!data.success || !data.user || !data.token) {
            console.error("Sessió no vàlida o incompleta:", data);
            return null;
        }

        return data;
    } catch (error) {
        console.error("Error obtenint la sessió de l'usuari:", error);
        return null; // Retorna null si no es pot obtenir la sessió
    }
}
