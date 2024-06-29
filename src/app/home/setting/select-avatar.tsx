import { avatars } from "@/lib/data";
import { db } from "@/lib/firebase";
import { classes } from "@/lib/utils";
import { User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoCaretDownSharp, IoCaretUpSharp } from "react-icons/io5";

const Avatar = ({ user }: { user: FirebaseUser }) => {
  const [showAvatar, setShowAvatar] = useState(false);
  const [selectAvatar, setSelectAvatar] = useState("");
  const [newAvatar, setNewAvatar] = useState("");

  const fetchUserAvatar = async () => {
    const avatarRef = doc(db, user.uid, "data");
    const data = await getDoc(avatarRef);
    if (data.exists() && data.get("avatar")) {
      setSelectAvatar(data.get("avatar"));
    } else return;
  };

  const updateUserAvatar = async () => {
    const avatarRef = doc(db, user.uid, "data");
    await setDoc(
      avatarRef,
      {
        avatar: newAvatar,
      },
      { merge: true }
    );
    fetchUserAvatar();
  };

  useEffect(() => {
    fetchUserAvatar();
  }, []);

  return (
    <div
      className={classes(
        "container space-y-6 rounded-md",
        showAvatar ? "h-show" : "h-close"
      )}
    >
      <div className="flex justify-between py-1">
        <h1>Avatar</h1>
        <button onClick={() => setShowAvatar(!showAvatar)}>
          {showAvatar ? <IoCaretUpSharp /> : <IoCaretDownSharp />}
        </button>
      </div>
      <div className="flex flex-col gap-6 ">
        <div className="flex gap-5 justify-evenly">
          {avatars.map((elem) => (
            <button
              onClick={() => setNewAvatar(elem.value)}
              disabled={elem.value === selectAvatar}
            >
              <Image
                key={elem.value}
                src={elem.url}
                alt={elem.value}
                width={48}
                height={48}
                className={classes(
                  elem.value === selectAvatar
                    ? "outline-dashed outline-green-300"
                    : elem.value === newAvatar
                    ? "outline-dashed outline-orange-300"
                    : "outline-none",
                  "rounded-full outline-2 outline-offset-4"
                )}
              />
            </button>
          ))}
        </div>
        <button onClick={updateUserAvatar} className="w-full text-lg">
          Save
        </button>
      </div>
    </div>
  );
};

export default Avatar;
