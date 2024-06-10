"use client";
import { avatars } from "@/lib/data";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoCaretDownSharp, IoCaretUpSharp } from "react-icons/io5";

const SettingPage = () => {
  const avatar = "dog";
  const [showAvatar, setShowAvatar] = useState(false);
  const [selectAvatar, setSelectAvatar] = useState(avatar);
  useEffect(() => {}, []);

  return (
    <div className="min-w-80">
      <h1>Setting</h1>
      <div className="bg-white py-1 px-2 space-y-3">
        <div className="flex justify-between border-b-2 py-1">
          <h1>Avatar</h1>
          <button>
            {showAvatar ? <IoCaretUpSharp /> : <IoCaretDownSharp />}
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-5 justify-evenly">
            {avatars.map((elem) => (
              <Image
                key={elem.value}
                src={elem.url}
                alt={elem.value}
                width={48}
                height={48}
                className={`${
                  avatar === elem.value
                    ? "outline-2 outline-offset-4 outline-dashed outline-green-300"
                    : "outline-none"
                } rounded-full`}
              />
            ))}
          </div>
          <button className="w-full text-lg">Save</button>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
