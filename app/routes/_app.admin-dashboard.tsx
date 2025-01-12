import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { requireAdmin } from "~/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const { user, token } = await requireAdmin(request);

  const response = await fetch("http://localhost/api/admin/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("No s'han pogut carregar els usuaris.");
  }

  const users = await response.json();
  return json({ user, token, users: users.data });
};

type User = {
  id: number;
  name: string;
  email: string;
  super: string;
};

export default function AdminUsersPage() {
  const { users, token } = useLoaderData<{ users: User[]; token: string }>();
  const [userList, setUserList] = useState(users);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const handleDelete = async (userId: number) => {
    if (!confirm("Estàs segur que vols eliminar aquest usuari?")) return;

    try {
      const response = await fetch(`http://localhost/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("No s'ha pogut eliminar l'usuari.");
      }

      alert("Usuari eliminat correctament.");
      setUserList((prev) => prev.filter((user) => user.id !== userId));
    } catch (error) {
      alert("Error eliminant l'usuari.");
    }
  };

  const handleEdit = async (updatedUser: User) => {
    try {
      const response = await fetch(`http://localhost/api/admin/users/${updatedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error("Failed to update user.");
      }

      alert("Usuari actualitzat correctament.");
      setUserList((prev) =>
        prev.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
      setSelectedUser(null); // Close the edit form
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Error actualitzant l'usuari.");
    }
  };

  const handleCreate = () => {
    navigate(`/admin-create`);
  };

  return (
    <div className="py-12 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestió d&apos;Usuaris</h1>
      <button
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md"
        onClick={handleCreate}
      >
        Crear Usuari
      </button>
      <ul className="space-y-4">
        {userList.map((user) => (
          <li key={user.id} className="bg-gray-600 p-4 rounded-lg shadow-md">
            <p>
              <strong>Nom:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Rol:</strong> {user.super}
            </p>
            <div className="flex space-x-4 mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={() => setSelectedUser(user)}
              >
                Editar
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                onClick={() => handleDelete(user.id)}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>

      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={handleEdit}
        />
      )}
    </div>
  );
}

type EditUserModalProps = {
  user: User;
  onClose: () => void;
  onSave: (user: User) => void;
};

function EditUserModal({ user, onClose, onSave }: EditUserModalProps) {
  const [formData, setFormData] = useState(user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-xl font-bold mb-4">Editar Usuari</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium">Nom</label>
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
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
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
            <label htmlFor="role" className="block text-sm font-medium">Rol</label>
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
