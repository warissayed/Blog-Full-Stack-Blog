"use client";
import React from "react";
import setUserStore from "../store/useStore";
import { format } from "date-fns";

const page: React.FC = () => {
  const { user } = setUserStore();

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full text-center">
        <img
          src={user?.avatar}
          alt={`${user?.username}'s profile`}
          className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-gray-200"
        />
        <h2 className="text-xl font-semibold text-center">{user?.username}</h2>
        <p className="text-gray-600 text-center">{user?.email}</p>
        {/* <p className="text-gray-500 text-center mt-2">
          Account created on: {user?.createdAt}
        </p> */}
        {user?.createdAt && (
          <time
            className="font-lora italic text-sm font-normal text-[#999999] mt-3 mr-3"
            dateTime={user.createdAt}
          >
            {format(new Date(user.createdAt), "MMM d, yyyy HH:mm")}
          </time>
        )}
      </div>
    </div>
  );
};

export default page;
