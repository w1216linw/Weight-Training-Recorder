import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const Avatar = () => {
  const [user] = useAuthState(auth);

  const userRef = doc(db, "users", user?.uid!);
  const [avatar, setAvatar] = useState("");
  const getAvatar = async () => {
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data().avatar;
    } else {
      return "dog";
    }
  };
  useEffect(() => {
    if (avatar.length > 1) return;
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
