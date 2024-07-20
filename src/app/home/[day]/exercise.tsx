import { db } from "@/lib/firebase";
import { handleError } from "@/lib/utils";
import { User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { type ExerciseType } from "./page";

const Exercise = ({
  user,
  date,
  fetchDetail,
}: {
  user: FirebaseUser;
  date: string;
  fetchDetail: () => void;
}) => {
  const [exercise, setExercise] = useState<ExerciseType>({
    name: "",
    weight: "",
    reps: "",
    sets: "",
  });

  const checkMovement = async (exercise: ExerciseType, date: string) => {
    const formattedName = exercise.name.toLowerCase().trim();
    if (
      ["bench press", "press push", "deadlift", "squat"].includes(formattedName)
    ) {
      const prRef = doc(db, user.uid, "exercise", "compound", formattedName);
      const graphRef = doc(
        db,
        user.uid,
        "exercise",
        "compound",
        formattedName,
        "graph",
        "process"
      );
      const prSnap = (await getDoc(prRef)).data();
      await setDoc(
        graphRef,
        {
          [date]: {
            weight: exercise.weight,
            reps: exercise.reps,
            sets: exercise.sets,
          },
        },
        { merge: true }
      );
      if (!prSnap?.pr) {
        await setDoc(
          prRef,
          {
            pr: {
              weight: exercise.weight,
              date: date,
            },
          },
          { merge: true }
        );
      } else if (Number(prSnap.pr.weight) <= Number(exercise.weight)) {
        await setDoc(
          prRef,
          {
            prevPr: prSnap.pr,
            pr: {
              weight: exercise.weight,
              date: date,
            },
          },
          { merge: true }
        );
      }
    }
  };

  const resetExercise = () => {
    setExercise({
      name: "",
      weight: "",
      reps: "",
      sets: "",
    });
  };

  const [error, setError] = useState("");
  const update = async () => {
    try {
      if (!exercise.name || !exercise.weight || !exercise.sets) {
        throw new Error("Please fill in all fields");
      }
      const docRef = doc(db, user.uid, "exercise", "detail", date);

      await setDoc(
        docRef,
        {
          [exercise.name.toLowerCase().trim()]: {
            weight: exercise.weight,
            sets: exercise.sets,
            reps: exercise.reps,
          },
        },
        { merge: true }
      );
      checkMovement(exercise, date);
      resetExercise();
      fetchDetail();
    } catch (error) {
      handleError(error, setError);
    }
  };

  return (
    <div>
      <div className="flex gap-2">
        <div className="flex-1">
          <div className="mb-2">
            <input
              type="text"
              placeholder="Name"
              value={exercise.name}
              onChange={(e) =>
                setExercise({
                  ...exercise,
                  name: e.target.value,
                })
              }
              className="px-4 py-2 w-full rounded-md border border-gray-300"
            />
          </div>
          <div className="flex">
            <input
              type="text"
              placeholder="Weight"
              value={exercise.weight}
              onChange={(e) =>
                setExercise({ ...exercise, weight: e.target.value })
              }
              className="px-4 py-2 w-1/2 mr-2 rounded-md border border-gray-300"
            />
            <input
              type="text"
              placeholder="Reps"
              value={exercise.reps}
              onChange={(e) =>
                setExercise({ ...exercise, reps: e.target.value })
              }
              className="px-4 py-2 w-1/2 mr-2 rounded-md border border-gray-300"
            />
            <input
              type="text"
              placeholder="Sets"
              value={exercise.sets}
              onChange={(e) =>
                setExercise({ ...exercise, sets: e.target.value })
              }
              className="px-4 py-2 w-1/2 rounded-md border border-gray-300"
            />
          </div>
        </div>
        <button
          onClick={update}
          className="text-neutral-50 text-2xl px-2 bg-green-300 rounded-md hover:bg-green-500"
        >
          <FaPlus />
        </button>
      </div>
      {error !== "" && <div className="flex">{error}</div>}
    </div>
  );
};

export default Exercise;
