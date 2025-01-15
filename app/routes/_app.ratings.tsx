import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { useState } from "react";
import { getSessionData } from "~/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const { user, token } = await getSessionData(request);

  if (!user || !token) {
    throw redirect("/login");
  }

  const ratingsResponse = await fetch("http://localhost/api/dj-ratingsByUser", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!ratingsResponse.ok) {
    throw new Error("Failed to fetch data.");
  }

  const ratingsData = await ratingsResponse.json();

  return json({
    ratings: ratingsData.ratings,
    token,
  });
};

export default function UserRatingsPage() {
  const { ratings, token } = useLoaderData<{
    ratings: Rating[];
    token: string;
  }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    dj_id: "",
    rating: "",
    comment: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedDj, setSelectedDj] = useState<DjProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleOpenModal = () => {
    setFormData({ dj_id: "", rating: "", comment: "" });
    setSearchQuery("");
    setResults([]);
    setSelectedDj(null);
    setError(null);
    setSuccess(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost/api/profile/searchs?query=${encodeURIComponent(
          searchQuery
        )}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error(`Error durant la cerca: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.data || []);
      setHasSearched(true);
      setError(null);
    } catch (err) {
      console.error("Error en fer la cerca:", err);
      setError("Error en fer la cerca. Torna-ho a intentar més tard.");
    }
  };



  const handleSelectDj = (dj: DjProfile) => {
    setSelectedDj(dj);
    setFormData((prev) => ({ ...prev, dj_id: dj.id }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.dj_id || !formData.rating || !formData.comment) {
      setError("Tots els camps són obligatoris.");
      return;
    }

    try {
      const response = await fetch("http://localhost/api/dj-ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "No s'ha pogut crear la valoració.");
      }

      setSuccess(true);
      setTimeout(() => window.location.reload(), 2000); // Refresca la pàgina després de 2 segons
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Hi ha hagut un error desconegut."
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-4">Les Teves Valoracions</h1>

      {ratings.length > 0 ? (
        ratings.map(
          (rating: {
            id: string;
            rating: number;
            comment: string;
            created_at: string;
          }) => (
            <div key={rating.id} className="mb-4 p-4 border rounded">
              <p>
                <strong>Rating:</strong> {rating.rating}
              </p>
              <p>
                <strong>Comentari:</strong> {rating.comment}
              </p>
              <p className="text-gray-500 text-sm">
                Publicat: {new Date(rating.created_at).toLocaleString()}
              </p>
            </div>
          )
        )
      ) : (
        <p>No has fet cap valoració encara.</p>
      )}

      <button
        onClick={handleOpenModal}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Afegeix una Valoració
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Nova Valoració</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && (
              <p className="text-green-500 mb-4">
                Valoració creada correctament!
              </p>
            )}

            {!selectedDj ? (
              <div>
                <input
                  type="text"
                  placeholder="Cerca DJs pel seu nom o correu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border rounded mb-4"
                />
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Cerca
                </button>
                <div className="p-6 mt-4">
                  {hasSearched && results.length > 0 ? (
                    <ul className="space-y-4">
                      {results.map(
                        (profile: {
                          id: string;
                          name: string;
                          email: string;
                        }) => (
                          <button
                            key={profile.id}
                            onClick={() => handleSelectDj(profile)}
                            className="w-full text-left cursor-pointer bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md hover:bg-gray-200 dark:hover:bg-gray-600"
                          >
                            <p>
                              <strong>Nom:</strong> {profile.name}
                            </p>
                            <p>
                              <strong>Email:</strong> {profile.email}
                            </p>
                          </button>
                        )
                      )}
                    </ul>
                  ) : (
                    hasSearched && (
                      <p className="text-gray-500">
                        No s&#39;han trobat resultats.
                      </p>
                    )
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p className="mb-4">
                  <strong>DJ seleccionat:</strong> {selectedDj.name}
                </p>
                <div className="mb-4">
                  <label htmlFor="rating" className="block text-sm font-medium">
                    Valoració (1-5)
                  </label>
                  <input
                    type="number"
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    min="1"
                    max="5"
                    required
                    className="w-full px-4 py-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="comment"
                    className="block text-sm font-medium"
                  >
                    Comentari
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border rounded"
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel·lar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
