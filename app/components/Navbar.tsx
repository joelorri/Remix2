import { Link } from "@remix-run/react";
import { useState } from "react";

export default function Navbar() {
  const [error] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
 
  return (
    <nav className="bg-gray-900 text-white py-4 shadow-lg">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo i toggle del menú */}
        <div className="flex items-center justify-between w-full">
          <Link to="/home" className="text-2xl font-bold hover:text-gray-300">
          <div className="text-2xl font-bold">
            <img
              src="/app/storage/track1.png"
              alt="App Logo"
              className="w-20 h-auto"
            />
          </div>
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-white hover:text-gray-300 focus:outline-none"
            aria-label="Toggle Menu"
          >
            ☰
          </button>
        </div>

        {/* Menú navegació */}
        <ul
          className={`${
            menuOpen ? "block" : "hidden"
          } lg:flex lg:space-x-6 items-center text-center lg:ml-auto w-full lg:w-auto bg-gray-900 lg:bg-transparent`}
        >

          <li>
            <Link
              to="/requests"
              className="block py-2 lg:py-0 hover:text-gray-300"
            >
              Cançons Demanades
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className="block py-2 lg:py-0 hover:text-gray-300"
            >
              Perfil
            </Link>
          </li>
          <li>
            <Link
              to="/playlist"
              className="block py-2 lg:py-0 hover:text-gray-300"
            >
              Playlist
            </Link>
            
          </li>
          <li>
            <Link
              to="/ratings"
              className="block py-2 lg:py-0 hover:text-gray-300"
            >
              ratings
            </Link>
            
          </li>
          
        </ul>
      </div>
      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
    </nav>
  );
}
