"use client";
import React from "react"; // Import React to fix the UMD error
import Link from "next/link";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import Header from "./components/Header";
import BlogPost from "./components/BlogPost";
import TestComponent from "./components/TestComponent";
import BlogList from "./components/TestComponent";

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
  // const [posts, setPosts] = useState<Post[]>([]); // Typed the state properly

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       const response = await fetch(
  //         "http://localhost:8000/api/v1/users/Post",
  //         {
  //           method: "GET",
  //           credentials: "include",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       if (!response.ok) {
  //         throw new Error(`Failed to fetch posts: ${response.statusText}`);
  //       }

  //       const data: Post[] = await response.json();
  //       console.log(data);
  //       setPosts(data);
  //     } catch (error) {
  //       console.error("Error fetching posts:", error);
  //     }
  //   };

  //   fetchPosts();
  // }, []);

  return (
    <>
      <Header />
      <h1 className=" text-4xl font-bold text-center bg-black text-white ">
        This is coming from the main page
      </h1>
      <BlogPost />
      <TestComponent />
      <BlogList />
      {/* {posts.length > 0 &&
        posts.map((post) => (
          <div
            className="grid grid-cols-grid-template-columnsMain gap-2 p-2 mb-10"
            key={post._id}
          >
            <Link href={`/post/${post._id}`} className="w-full">
              {post.image && (
                <img src={post.image} className="max-w-full" alt="Post image" />
              )}
            </Link>

            <div>
              <Link href={`/post/${post._id}`} className="text-4xl font-bold">
                {post.title}
              </Link>
              <div className="flex flex-col my-3">
                <div className="flex items-center">
                  <img
                    src="https://avatars.githubusercontent.com/u/119447310?s=400&u=58b6fd34401479669939e783be720049dc817d53&v=4"
                    alt="User avatar"
                    className="h-9 w-9"
                  />
                  <Link href={"/"} className="text-xl">
                    {post.username}
                  </Link>
                </div>
                <time dateTime={post.createdAt}>
                  {format(new Date(post.createdAt), "MMM d, yyyy HH:mm")}
                </time>
              </div>
              <p>{post.summary}</p>
              <p dangerouslySetInnerHTML={{ __html: post.content }}></p>
            </div>
          </div>
        ))} */}
    </>
  );
}
