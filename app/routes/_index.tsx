import { Link, Form } from "@remix-run/react";

export default function Thunder() {
  return (
    <html lang="en">
      <head>
        <link
          rel="shortcut icon"
          href="/storage/Rayo.png"
          type="image/x-icon"
        />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Thunder</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-gradient-to-l from-blue-900 via-purple-800 to-yellow-700 text-white min-h-screen flex flex-col">
        {/* Navbar */}
        <nav className="flex justify-between items-center py-4 px-8 bg-opacity-70 backdrop-blur-lg">
          <div className="text-2xl font-bold">
            <img
              src="/app/storage/track1.png"
              alt="App Logo"
              className="w-20 h-auto"
            />
          </div>
          <div className="flex space-x-4">
            <Link
              to="/login"
              className="bg-white text-purple-700 px-4 py-2 rounded-lg font-bold"
            >
              Inicia sessió
            </Link>
            <Link
              to="/register"
              className="bg-white text-purple-700 px-4 py-2 rounded-lg font-bold"
            >
              Registra&apos;t
            </Link>
          </div>
        </nav>

        {/* Main Section */}
        <main className="flex-grow flex items-center justify-center">
          <section className="flex flex-col md:flex-row px-4 md:px-16 py-16 w-full max-w-6xl">
            {/* Hero Text */}
            <div className="md:w-1/2 space-y-6 text-center md:text-left order-1 md:order-none mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white">
                <span className="block text-2xl md:text-3xl">
                  Request the Beat
                </span>
                <span className="text-4xl md:text-5xl">Feel the Thunder</span>
              </h1>
              <p className="text-gray-200">
                Amb Thunder, pots gaudir d&apos;una experiència única <br />
                Fes el primer pas i uneix-te avui mateix.
              </p>
            </div>

            {/* Form Section */}
            <div className="md:w-1/2 space-y-6 order-2 md:order-none">
              <Form method="post" action="/register" className="space-y-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block font-medium text-sm text-white"
                  >
                    Nom
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    className="bg-white w-full px-4 py-3 text-gray-900 rounded-lg shadow-md"
                    required
                    autoComplete="name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block font-medium text-sm text-white"
                  >
                    Correu electrònic
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    className="bg-white w-full px-4 py-3 text-gray-900 rounded-lg shadow-md"
                    required
                    autoComplete="email"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block font-medium text-sm text-white"
                  >
                    Contrasenya
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    className="bg-white w-full px-4 py-3 text-gray-900 rounded-lg shadow-md"
                    required
                    autoComplete="new-password"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="password_confirmation"
                    className="block font-medium text-sm text-white"
                  >
                    Confirma la contrasenya
                  </label>
                  <input
                    id="password_confirmation"
                    type="password"
                    name="password_confirmation"
                    className="bg-white w-full px-4 py-3 text-gray-900 rounded-lg shadow-md"
                    required
                    autoComplete="new-password"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-white text-purple-700 px-6 py-3 rounded-lg font-bold shadow-md hover:bg-purple-700 hover:text-white transition duration-300"
                >
                  Crea el teu compte
                </button>
              </Form>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
