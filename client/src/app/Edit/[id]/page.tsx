"use client";
import React, { useEffect, useState } from "react";
import setUserStore from "../../store/useStore";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams, useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

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

  const API = process.env.NEXT_PUBLIC_BACKEND_API;

  const fetchConfig = async (input: string, init?: RequestInit) => {
    const res = await fetch(`${API}`.concat(input), init);
    const requestData = await res.json();
    return res.ok ? [requestData, null] : [null, requestData];
  };
  const EditPost = async (params: FormData) => {
    const [response, error] = await fetchConfig(`/users/editPost/${id}`, {
      method: "PUT",
      credentials: "include",
      body: params,
    });

    if (response) {
      toast.success("Post updated Successfully");
      router.push(`/post/${id}`);
    }
    if (error) {
      toast.error("Something Snapped While Updating post");
      return;
    }
  };
  const updatePost = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const post = new FormData();
    if (!file) {
      toast.error("Please upload a file");
    }
    post.set("title", title);
    post.set("summary", summary);
    post.set("content", content);
    post.set("userId", user?._id || "");
    if (file && file.length > 0) {
      post.set("file", file[0]);
    }

    await EditPost(post);
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${API}/users/Post/${id}`);

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

  const handleFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = ev.target.files;
    setFile(selectedFiles);
    if (selectedFiles && selectedFiles.length > 0) {
      toast.success("File uploaded successfully!");
    }
  };

  return (
    <form
      className="flex flex-col justify-center items-center gap-4 w-full h-screen mt-6"
      onSubmit={updatePost}
    >
      <Image
        className=" w-[70vw] h-[250px] rounded-lg object-cover"
        src="https://images.pexels.com/photos/6685428/pexels-photo-6685428.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
        alt=""
        width={700}
        height={250}
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

        <label htmlFor="fileInput" className="cursor-pointer">
          <i className="w-6 h-6 text-lg border border-gray-400 rounded-full flex items-center justify-center text-gray-500 ">
            <FaPlus />
          </i>
        </label>
        <input
          id="fileInput"
          type="file"
          onChange={handleFileChange}
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
