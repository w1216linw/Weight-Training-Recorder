"use client";

import { auth, db } from "@/lib/firebase";
import { classes } from "@/lib/utils";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaLessThan } from "react-icons/fa";
import Exercise from "./exercise";

const dayPage = ({ params }: { params: { day: string } }) => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [exercise, setExercise] = useState({});
  const [isExercise, setIsExercise] = useState(false);
  const [delay, setDelay] = useState(false);

  const fetchData = async () => {
    if (user) {
      const userRef = doc(db, user.uid + "dates", params.day);
      const docSnap = await getDoc(userRef);

      return docSnap.exists() ? docSnap.data() : {};
    } else {
      return {};
    }
  };

  const handleClick = () => {
    setIsExercise(!isExercise);
    setDelay(!delay);
  };

  const updateIsExercise = async () => {
    if (user) {
      const userRef = doc(db, user.uid + "dates", params.day);
      await setDoc(userRef, {
        isExercise,
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      updateIsExercise();
    }, 1000);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    fetchData().then((res) => {
      const { isExercise, ...exercise } = res || {};
      setExercise(exercise);
      setIsExercise(isExercise || false);
    });
  }, []);

  return (
    <div className="p-2">
      <div className="flex items-center">
        <button onClick={() => router.push("/home")} className="text-2xl">
          <FaLessThan />
        </button>
      </div>
      <div className="text-center flex items-center justify-center gap-2">
        <h1 className="text-2xl font-bold">{params.day}</h1>
        <button
          onClick={handleClick}
          className={classes(
            "flex items-center w-12 h-6 rounded-full p-1",
            isExercise
              ? "justify-self-end bg-green-300"
              : "justify-start bg-gray-200"
          )}
        >
          <div
            className={classes(
              "size-5 bg-white rounded-full shadow transform transition ease-in-out duration-200",
              isExercise ? "translate-x-5 " : "translate-x-0"
            )}
          ></div>
        </button>
      </div>

      <div>{user && <Exercise user={user} date={params.day} />}</div>
    </div>
  );
};

export default dayPage;
