import Link from "next/link";
import { useState, useEffect } from "react";
import { format } from "date-fns";

export default function TestComponent() {
  interface Post {
    _id: string;
    title: string;
    createdAt: string;
    summary: string;
    content: string;
    image?: string;
    username: string;
  }

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/v1/users/Post",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.statusText}`);
        }

        const data: Post[] = await response.json();
        console.log(data);
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <div className="flex flex-wrap justify-center items-center">
        {posts.length > 0 &&
          posts.map((post) => (
            <div
              className="w-[385px] m-[0px_25px_40px_25px] flex flex-col mt-4"
              key={post._id}
            >
              <Link href={`/post/${post._id}`} className="w-full">
                {post.image && (
                  <img
                    className="w-[385px] h-[280px] object-cover rounded-md"
                    src={post.image}
                    alt=""
                  />
                )}
              </Link>

              <div className="flex flex-col items-center mt-4">
                <div className="flex">
                  <span className="font-varela text-xs font-normal text-[#be9656] leading-[19px] mt-3 mr-3 cursor-pointer">
                    <Link href="/posts?cat=Music">
                      <p className="no-underline">Music</p>
                    </Link>
                  </span>
                  <span className="font-varela text-xs font-normal text-[#be9656] leading-[19px] mt-3 cursor-pointer">
                    <Link href="/posts?cat=Life">
                      <p className="no-underline">Life</p>
                    </Link>
                  </span>
                </div>
                <span className="font-josefin text-2xl font-bold mt-3 cursor-pointer">
                  <Link href={`/post/${post._id}`}>
                    <p className="no-underline">{post.title}</p>
                  </Link>
                </span>
                <hr className="w-full mt-3" />
                <div className="flex w-full justify-around">
                  <time
                    className="font-lora italic text-sm font-normal text-[#999999] mt-3 mr-3"
                    dateTime={post.createdAt}
                  >
                    {format(new Date(post.createdAt), "MMM d, yyyy HH:mm")}
                  </time>
                  <div className="flex items-center gap-1">
                    <img
                      src="https://avatars.githubusercontent.com/u/119447310?s=400&u=58b6fd34401479669939e783be720049dc817d53&v=4"
                      alt="User avatar"
                      className="h-6 w-6 rounded-xl"
                    />
                    <span className="font-lora italic text-sm font-normal text-[#999999]">
                      {post.username}
                    </span>
                  </div>
                </div>
              </div>
              <p className="font-varela text-sm font-normal leading-[24px] text-[#444444] mt-3 overflow-hidden text-ellipsis line-clamp-4">
                {post.summary}
              </p>
            </div>
          ))}
      </div>
    </>
  );
}
