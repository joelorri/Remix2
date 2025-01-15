import { Link, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { registerUser } from "~/server/auth.server";


export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      await registerUser(formData);
      setSuccessMessage("Registration complete! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="w-full max-w-md p-6 bg-gray-800 shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-100">
          Register
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="name"
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <InputField
            id="email"
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <InputField
            id="password_confirmation"
            label="Confirm Password"
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
          />

          <button
            type="submit"
            className={`w-full py-2 text-white rounded ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={loading}
          >
            {loading ? "Processing..." : "Register"}
          </button>
        </form>
        <div className="text-center mt-4">
          <Link to="/login" className="text-blue-400 hover:underline">
            Already have an account? Log in
          </Link>
        </div>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        {successMessage && <p className="text-green-500 text-center mt-4">{successMessage}</p>}
      </div>
    </div>
  );
}

function InputField({
  id,
  label,
  type,
  name,
  value,
  onChange,
}: {
  id: string;
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 mt-1 border border-gray-600 rounded bg-gray-700 text-gray-100 focus:ring-blue-500 focus:border-blue-500"
        required
      />
    </div>
  );
}
