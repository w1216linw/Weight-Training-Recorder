import { db } from "@/lib/firebase";
import { User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";

const Avatar = ({ user }: { user: FirebaseUser }) => {
  const [avatar, setAvatar] = useState("");
  const getAvatar = async () => {
    if (user) {
      const userRef = doc(db, user.uid, "data");
      const docSnap = await getDoc(userRef);

      return docSnap.exists() ? docSnap.data()?.avatar : "anonymous";
    } else {
      return "anonymous";
    }
  };

  useEffect(() => {
    getAvatar().then((res) => {
      setAvatar(res);
    });
  }, []);
  return (
    <div>
      {avatar && (
        <Image
          src={`/images/${avatar}.png`}
          alt="avatar"
          width={64}
          height={64}
        />
      )}
    </div>
  );
};

export default Avatar;
