"use client";
import Link from "next/link";
import React, { useState } from "react";

const RegisterPage: React.FC = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState<FileList | null>();

  const submitPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const API = process.env.NEXT_PUBLIC_BACKEND_API;
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      if (avatar) {
        formData.append("avatar", avatar[0]);
      }
      const response = await fetch(`${API}users/register`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
    } catch (error) {
      console.error(error);
    }
  };

  // async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  //   event.preventDefault();
  //   try {
  //     await fetch("http://localhost:8000/api/v1/users/register", {
  //       method: "POST",
  //       body: JSON.stringify({ username, email, password }),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         console.log("Success:", data);
  //       });
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // }
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-gray-400">
  //       <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full border-2 border-gray-300">
  //         <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
  //         <form onSubmit={submitPost}>
  //           <div className="mb-4">
  //             <label
  //               className="block text-gray-700 font-bold mb-2"
  //               htmlFor="username"
  //             >
  //               username
  //             </label>
  //             <input
  //               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
  //               id="username"
  //               type="text"
  //               placeholder="Enter your name"
  //               value={username}
  //               onChange={(e) => setUserName(e.target.value)}
  //             />
  //           </div>
  //           <div className="mb-4">
  //             <label
  //               className="block text-gray-700 font-bold mb-2"
  //               htmlFor="email"
  //             >
  //               Email
  //             </label>
  //             <input
  //               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
  //               id="email"
  //               type="email"
  //               placeholder="Enter your email"
  //               value={email}
  //               onChange={(e) => setEmail(e.target.value)}
  //             />
  //           </div>
  //           <div className="mb-6">
  //             <label
  //               className="block text-gray-700 font-bold mb-2"
  //               htmlFor="password"
  //             >
  //               Password
  //             </label>
  //             <input
  //               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
  //               id="password"
  //               type="password"
  //               placeholder="Enter your password"
  //               value={password}
  //               onChange={(e) => setPassword(e.target.value)}
  //             />
  //           </div>
  //           <div className="mb-6">
  //             <label />
  //           </div>
  //           <div className="flex items-center justify-between">
  //             <button
  //               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
  //               type="submit"
  //             >
  //               Register
  //             </button>
  //             <Link href="/Login">
  //               <button
  //                 className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
  //                 type="button"
  //               >
  //                 Login
  //               </button>
  //             </Link>
  //           </div>
  //         </form>
  //       </div>
  //     </div>
  //   );
  // };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-400">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full border-2 border-gray-300">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        <form onSubmit={submitPost} encType="multipart/form-data">
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

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
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="avatar"
            >
              Avatar
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="avatar"
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files)}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Register
            </button>
            <Link href="/Login">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
              >
                Login
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default RegisterPage;
