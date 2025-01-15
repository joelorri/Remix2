import { SessionResponse } from "./utils/Interfaces";

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

export async function updateProfile(token: string, name: string, email: string) {
    const response = await fetch("http://localhost/api/profile/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors || "Error updating profile.");
    }
  
    return response.json();
  }

  

