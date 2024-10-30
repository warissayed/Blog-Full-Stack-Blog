"use client";
import React from "react";
import { Modal, ModalTrigger } from "../ui/animated-modal";
import logo from "../assets/android-chrome-512x512.png";
import Image from "next/image";

export function LoginBtn() {
  return (
    <div className="py-40  flex items-center justify-center">
      <Modal>
        <ModalTrigger className="bg-black dark:bg-white dark:text-black text-white flex justify-center group/modal-btn">
          <span className="group-hover/modal-btn:translate-x-40  transition duration-500 flex items-center ">
            <Image src={logo} alt="Logo" width={25} height={25} />
            enBlog
          </span>
          <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
            <Image src={logo} alt="Logo" width={25} height={25} />
          </div>
        </ModalTrigger>
      </Modal>
    </div>
  );
}
