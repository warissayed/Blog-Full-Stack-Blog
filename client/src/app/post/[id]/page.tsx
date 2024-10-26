// "use client";
// import React, { useState } from "react";
// import { useEffect } from "react";
// import { useParams } from "next/navigation";
// import setUserStore from "@/app/store/useStore";
// import { userInfo } from "os";
// import Link from "next/link";
// interface BlogInfo {
//   data: {
//     _id: string;
//     title: string;
//     summary: string;
//     content: string;
//     image: string;
//     username: string;
//   };
// }

// function page() {
//   const [blogInfo, setBlogInfo] = useState<BlogInfo>();
//   const { user, setUser, logoutUser } = setUserStore();
//   const { id } = useParams();

//   useEffect(() => {
//     const fetchBlogInfo = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:8000/api/v1/users/Post/${id}`
//         );

//         // Check if the response is OK (status code 200-299)
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const blogInfo = await response.json();
//         console.log(blogInfo);
//         setBlogInfo(blogInfo);
//       } catch (error) {
//         console.error("Failed to fetch blog info:", error);
//       }
//     };

//     if (id) {
//       fetchBlogInfo();
//     }
//   }, [id]);
//   return (
//     <div>
//       {blogInfo ? (
//         <div className="w-full h-full">
//           <img src={blogInfo.data.image} alt="" />
//           <h1>{blogInfo.data.title}</h1>
//           {user?.username === blogInfo.data.username ? (
//             <div>
//               <Link href={`/Edit/${blogInfo.data._id}`}>Edit</Link>
//               <button>Delete</button>
//             </div>
//           ) : (
//             ""
//           )}
//           <p>{blogInfo.data.summary}</p>
//           <p dangerouslySetInnerHTML={{ __html: blogInfo.data.content }}></p>
//         </div>
//       ) : (
//         "Loading..."
//       )}
//     </div>
//   );
// }

// export default page;
"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { useParams } from "next/navigation";
import { format } from "date-fns";
import setUserStore from "@/app/store/useStore";
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
    user: {
      _id: string;
      username: string;
    };
  };
}

const page: React.FC = () => {
  const [blogInfo, setBlogInfo] = useState<BlogInfo>();
  const { user } = setUserStore();
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
        </div>
      ) : (
        <div className="text-center">
          <h1>Loading...</h1>
          <p className="text-yellow-500">Please wait</p>
        </div>
      )}
      );
    </div>
  );
};

export default page;
