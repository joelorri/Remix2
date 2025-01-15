import { ReactNode } from "react";

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

export interface PasswordResetData {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
}

export interface TrackListProps {
  tracks: Track[];
  selectedTracks: { [id: string]: string };
  comments: { [id: string]: string };
  onSelectTrack: (trackId: string) => void;
  onCommentChange: (trackId: string, comment: string) => void;
}

export interface SearchFormProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export interface DjInfoProps {
  dj: {
    id: string;
    name: string;
    email: string;
  };
}

export interface DjProfile {
  id: string;
  name: string;
  email: string;
}

export interface Rating {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
}

export type AuthContainerProps = {
  children: ReactNode;
};

export type LoginFormProps = {
  error?: string;
};
export type EditUserModalProps = {
  user: User;
  onClose: () => void;
  onSave: (user: User) => void;
};

export type Song = {
  id: string;
  title: string;
  artist: string;
};

export type SearchResultsProps = {
  results: Song[];
  onAdd: (song: Song) => void;
};

export type SongListProps = {
  songs: Song[];
  onRemove: (index: number) => void;
};


export type Playlist = {
  id: number;
  name: string;
  description: string;
  songs: { id: number; title: string; artist: string }[];
  created_at: string;
  updated_at: string;
};



export type SessionResponse = {
  success: boolean;
  user?: User;
  token?: string;
};
