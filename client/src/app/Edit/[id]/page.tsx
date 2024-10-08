"use client";
import React, { useEffect, useState } from "react";
import setUserStore from "../../store/useStore";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams, useRouter } from "next/navigation";

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

  const updatePost = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (!user) {
      console.error("User is not authenticated.");
      return;
    }

    const post = new FormData();
    post.set("title", title);
    post.set("summary", summary);
    post.set("content", content);

    // Check if file exists
    if (file && file.length > 0) {
      post.append("file", file[0]); // Use append for file
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/users/Post/${id}`,
        {
          method: "PUT", // Assuming you're updating the post
          body: post,
        }
      );

      if (response.ok) {
        router.push("/"); // Redirect after update
      } else {
        console.error("Failed to update the post");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
    blog.set("userId", user?.id || ""); // Use a fallback for user.id

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
    <form className="flex flex-col gap-4" onSubmit={updateBlog}>
      <h1 className="text-center">Update Blog</h1>
      <input
        title="title"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
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
      <ReactQuill
        value={content}
        onChange={(newValue) => setContent(newValue)}
        modules={modules}
        formats={formats}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Page;
