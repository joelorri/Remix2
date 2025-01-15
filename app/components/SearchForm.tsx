import React, { useState } from "react";
import { SearchFormProps } from "~/utils/Interfaces";

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Escriu el nom de la cançó o artista..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-2 text-white rounded-md ${isLoading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"}`}
        >
          {isLoading ? "Cercant..." : "Cercar"}
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
