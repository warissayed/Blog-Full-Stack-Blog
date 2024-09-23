"use client";
import setUserStore from "../store/useStore";

const Test = () => {
  const { user } = setUserStore(); // Get user from Zustand

  return (
    <div>
      <h1 className="text-center text-xl ">
        {user ? `Welcome, ${user}` : "Please log in"}
      </h1>
    </div>
  );
};

export default Test;
