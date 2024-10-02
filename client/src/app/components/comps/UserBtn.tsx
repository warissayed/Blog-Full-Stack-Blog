"use client";
import React from "react";
import { Modal, ModalTrigger } from "../ui/animated-modal";
import setUserStore from "@/app/store/useStore";

export function UserBtn() {
  const { user } = setUserStore();
  return (
    <div className="py-40  flex items-center justify-center">
      <Modal>
        <ModalTrigger className="bg-black dark:bg-white dark:text-black text-white flex justify-center group/modal-btn">
          <span className="group-hover/modal-btn:translate-x-40 text-center transition duration-500">
            {user}
          </span>
          <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
            👤
          </div>
        </ModalTrigger>
      </Modal>
    </div>
  );
}
