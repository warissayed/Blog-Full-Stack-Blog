import React from "react";
import { motion } from "framer-motion";
export default function Header() {
  return (
    <div className="mt-16">
      <div className="flex flex-col items-center font-lora text-gray-700 relative">
        <motion.span
          className="absolute top-[18%] text-xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Thoughtful Insights, Peaceful Reading
        </motion.span>

        <motion.span
          className="absolute top-[20%] text-[100px]"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.9 }}
        >
          BLOG
        </motion.span>
      </div>
      <img
        className="w-full h-[450px] mt-20 object-cover"
        src="https://images.pexels.com/photos/1167355/pexels-photo-1167355.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
        alt="header"
      />
    </div>
  );
}
