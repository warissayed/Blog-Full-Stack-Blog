"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

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
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<FileList | null>(null);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensures this code only runs on the client
  }, []);

  if (!isClient) return <h1>Loading...</h1>;

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
      toast.warning("Something Snapped While Creating post");
      return;
    }
    if (resp) {
      toast.success("Post uploaded successfully");
      router.push("/");
    }
  };

  async function createNewPost(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (!file || file.length === 0) {
      console.error("No file selected");
      toast.error("No file selected");
      return;
    }
    const post = new FormData();

    post.set("title", title);
    post.set("summary", summary);
    post.set("content", content);
    post.set("file", file[0]);

    await CreatePost(post);
  }

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
      onSubmit={createNewPost}
    >
      <Image
        className="w-[70vw] h-[250px] rounded-lg object-cover"
        src="https://images.pexels.com/photos/6685428/pexels-photo-6685428.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
        alt=""
        width={700}
        height={250}
      />

      <div className="flex flex-col items-center w-full mb-6 gap-3">
        <input
          className="text-2xl border-none p-3 w-[70vw] placeholder-gray-400 focus:outline-none"
          title="title"
          type="text"
          placeholder="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-[70vw]  text-lg p-2 border-none placeholder-gray-400 focus:outline-none"
          type="text"
          placeholder="summary"
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
        className="mt-4 bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};

export default Page;
