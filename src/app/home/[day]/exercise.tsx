import { db } from "@/lib/firebase";
import { handleError } from "@/lib/utils";
import { User as FirebaseUser } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { type exercise } from "./page";

const Exercise = ({
  user,
  date,
  fetchDetail,
}: {
  user: FirebaseUser;
  date: string;
  fetchDetail: () => void;
}) => {
  const router = useRouter();
  const path = usePathname();
  const [exercise, setExercise] = useState<exercise>({
    name: "",
    weight: "",
    sets: "",
  });
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
          [exercise.name]: {
            weight: exercise.weight,
            sets: exercise.sets,
          },
        },
        { merge: true }
      );

      fetchDetail();
    } catch (error) {
      handleError(error, setError);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <div>
          <div className="mb-2">
            <input
              type="text"
              placeholder="Name"
              value={exercise.name}
              onChange={(e) =>
                setExercise({ ...exercise, name: e.target.value })
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
    </>
  );
};

export default Exercise;
