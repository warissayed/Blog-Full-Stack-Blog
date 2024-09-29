"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import setUserStore from "@/app/store/useStore";
import { userInfo } from "os";
import Link from "next/link";
function page() {
  const [blogInfo, setBlogInfo] = useState(null);
  const { user, setUser, logoutUser } = setUserStore();
  const { id } = useParams();
  console.log(id);

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
  return (
    <div>
      {blogInfo ? (
        <div className="w-full h-full">
          <img src={blogInfo.data.image} alt="" />
          <h1>{blogInfo.data.title}</h1>
          {user === blogInfo.data.username ? (
            <div>
              <Link href={`/Edit/${blogInfo.data._id}`}>Edit</Link>
              <button>Delete</button>
            </div>
          ) : (
            ""
          )}
          <p>{blogInfo.data.summary}</p>
          <p dangerouslySetInnerHTML={{ __html: blogInfo.data.content }}></p>
        </div>
      ) : (
        "Loading..."
      )}
    </div>
  );
}

export default page;
