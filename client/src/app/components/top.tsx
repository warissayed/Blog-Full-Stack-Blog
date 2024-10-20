"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useState } from "react";
import { FcAddressBook } from "react-icons/fc";
import { LoginBtn } from "./comps/LoginBtn";
import { FaBars, FaTimes } from "react-icons/fa"; // For the hamburger menu icons
import setUserStore from "../store/useStore";

export default function TopBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser, logoutUser } = setUserStore();

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/users/profile", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((userData) => {
        console.log(userData);
        setUser(userData);
      });
  }, []);

  function logout() {
    fetch("http://localhost:8000/api/v1/users/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        logoutUser();
      });
  }

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="w-full h-[50px] bg-white sticky top-0 z-[999] font-josefin shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center h-full">
        {/* Left Section (Social Icons) */}
        <div className="flex items-center">
          <i className="mr-4 cursor-pointer">
            <LoginBtn />
          </i>
        </div>

        {/* Center Section (Links) */}
        <div className="hidden md:flex">
          <ul className="flex space-x-6">
            <li className="text-[18px] font-light cursor-pointer hover:text-gray-500">
              <Link href="/">HOME</Link>
            </li>
            <li className="text-[18px] font-light cursor-pointer hover:text-gray-500">
              ABOUT
            </li>
            <li className="text-[18px] font-light cursor-pointer hover:text-gray-500">
              CONTACT
            </li>
            <li className="text-[18px] font-light cursor-pointer hover:text-gray-500">
              <Link href="https://github.com/warissayed" target="_blank">
                GITHUB
              </Link>
            </li>
            {user && (
              <ul className="flex space-x-6">
                <li className="text-[18px] font-light cursor-pointer hover:text-gray-500">
                  <Link href="/CreateBlog">WRITE</Link>
                </li>
                <li className="text-[18px] font-light cursor-pointer hover:text-gray-500">
                  <Link
                    href="/"
                    className="text-[18px] font-light cursor-pointer hover:text-gray-500"
                    onClick={logout}
                  >
                    LOGOUT
                  </Link>
                </li>
              </ul>
            )}
          </ul>
        </div>

        {/* Right Section (User or Login/Register) */}
        <div className="hidden md:flex items-center">
          {user ? (
            <Link className="flex items-center space-x-2" href="/settings">
              <img
                className="w-10 h-10 rounded-full object-cover cursor-pointer"
                src={user.data.avatar}
                alt="profile"
              />
              <p>{user.data.username}</p>
            </Link>
          ) : (
            <ul className="flex space-x-6">
              <li className="text-[18px] font-light cursor-pointer hover:text-gray-500">
                <Link href="/Login">LOGIN</Link>
              </li>
              <li className="text-[18px] font-light cursor-pointer hover:text-gray-500">
                <Link href="/Register">REGISTER</Link>
              </li>
            </ul>
          )}
        </div>

        {/* Hamburger Icon for Mobile */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="focus:outline-none">
            {isOpen ? (
              <FaTimes className="text-2xl" />
            ) : (
              <FaBars className="text-2xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <ul className="flex flex-col items-center space-y-6 p-6">
            <li className="text-[18px] font-light cursor-pointer hover:text-gray-500">
              <Link href="/">HOME</Link>
            </li>
            <li className="text-[18px] font-light cursor-pointer hover:text-gray-500">
              ABOUT
            </li>
            <li className="text-[18px] font-light cursor-pointer hover:text-gray-500">
              CONTACT
            </li>

            {user && (
              <ul className="flex flex-col items-center space-y-6 p-6">
                <li className="text-[18px] font-light cursor-pointer hover:text-gray-500">
                  <Link href="/CreateBlog">WRITE</Link>
                </li>
                <Link
                  href="/"
                  className="text-[18px] font-light cursor-pointer hover:text-gray-500"
                  onClick={logout}
                >
                  LOGOUT
                </Link>
              </ul>
            )}
            {!user && (
              <>
                <li className="text-[18px] font-light cursor-pointer hover:text-gray-500">
                  <Link href="/Login">LOGIN</Link>
                </li>
                <li className="text-[18px] font-light cursor-pointer hover:text-gray-500">
                  <Link href="/Register">REGISTER</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
