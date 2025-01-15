import { SearchResultsProps } from "~/utils/Interfaces";

export default function SearchResults({ results, onAdd }: SearchResultsProps) {
  return (
    <ul className="space-y-4">
      {results.map((result) => (
        <li
          key={result.id}
          className="bg-gray-100 p-4 rounded-md shadow-sm flex items-center justify-between"
        >
          <div>
            <h4 className="font-semibold">{result.title}</h4>
            <p className="text-sm text-gray-600">{result.artist}</p>
          </div>
          <button
            type="button"
            onClick={() => onAdd(result)}
            className="ml-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Afegir
          </button>
        </li>
      ))}
    </ul>
  );
}
