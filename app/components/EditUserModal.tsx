import { useState } from "react";
import { EditUserModalProps } from "~/utils/Interfaces";



export default function EditUserModal({
  user,
  onClose,
  onSave,
}: EditUserModalProps) {
  const [formData, setFormData] = useState(user);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert("Nom i email són obligatoris.");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-xl font-bold mb-4">Editar Usuari</h1>
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
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium">
              Rol
            </label>
            <select
              id="role"
              name="super"
              value={formData.super}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="user">Usuari</option>
              <option value="admin">Administrador</option>
            </select>
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
              Desar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
