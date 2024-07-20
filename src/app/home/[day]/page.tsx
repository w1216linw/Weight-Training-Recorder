"use client";

import { auth, db } from "@/lib/firebase";
import { classes, objToArray } from "@/lib/utils";
import dayjs from "dayjs";
import { deleteField, doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaLessThan } from "react-icons/fa";
import { FiDelete } from "react-icons/fi";
import Exercise from "./exercise";

export type ExerciseType = {
  name: string;
  weight: string;
  sets: string;
  reps: string;
};

const DayPage = ({ params }: { params: { day: string } }) => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [exercise, setExercise] = useState<ExerciseType[]>([]);
  const [isExercise, setIsExercise] = useState(false);
  const [tag, setTag] = useState<string>("");
  const [delay, setDelay] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fetchDetail = async () => {
    if (user) {
      const userRef = doc(db, user.uid, "exercise", "detail", params.day);
      const docSnap = await getDoc(userRef);

      setExercise(objToArray<ExerciseType>("name", docSnap.data()));
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

  const deleteExercise = async (exercise: string) => {
    if (user) {
      const docRef = doc(db, user.uid, "exercise", "detail", params.day);
      await updateDoc(docRef, { [exercise]: deleteField() });
      fetchDetail();
    } else {
      return;
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
    fetchDetail();
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
    <div className="p-2 space-y-3 ">
      <div className="flex items-center">
        <button onClick={() => router.back()} className="text-2xl">
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
              "size-5 bg-neutral-100 rounded-full shadow transform transition ease-in-out duration-200",
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

      <div>
        {user && (
          <Exercise user={user} date={params.day} fetchDetail={fetchDetail} />
        )}
      </div>
      <div>
        {exercise.length > 0 &&
          exercise.map((elem) => (
            <div
              key={elem.name}
              className="my-4 p-4 border rounded shadow-md flex justify-between"
            >
              <div className="flex-1 ">
                <div className="flex justify-between items-center">
                  <h1 className="text-lg font-bold mb-2 capitalize">
                    {elem.name}
                  </h1>
                  <p className="text-gray-500">
                    V:{" "}
                    {Number(elem.weight) *
                      Number(elem.reps) *
                      Number(elem.sets)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-700">Weight: {elem.weight}</p>
                  <p className="text-gray-700">Reps: {elem.reps}</p>
                  <p className="text-gray-700">Sets: {elem.sets}</p>
                </div>
              </div>
              <button
                className="w-10 flex items-center justify-end"
                onClick={() => deleteExercise(elem.name)}
              >
                <FiDelete size={18} className="text-red-400" />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default DayPage;
