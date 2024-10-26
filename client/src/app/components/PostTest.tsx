"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import setUserStore from "../store/useStore";
import { useParams } from "next/navigation";
//icons imports
import { FaEdit } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { div } from "framer-motion/client";

interface BlogInfo {
  data: {
    _id: string;
    title: string;
    summary: string;
    content: string;
    image: string;
    username: string;
  };
}

const PostTest: React.FC = () => {
  const [blogInfo, setBlogInfo] = useState<BlogInfo>();
  const { user, setUser, logoutUser } = setUserStore();
  const { id } = useParams();

  useEffect(() => {
    const fetchBlogInfo = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/users/Post/${id}`
        );

        // Check if the response is OK (status code 200-299)
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

  function delete_Post() {
    fetch(`XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
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
          <h1 className="text-center my-2 text-2xl font-serif">
            {blogInfo.data.title}
            <div className="float-right text-lg">
              {user?.username === blogInfo.data.username ? (
                <div>
                  <Link
                    href={`/Edit/${blogInfo.data._id}`}
                    className=" text-teal-500 cursor-pointer"
                  >
                    <FaEdit />
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
          </h1>
          <p>{blogInfo.data.summary}</p>
          <div className="mb-5 flex justify-between text-lg text-yellow-600 font-sans">
            <span>
              Author:{blogInfo.data.username}
              <b className="ml-1">
                <Link
                  className="text-blue-500 hover:underline"
                  href="/posts?username"
                >
                  //TODO Will add
                </Link>
              </b>
            </span>
            <span>1 day ago</span>
          </div>

          <p
            className="text-gray-600 text-lg leading-6"
            dangerouslySetInnerHTML={{ __html: blogInfo.data.content }}
          ></p>
        </div>
      ) : (
        <div>ok</div>
      )}
      );
    </div>
  );
};

export default PostTest;
