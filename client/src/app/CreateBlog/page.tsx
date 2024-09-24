"use client";
import React, { useState } from "react";
import setUserStore from "../store/useStore";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const { user, setUser } = setUserStore();
  const [file, setFile] = useState<FileList | null>(null);
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
  if (!user) {
    return setUser("  Please Login");
  }
  function createNewPost(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const post = new FormData();
    post.set("title", title);
    post.set("summary", summary);
    post.set("content", content);
    // post.set("file", )

    fetch("http://localhost:8000/api/v1/users/CreatePost", {
      method: "POST",
      body: post,
    }).then((response) => {
      if (response.ok) {
        console.log("Post created successfully");
      } else {
        console.error("Failed to create post");
      }
    });
  }
  return (
    <form className="flex flex-col gap-4" onSubmit={createNewPost}>
      <h1 className="text-center">
        Create Blog "
        <text
          className={user === "  Please Login" ? "text-red-500" : "text-black"}
        >
          {user}
        </text>
        "
      </h1>
      <input
        title="title"
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <input
        type="file"
        accept=".png, .jpg, .jpeg"
        placeholder="add File"
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

export default CreateBlog;
