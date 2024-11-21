"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import setUserStore from "@/app/store/useStore";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { FaHeart } from "react-icons/fa"; // Icon for like button

interface BlogInfo {
  data: {
    _id: string;
    title: string;
    summary: string;
    content: string;
    image: string;
    user: {
      _id: string;
      username: string;
    };
    likes: string[];
    comments: {
      user: {
        _id: string;
        username: string;
      };
      content: string;
      timestamp: string;
    }[];
  };
}

const Page: React.FC = () => {
  const [blogInfo, setBlogInfo] = useState<BlogInfo>();
  const [comment, setComment] = useState("");
  const { user } = setUserStore();
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchBlogInfo = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/users/Post/${id}`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const blogData = await response.json();
        setBlogInfo(blogData);
      } catch (error) {
        console.error("Failed to fetch blog info:", error);
      }
    };

    if (id) fetchBlogInfo();
  }, [id]);

  // Like/unlike functionality
  const toggleLike = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/blogs/${id}/like`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?._id}`,
          },
        }
      );
      if (response.ok) {
        const updatedBlog = await response.json();
        setBlogInfo(
          (prev) =>
            prev && {
              ...prev,
              data: { ...prev.data, likes: updatedBlog.likesCount },
            }
        );
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  // Comment submission functionality
  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/blogs/${id}/comments`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?._id}`,
          },
          body: JSON.stringify({ content: comment }),
        }
      );
      if (response.ok) {
        const updatedBlog = await response.json();
        setBlogInfo(
          (prev) =>
            prev && {
              ...prev,
              data: { ...prev.data, comments: updatedBlog.comments },
            }
        );
        setComment(""); // Reset comment input after submission
      }
    } catch (error) {
      console.error("Failed to submit comment:", error);
    }
  };

  return (
    <div className="flex-9">
      {blogInfo ? (
        <div className="p-5 pr-0">
          <img
            className="w-full h-72 rounded-lg object-cover"
            src={blogInfo.data.image}
            alt=""
          />
          <div className="flex justify-center items-center text-lg w-full gap-2">
            <h1 className="text-center my-2 text-2xl font-serif">
              {blogInfo.data.title}
            </h1>
            {user?._id === blogInfo.data.user._id && (
              <div className="flex items-center">
                <Link
                  href={`/Edit/${blogInfo.data._id}`}
                  className="text-teal-500 cursor-pointer"
                >
                  <FaEdit size={"20px"} />
                </Link>
                <i
                  className="text-red-500 cursor-pointer ml-2"
                  onClick={() => delete_Post()}
                >
                  <FaTrashAlt />
                </i>
              </div>
            )}
          </div>
          <p className="text-center font-serif text-lg hover:underline">
            {blogInfo.data.summary}
          </p>
          <div className="mb-5 flex justify-between text-lg text-yellow-600 font-sans">
            <span>
              Author: <b className="ml-1">{blogInfo.data.user.username}</b>
            </span>
          </div>

          {/* Like and Comment Section */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLike}
              className="flex items-center text-red-500"
            >
              <FaHeart
                className={
                  blogInfo.data.likes.includes(user?._id)
                    ? "text-red-500"
                    : "text-gray-400"
                }
              />
              <span>{blogInfo.data.likes.length}</span>
            </button>
          </div>

          {/* Comments Section */}
          <div>
            <h3>Comments</h3>
            <ul>
              {blogInfo.data.comments.map((comment, index) => (
                <li key={index} className="my-2">
                  <strong>{comment.user.username}</strong>:
                  <p>{comment.content}</p>
                  <small>
                    {format(new Date(comment.timestamp), "MMM d, yyyy HH:mm")}
                  </small>
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
