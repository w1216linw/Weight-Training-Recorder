"use client";
import { auth, db } from "@/lib/firebase";
import { collection, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaLessThan, FaPlus, FaTimes } from "react-icons/fa";

type Exercise = {
  name: string;
  weight: string;
  sets: string;
};

const PlanPage = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [tag, setTag] = useState("");
  const [exercise, setExercise] = useState([
    { name: "", weight: "", sets: "" },
  ]);
  const [error, setError] = useState("");
  const [planTitle, setPlanTitle] = useState("");
  const addExercise = () => {
    setExercise([...exercise, { name: "", weight: "", sets: "" }]);
  };

  const removeExercise = (index: number) => {
    const newExercise = [...exercise];
    newExercise.splice(index, 1);
    setExercise(newExercise);
  };

  const handleInputChange = (
    index: number,
    key: keyof Exercise,
    value: string
  ) => {
    const newPlans = [...exercise];
    newPlans[index][key] = value;
    setExercise(newPlans);
  };

  const savePlan = async () => {
    try {
      if (!tag) throw new Error("Tag is required");

      if (user) {
        const collectionRef = collection(db, user.uid, "exercise", "plan");
        const userRef = doc(collectionRef, tag);
        await updateDoc(userRef, {
          [planTitle]: exercise,
          tag: tag,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  return (
    <div className="flex flex-col p-4">
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="relative">
        <div className="flex items-center justify-between mb-5">
          <button onClick={() => router.back()} className="text-2xl">
            <FaLessThan />
          </button>
          <h1 className="text-2xl font-bold">Pre Plan</h1>
          <div className="flex w-1/2">
            <input
              type="text"
              placeholder="Title"
              value={planTitle}
              onChange={(e) => setPlanTitle(e.target.value)}
              className="px-2 py-1 w-32 rounded-md border border-gray-300"
            />
            <input
              type="text"
              placeholder="tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className=" px-2 py-1 w-12 rounded-md border border-gray-300"
            />
          </div>
        </div>
        <div className="divide-y-2 ">
          {exercise.map((exercise, index) => (
            <div key={index} className="py-4 flex gap-2">
              <div>
                <div className="mb-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={exercise.name}
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
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
                      handleInputChange(index, "weight", e.target.value)
                    }
                    className="px-4 py-2 w-1/2 mr-2 rounded-md border border-gray-300"
                  />
                  <input
                    type="text"
                    placeholder="Sets"
                    value={exercise.sets}
                    onChange={(e) =>
                      handleInputChange(index, "sets", e.target.value)
                    }
                    className="px-4 py-2 w-1/2 rounded-md border border-gray-300"
                  />
                </div>
              </div>
              <button
                onClick={() => removeExercise(index)}
                className="text-neutral-50 text-2xl px-2 bg-red-300 rounded-md"
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
        <div className=" flex gap-5">
          <button
            onClick={addExercise}
            className="bg-gray-400 w-full grid place-items-center text-white px-4 py-2 rounded-md text-2xl"
          >
            <FaPlus />
          </button>
          <button
            onClick={savePlan}
            className="bg-green-500 text-white px-4 py-2 rounded-md w-full"
          >
            Save Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanPage;
