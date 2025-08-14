import { useState, useEffect } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { getDoc } from "firebase/firestore";
import { getUserDocRef } from "./firebase-utils";

export const useUserAvatar = (user: FirebaseUser | null) => {
  const [avatar, setAvatar] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (!user) {
        setAvatar("anonymous");
        setLoading(false);
        return;
      }

      try {
        const userRef = getUserDocRef(user.uid);
        const docSnap = await getDoc(userRef);
        const avatarData = docSnap.exists() ? docSnap.data()?.avatar : "anonymous";
        setAvatar(avatarData || "anonymous");
      } catch (error) {
        console.error("Error fetching avatar:", error);
        setAvatar("anonymous");
      } finally {
        setLoading(false);
      }
    };

    fetchAvatar();
  }, [user]);

  return { avatar, loading };
};