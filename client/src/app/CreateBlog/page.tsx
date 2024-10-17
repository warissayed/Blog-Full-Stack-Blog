"use client";
import React, { useEffect, useState } from "react";
import setUserStore from "../store/useStore";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useRouter } from "next/navigation";
import { error } from "console";

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

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const { user, setUser } = setUserStore();
  const [file, setFile] = useState<FileList | null>();
  const router = useRouter();

  if (!user) {
    return setUser("  Please Login");
  }

  const fetchConfig = async (input: string, init?: RequestInit) => {
    const API = process.env.NEXT_PUBLIC_BACKEND_API;

    const request = await fetch(`${API}`.concat(input), init);
    const requestData = await request.json();
    let err;
    let resp = requestData;

    if (request.status >= 400) {
      err = requestData;
      resp = null;
    }

    return [err, resp];
  };

  const CreatePost = async (params: FormData) => {
    const [err, resp] = await fetchConfig(`/users/CreatePost`, {
      method: "POST",
      credentials: "include",
      body: params,
    });

    if (err) {
      // Handle Error Here
      alert("Something Snapped While Creating post");
      return;
    }

    // Handle Toast & Post Ops
    router.push("/");
  };

  async function createNewPost(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (!file || file.length === 0) {
      console.error("No file selected");
      return;
    }
    const post = new FormData();
    post.set("title", title);
    post.set("summary", summary);
    post.set("content", content);
    post.set("file", file[0]);

    await CreatePost(post);
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
