"use client";

import { auth, db } from "@/lib/firebase";
import { classes } from "@/lib/utils";
import dayjs from "dayjs";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaLessThan } from "react-icons/fa";
import Exercise from "./exercise";

export type exercise = {
  name: string;
  weight: string;
  sets: string;
};

function formateExercise(
  exercise: Record<string, Record<string, string>>
): exercise[] {
  return Object.keys(exercise).map((elem) => ({
    name: elem,
    sets: String(exercise[elem].sets),
    weight: String(exercise[elem].weight),
  }));
}

const DayPage = ({ params }: { params: { day: string } }) => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [exercise, setExercise] = useState<exercise[]>([]);
  const [isExercise, setIsExercise] = useState(false);
  const [tag, setTag] = useState("");
  const [delay, setDelay] = useState(false);
  const [mounted, setMounted] = useState(false);

  const fetchDetail = async () => {
    if (user) {
      const userRef = doc(db, user.uid, "exercise", "detail", params.day);
      const docSnap = await getDoc(userRef);

      return docSnap.exists() ? docSnap.data() : {};
    } else {
      return {};
    }
  };

  const fetchIsExercise = async () => {
    if (user) {
      const userRef = doc(
        db,
        user.uid,
        "exercise",
        "month",
        dayjs(params.day).format("MM-YYYY")
      );
      const docSnap = await getDoc(userRef);
      return docSnap.exists() ? docSnap.get(params.day) : {};
    } else {
      return {};
    }
  };

  const handleClick = () => {
    setIsExercise(!isExercise);
    setDelay(!delay);
  };

  const handleSaveTag = async () => {
    if (user) {
      const userRef = doc(
        db,
        user.uid,
        "exercise",
        "month",
        dayjs(params.day).format("MM-YYYY")
      );
      const docSnap = (await getDoc(userRef)).get(params.day);
      await updateDoc(userRef, {
        [params.day]: { ...docSnap, tag },
      });
    }
  };

  const updateIsExercise = async () => {
    if (user) {
      const userRef = doc(
        db,
        user.uid,
        "exercise",
        "month",
        dayjs(params.day).format("MM-YYYY")
      );
      const docSnap = (await getDoc(userRef)).get(params.day);
      await updateDoc(userRef, {
        [params.day]: { ...docSnap, isExercise },
      });
    }
  };

  // initial the details and isExercise
  useEffect(() => {
    fetchIsExercise().then((res) => {
      setIsExercise(res?.isExercise);
      setTag(res?.tag);
    });
    fetchDetail().then((res) => {
      const exercise = res ? formateExercise(res) : [];

      setExercise(exercise);
    });
  }, []);

  // debounce for updating isExercise
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => {
        updateIsExercise();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [delay]);

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
      <div className="flex items-center gap-2 my-2">
        <input
          className="px-2 w-16 py-1 rounded-md border border-gray-300"
          placeholder="Tag"
          type="text"
          id="tag"
          name="tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
        <button className="" onClick={() => handleSaveTag()}>
          save
        </button>
      </div>

      <div>{user && <Exercise user={user} date={params.day} />}</div>
      <div>
        {exercise.length > 0 &&
          exercise.map((elem) => (
            <div key={elem.name} className="my-4 p-4 border rounded shadow-md">
              <h1 className="text-lg font-bold mb-2">{elem.name}</h1>
              <div className="flex justify-between">
                <p className="text-gray-700">Weight: {elem.weight}</p>
                <p className="text-gray-700">Sets: {elem.sets}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default DayPage;
