import { useHomeContext } from "@/app/contexts/homeContext";
import { db } from "@/lib/firebase";
import { objToArray } from "@/lib/utils";
import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ExerciseType } from "../page";

type ExerciseSet = ExerciseType[];

const PrevExercise = ({
  tag,
  user,
}: {
  user: User | null | undefined;
  tag: string;
}) => {
  const { prevRecord } = useHomeContext();
  const [prevExercise, setPrevExercise] = useState<ExerciseSet>();
  const fetchPrevExercise = async () => {
    if (user && prevRecord[tag]) {
      const userRef = doc(db, user.uid, "exercise", "detail", prevRecord[tag]);
      const docSnap = (await getDoc(userRef)).data();
      if (docSnap) {
        setPrevExercise(objToArray("name", docSnap));
      } else {
        setPrevExercise([]);
      }
    } else {
      setPrevExercise([]);
    }
  };

  useEffect(() => {
    if (!tag) return;
    fetchPrevExercise();
  }, [tag]);

  return (
    <>
      {prevExercise && prevExercise.length > 0 && (
        <div className="w-full border overflow-hidden p-2 shadow-sm rounded-md">
          <p className="pb-1">Previous Exercise</p>
          <div className="flex gap-2 overflow-x-scroll">
            {prevExercise.map((item) => (
              <div
                key={item.name}
                className="aspect-video bg-white rounded-md min-w-28 p-2 flex flex-col justify-between"
              >
                <p className="capitalize text-wrap">{item.name}</p>
                <div className="text-xs flex justify-between">
                  <p>
                    {item.weight}/{item.reps}/{item.sets}
                  </p>
                  <p>
                    {Number(item.reps) *
                      Number(item.sets) *
                      Number(item.weight)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default PrevExercise;
