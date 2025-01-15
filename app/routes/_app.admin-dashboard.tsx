import { useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";

import EditUserModal from "~/components/EditUserModal";
import { loader } from '../server/admin.server';
import { deleteUser, updateUser} from "~/utils/adminUsers.utils";
import { User } from "~/utils/Interfaces";

export { loader };

export default function AdminUsersPage() {
  const { users, token } = useLoaderData<{ users: User[]; token: string }>();
  const [userList, setUserList] = useState(users);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const handleDelete = async (userId: number) => {
    if (!confirm("Estàs segur que vols eliminar aquest usuari?")) return;

    try {
      await deleteUser(userId, token);
      alert("Usuari eliminat correctament.");
      setUserList((prev) => prev.filter((user) => user.id !== userId));
    } catch {
      alert("Error eliminant l'usuari.");
    }
  };

  const handleEdit = async (updatedUser: User) => {
    try {
      const updated = await updateUser(updatedUser, token);
      alert("Usuari actualitzat correctament.");
      setUserList((prev) =>
        prev.map((user) => (user.id === updated.id ? updated : user))
      );
      setSelectedUser(null); // Close the edit form
    } catch {
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
