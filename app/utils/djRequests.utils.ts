export type SongRequest = {
    id: number;
    song_details: string;
    comments: string | null;
    status: "pending" | "accepted" | "rejected" | "played";
    user: {
      name: string;
      email: string;
    };
  };
  
  // Update request status
  export const updateRequestStatus = async (
    token: string,
    requestId: number,
    action: string
  ): Promise<void> => {
    const response = await fetch(`http://localhost/api/dj/requests/${requestId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al canviar l'estat.");
    }
  };
  