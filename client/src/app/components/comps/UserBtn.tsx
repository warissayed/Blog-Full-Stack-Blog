"use client";
import React, { useEffect, useState } from "react";
import { Modal, ModalTrigger } from "../ui/animated-modal";
import setUserStore from "@/app/store/useStore";
interface User {
  _id: string;
  avatar: string;
  username: string;
  email: string;
}
export function UserBtn() {
  const [userProfile, setUserProfile] = useState<User>();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/v1/users/profile",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch user: ${response.statusText}`);
        }
        const Data = await response.json();
        const profileData = Data.data;
        setUserProfile(profileData);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);
  return (
    <div className=" flex items-center justify-center">
      <Modal>
        <ModalTrigger className="bg-black dark:bg-white dark:text-black text-white flex justify-center group/modal-btn">
          <span className="group-hover/modal-btn:translate-x-40 flex items-center justify-center transition absolute duration-500">
            <img
              src={userProfile?.avatar}
              alt="userName"
              className=" h-7 w-7 rounded-xl"
            />
          </span>
          <span className="-translate-x-40 group-hover/modal-btn:translate-x-0 text-center inset-0 transition duration-500 text-black z-20 ">
            {userProfile?.username}
          </span>
        </ModalTrigger>
      </Modal>
    </div>
  );
}
