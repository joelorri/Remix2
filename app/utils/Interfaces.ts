export interface SongRequest {
    id: number;
    song_details: string;
    comments: string | null;
    status: "pending" | "accepted" | "rejected" | "played";
    user: {
      name: string;
      email: string;
    };
  }
  
  export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    super: string;
    image: string;
  }
  