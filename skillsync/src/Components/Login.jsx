import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useUser from "./hooks/useUser";

const Login = () => {
  const { login, isLoggedIn } = useUser();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData,navigate)
  };
  const redirectTo = location.state?.from || "/";
  if (isLoggedIn && isLoggedIn()) navigate(redirectTo);
  else 
  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 mt-10">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Welcome Back!
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-secondary text-white py-2 rounded-lg hover:bg-secondary-dark transition"
            >
              Login
            </button>
          </div>
        </form>

        {statusMessage && (
          <p className="mt-4 text-center text-sm text-red-500">
            {statusMessage}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-secondary hover:underline font-medium"
          >
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
