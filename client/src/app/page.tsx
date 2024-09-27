"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface Post {
  _id: string;
  title: string;
  createdAt: string;
  summary: string;
  content: string;
}
export default function Home() {
  const [post, setPost] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8000/api/v1/users/Post", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      response.json().then((data: Post[]) => {
        console.log(data);
        setPost(data);
      });
    });
  }, []);
  const router = useRouter();

  return (
    <>
      {post.length > 0 &&
        post.map((post) => (
          <div
            className="grid grid-cols-grid-template-columnsMain gap-2 p-2 mb-10  "
            key={post._id}
          >
            <Link href={`/post/${post._id}`} className="w-full">
              <img
                src="https://images.unsplash.com/photo-1723737347273-5ae32dcdb5d3?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Test Img"
                className="max-w-full"
              />
            </Link>

            <div>
              <h1 className="text-4xl font-bold">{post.title}</h1>
              <div className="flex flex-col my-3">
                <div className="flex items-center">
                  <img
                    src="https://avatars.githubusercontent.com/u/119447310?s=400&u=58b6fd34401479669939e783be720049dc817d53&v=4"
                    alt="img"
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
              <p>{post.content}</p>
            </div>
          </div>
        ))}
    </>
  );
}
