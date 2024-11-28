"use client";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import setUserStore from "@/app/store/useStore";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//icons imports
import { FaEdit } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

interface BlogInfo {
  data: {
    _id: string;
    title: string;
    summary: string;
    content: string;
    image: string;
    username: string;
    user: {
      _id: string;
      username: string;
    };
    likes: String[];
    comments: {
      user: {
        _id: string;
        username: string;
        avatar: string;
      };
      content: string;
      timestamps: string;
    }[];
  };
}

const Page: React.FC = () => {
  const [blogInfo, setBlogInfo] = useState<BlogInfo>();
  const [comment, setComment] = useState("");

  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = setUserStore();
  const { id } = useParams();
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_BACKEND_API;

  useEffect(() => {
    const newSocket = io(`https://xzenblog-server.onrender.com`, {
      reconnection: true,
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchBlogInfo = async () => {
      try {
        const response = await fetch(`${API}/users/Post/${id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blogInfo = await response.json();
        console.log(blogInfo);

        setBlogInfo(blogInfo);
      } catch (error) {
        console.error("Failed to fetch blog info:", error);
      }
    };

    if (id) {
      fetchBlogInfo();
    }
  }, [id]);

  //listen for Real-Time Updates
  useEffect(() => {
    if (!socket) return;

    socket.on("comments", (data: { postId: string; comment: any }) => {
      if (data.postId === id) {
        setBlogInfo((prev) =>
          prev
            ? {
                ...prev,
                data: {
                  ...prev.data,
                  comments: [...prev.data.comments, data.comment],
                },
              }
            : prev
        );
      }
    });

    return () => {
      socket.off("comments");
    };
  }, [socket, id]);

  useEffect(() => {
    if (!socket) return;

    socket.on(
      "likeUpdated",
      (data: { postId: string; likes: string[]; action: string }) => {
        console.log("Received likeUpdated event:", data); // Debug the payload

        if (data.postId === id) {
          setBlogInfo((prev) =>
            prev
              ? {
                  ...prev,
                  data: {
                    ...prev.data,
                    likes: data.likes, // Update with the new likes array
                  },
                }
              : prev
          );
        }
      }
    );

    return () => {
      socket.off("likeUpdated");
    };
  }, [socket, id]);

  useEffect(() => {
    console.log("Updated blogInfo:", blogInfo?.data?.likes);
  }, [blogInfo]);

  const toggleLike = async () => {
    try {
      const response = await fetch(`${API}/users/blogs/${id}/like`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${user?._id}`,
        },
      });

      if (!response.ok) throw new Error("Failed to update like");

      const updatedLikes = await response.json(); // Ensure this returns an array
      setBlogInfo((prev) =>
        prev
          ? {
              ...prev,
              data: {
                ...prev.data,
                likes: updatedLikes.likes,
              },
            }
          : prev
      );
      toast.success("Like Updated");
    } catch (error) {
      console.error("Error updating like:", error);
      toast.error("Error updating like");
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) return;

    try {
      const response = await fetch(`${API}/users/blogs/${id}/comment`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?._id}`, // Ensure correct token usage
        },
        body: JSON.stringify({ content: comment }),
      });
      toast.success("Comment added successfully");
      if (response.ok) {
        setComment(""); // Clear the input after submission
      }
    } catch (error) {
      console.error("Failed to submit comment:", error);
      toast.error("Failed to submit comment:");
    }
  };

  function delete_Post() {
    try {
      fetch(`${API}/users/deletePost/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${user?._id}`,
        },
        body: JSON.stringify({
          userId: user?._id,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete post.");
          }
          return response.json();
        })

        .then((data) => {
          console.log(data);
          toast.success("Post deleted successfully ");
          router.push("/");
        });
    } catch (error) {
      console.error("Failed to delete blog info:", error);
      toast.error("Failed to delete blog ");
    }
  }

  return (
    <div className="flex-9">
      {blogInfo ? (
        <div className="p-5 pr-0">
          <img
            className="w-full h-72 rounded-lg object-cover"
            src={blogInfo.data.image}
            alt=""
          />

          <div className=" flex justify-center items-center text-lg w-full gap-2">
            <h1 className="text-center my-2 text-2xl font-serif">
              {blogInfo.data.title}{" "}
            </h1>
            {user?._id === blogInfo.data.user._id ? (
              <div className="flex  items-center">
                <Link
                  href={`/Edit/${blogInfo.data._id}`}
                  className=" text-teal-500 cursor-pointer"
                >
                  <FaEdit size={"20px"} />
                </Link>
                <i
                  className=" text-red-500 cursor-pointer ml-2"
                  onClick={delete_Post}
                >
                  <FaTrashAlt />
                </i>
              </div>
            ) : (
              ""
            )}
          </div>

          <p className="text-center font-serif text-lg hover:underline">
            {blogInfo.data.summary}
          </p>
          <div className="mb-5 flex justify-between text-lg text-yellow-600 font-sans">
            <span>
              Author:
              <b className="ml-1">
                <Link
                  className="text-yellow-700 font-serif text-lg hover:underline"
                  href="/posts?username"
                >
                  {blogInfo.data.user.username}
                </Link>
              </b>
            </span>
            <div className="flex items-center gap-2">
              <button onClick={toggleLike} className="flex items-center">
                <FaHeart
                  className={
                    user?._id && blogInfo?.data?.likes?.includes(user._id)
                      ? "text-red-500"
                      : "text-gray-400"
                  }
                />
              </button>
              <span>{blogInfo?.data?.likes?.length || 0} Likes</span>
            </div>
            {user?.createdAt && (
              <time
                className="font-lora italic text-sm font-normal text-[#999999] mt-3 mr-3"
                dateTime={user.createdAt}
              >
                {format(new Date(user.createdAt), "MMM d, yyyy HH:mm")}
              </time>
            )}
          </div>

          <p
            className="text-gray-600 text-lg leading-6"
            dangerouslySetInnerHTML={{ __html: blogInfo.data.content }}
          ></p>
          <div>
            <h3>Comments</h3>
            <ul>
              {blogInfo.data.comments.map((comment, index) => (
                <li key={index} className="my-2">
                  <div className="flex">
                    <img
                      className="w-8 h-8 rounded-full"
                      src={comment.user?.avatar}
                      alt="User Image"
                    />
                    <strong>{comment.user.username}</strong>:
                  </div>

                  <p>{comment.content}</p>
                  {comment.timestamps && (
                    <time
                      className="font-lora italic text-sm font-normal text-[#999999] mt-3 mr-3"
                      dateTime={comment.timestamps}
                    >
                      {format(
                        new Date(comment.timestamps),
                        "MMM d, yyyy HH:mm"
                      )}
                    </time>
                  )}
                </li>
              ))}
            </ul>
            {/* Comment Form */}
            <form onSubmit={submitComment} className="mt-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-2 border rounded"
              ></textarea>
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 mt-2 rounded"
              >
                Post Comment
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h1>Loading...</h1>
          <p className="text-yellow-500">Please wait</p>
        </div>
      )}
    </div>
  );
};

export default Page;
