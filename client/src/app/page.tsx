"use client";
import React from "react"; // Import React to fix the UMD error
import Header from "./components/Header";
import ShowPost from "./components/ShowPost";

interface Post {
  _id: string;
  title: string;
  createdAt: string;
  summary: string;
  content: string;
  image?: string;
  username: string;
}

export default function Home() {
  return (
    <>
      <Header />
      <ShowPost />
    </>
  );
}
