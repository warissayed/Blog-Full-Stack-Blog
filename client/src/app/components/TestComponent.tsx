// import React from "react";

// const TestComponent = () => {
//   return (
//     <div className="w-full h-full flex justify-center items-center flex-row flex-wrap">
//       TestComponent
//     </div>
//   );
// };

// export default TestComponent;
import React from "react";

const BlogList = () => {
  const blogs = [
    {
      id: 1,
      title: "Understanding React Hooks",
      username: "John Doe",
      date: "October 10, 2024",
      summary:
        "React Hooks allow you to use state and other React features without writing a class.",
      imgUrl: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      title: "Tailwind CSS Best Practices",
      username: "Jane Smith",
      date: "October 9, 2024",
      summary:
        "Tailwind CSS makes it easy to build custom designs without writing a lot of CSS.",
      imgUrl: "https://via.placeholder.com/150",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-8 flex flex-row gap-5 item  ">
      {blogs.map((blog) => (
        <div
          key={blog.id}
          className="flex bg-white shadow-lg rounded-lg mb-6 overflow-hidden border flex-col border-black "
        >
          <img
            src={blog.imgUrl}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="p-4 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{blog.title}</h2>
              <p className="text-gray-600 text-sm">
                by <span className="font-semibold">{blog.username}</span> on{" "}
                {blog.date}
              </p>
              <p className="mt-2 text-gray-700">{blog.summary}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
