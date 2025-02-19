"use client";

import { db } from "@/lib/firebase";
import { objToArray } from "@/lib/utils";

import { useAuthContext } from "@/app/contexts/authContext";
import { deleteField, doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiDelete } from "react-icons/fi";
import { useHomeContext } from "../../contexts/homeContext";
import BackBtn from "./components/backBtn";
import DateControl from "./components/dateControl";
import NewExercise from "./components/newExercise";

export type ExerciseType = {
  name: string;
  weight: string;
  sets: string;
  reps: string;
};

const DayPage = ({ params }: { params: { day: string } }) => {
  const { user } = useAuthContext();
  const { prevRecord } = useHomeContext();

  const router = useRouter();
  const [exercise, setExercise] = useState<ExerciseType[]>([]);

  const fetchDetail = async () => {
    if (user) {
      const userRef = doc(db, user.uid, "exercise", "detail", params.day);
      const docSnap = await getDoc(userRef);

      setExercise(objToArray<ExerciseType>("name", docSnap.data()));
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

  useEffect(() => {
    if (!user) {
      router.push("/home");
    }
  }, []);

  // initial the details and isExercise
  useEffect(() => {
    fetchDetail();
  }, []);

  return (
    <div className="p-2 space-y-3">
      <BackBtn />
      <DateControl params={params} />
      {user && (
        <NewExercise user={user} date={params.day} fetchDetail={fetchDetail} />
      )}

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
                    {`V: ${
                      Number(elem.weight) *
                      Number(elem.reps) *
                      Number(elem.sets)
                    }`}
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
