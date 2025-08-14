import { avatars } from "@/lib/data";
import { classes } from "@/lib/utils";
import { User as FirebaseUser } from "firebase/auth";
import { setDoc } from "firebase/firestore";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { IoCaretDownSharp, IoCaretUpSharp } from "react-icons/io5";
import { useUserAvatar } from "@/lib/hooks";
import { getUserDocRef } from "@/lib/firebase-utils";

const Avatar = ({ user }: { user: FirebaseUser }) => {
  const [showAvatar, setShowAvatar] = useState(false);
  const [newAvatar, setNewAvatar] = useState("");
  const { avatar: selectAvatar } = useUserAvatar(user);

  const updateUserAvatar = async () => {
    const avatarRef = getUserDocRef(user.uid);
    await setDoc(
      avatarRef,
      {
        avatar: newAvatar,
      },
      { merge: true }
    );
    window.location.reload();
  };

  return (
    <div className={classes("container rounded-md bg-neutral-content")}>
      <div
        className="flex justify-between h-12 py-4 items-center cursor-pointer"
        onClick={() => setShowAvatar(!showAvatar)}
      >
        <h1>Avatar</h1>
        <span>{showAvatar ? <IoCaretUpSharp /> : <IoCaretDownSharp />}</span>
      </div>
      <div
        className={classes(
          "flex flex-col gap-8 overflow-hidden select-none",
          showAvatar ? "h-[9rem] py-4" : "h-0 py-0"
        )}
      >
        <div className="flex gap-5 justify-evenly">
          {avatars.map((elem) => (
            <motion.button
              onClick={() => setNewAvatar(elem.value)}
              disabled={elem.value === selectAvatar}
              key={elem.value}
            >
              <Image
                src={elem.url}
                alt={elem.value}
                width={48}
                height={48}
                className={classes(
                  elem.value === selectAvatar
                    ? "outline-dashed outline-neutral outline-2"
                    : elem.value === newAvatar
                    ? "outline-dashed outline-secondary outline-2"
                    : "outline-hidden",
                  "rounded-full outline-2 outline-offset-4 cursor-pointer"
                )}
              />
            </motion.button>
          ))}
        </div>
        <button onClick={updateUserAvatar} className="btn">
          Save
        </button>
      </div>
    </div>
  );
};

export default Avatar;
