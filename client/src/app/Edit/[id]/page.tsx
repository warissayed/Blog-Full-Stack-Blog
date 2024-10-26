"use client";
import React, { useEffect, useState } from "react";
import setUserStore from "../../store/useStore";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams, useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
  "image",
];

const Page = () => {
  const [title, setTitle] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const { user, setUser } = setUserStore();
  const [file, setFile] = useState<FileList | null>(null);

  const { id } = useParams();
  const router = useRouter();

  // const updatePost = async (ev: React.FormEvent<HTMLFormElement>) => {
  //   ev.preventDefault();

  //   if (!user) {
  //     console.error("User is not authenticated.");
  //     return;
  //   }

  //   const post = new FormData();
  //   post.set("title", title);
  //   post.set("summary", summary);
  //   post.set("content", content);

  //   // Check if file exists
  //   if (file && file.length > 0) {
  //     post.append("file", file[0]); // Use append for file
  //   }

  //   try {
  //     const response = await fetch(
  //       `http://localhost:8000/api/v1/users/Post/${id}`,
  //       {
  //         method: "PUT", // Assuming you're updating the post
  //         body: post,
  //       }
  //     );

  //     if (response.ok) {
  //       router.push("/"); // Redirect after update
  //     } else {
  //       console.error("Failed to update the post");
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/users/Post/${id}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch post. Status: ${response.status}`);
        }

        const blog = await response.json();
        setTitle(blog.data.title);
        setSummary(blog.data.summary);
        setContent(blog.data.content);
      } catch (error) {
        console.error("Error fetching the post:", error);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  const updateBlog = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (!user) {
      console.error("User is not authenticated.");
      return;
    }

    if (!file || file.length === 0) {
      console.error("No file selected");
      return;
    }

    const blog = new FormData();
    blog.set("title", title);
    blog.set("summary", summary);
    blog.set("content", content);
    blog.append("file", file[0]); // Safely append file
    blog.set("userId", user?._id || ""); // Use a fallback for user.id

    await fetch(`http://localhost:8000/api/v1/users/Post/${id}`, {
      method: "PUT",
      credentials: "include",
      body: blog,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        router.push(`/Post/${id}`);
      });
  };

  return (
    <form
      className="flex flex-col justify-center items-center gap-4 w-full h-screen mt-6"
      onSubmit={updateBlog}
    >
      <img
        className=" w-[70vw] h-[250px] rounded-lg object-cover"
        src="https://images.pexels.com/photos/6685428/pexels-photo-6685428.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
        alt=""
      />
      <h1 className="text-center my-2 text-2xl font-serif">Update Blog</h1>
      <div className="flex flex-col items-center w-full mb-6 gap-3">
        <input
          className="text-2xl border-none p-3 w-[70vw] placeholder-gray-400 focus:outline-none"
          title="title"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-[70vw]  text-lg p-2 border-none placeholder-gray-400 focus:outline-none"
          type="text"
          placeholder="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
        <input
          type="file"
          accept=".png, .jpg, .jpeg"
          onChange={(ev) => setFile(ev.target.files)}
        />
        <label htmlFor="fileInput" className="cursor-pointer">
          <i className="w-6 h-6 text-lg border border-gray-400 rounded-full flex items-center justify-center text-gray-500 ">
            <FaPlus />
          </i>
        </label>
        <input
          id="fileInput"
          type="file"
          onChange={(ev) => setFile(ev.target.files)}
          className="hidden"
        />
      </div>
      <div className="w-[71%]">
        <ReactQuill
          value={content}
          onChange={(newValue) => setContent(newValue)}
          modules={modules}
          formats={formats}
        />
      </div>

      <button
        className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 my-2 px-4 rounded"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};

export default Page;
