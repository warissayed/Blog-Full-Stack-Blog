"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import setUserStore from "../store/useStore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for toggling
  const router = useRouter();

  const { setUser } = setUserStore();

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const API = process.env.NEXT_PUBLIC_BACKEND_API;
    try {
      const response = await fetch(`${API}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (response.status === 200) {
        await response.json().then((userData) => {
          const ProfileData = userData.data;
          console.log(ProfileData);
          setUser(ProfileData);
          toast.success("Login successful!");
          router.push("/");
        });
      } else {
        const errorData = await response.json();
        toast.warning(`Error: ${errorData.message || "Something went wrong"}`);
        setErrorMessage(errorData.message || "Invalid credentials");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-400">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full border-2 border-gray-300">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <form onSubmit={login}>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6 relative">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type={showPassword ? "text" : "password"} // Toggle between text and password
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              className="absolute right-2 top-8 text-gray-500 focus:outline-none"
              onMouseDown={() => setShowPassword(true)} // Show password on hold
              onMouseUp={() => setShowPassword(false)} // Hide password on release
              onMouseLeave={() => setShowPassword(false)} // Handle case where mouse leaves button
            >
              {showPassword ? "🙈" : "👁️"} {/* Change icon based on state */}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
            <Link
              href="/Register"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
