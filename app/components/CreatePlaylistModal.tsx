import React, { useState } from "react";
import { Playlist } from "~/editPlaylist.server";


export default function CreatePlaylistModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (playlist: Playlist) => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    songs: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreate({
      ...formData,
      id: Date.now(), // Temporary ID
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Crear Nova Playlist</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium">
              Nom
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium">
              Descripció
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
            >
              Cancel·lar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
