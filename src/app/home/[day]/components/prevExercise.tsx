import { useHomeContext } from "@/app/contexts/homeContext";
import { db } from "@/lib/firebase";
import { objToArray } from "@/lib/utils";
import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { CardioType, TrainingType } from "../page";
import { isCardio } from "./workoutInfo";

type ExerciseSet = (TrainingType | CardioType)[];

const PrevCardioExercise = ({ item }: { item: CardioType }) => {
  return (
    <div className="aspect-video bg-white rounded-md min-w-28 p-2 flex flex-col justify-between">
      <div>
        <p className="capitalize text-wrap">{item.name}</p>
        <p className="text-xs text-gray-500">
          Est. kcal:
          <span className="ml-1">
            {((Number(item.heartRate) - 70) / 100) * 8 * Number(item.duration)}
          </span>
        </p>
      </div>
      <div className="text-xs flex justify-between">
        <p>{item.duration}mins</p>
        <span>/</span>
        <p>{item.heartRate}bpm</p>
      </div>
    </div>
  );
};

const PrevTrainingExercise = ({ item }: { item: TrainingType }) => {
  return (
    <div className="aspect-video bg-white rounded-md min-w-28 p-2 flex flex-col justify-between">
      <p className="capitalize text-wrap">{item.name}</p>
      <div className="flex justify-between items-end">
        <p>
          {item.weight}/{item.reps}/{item.sets}
        </p>
        <p className="text-xs text-gray-500">
          {Number(item.reps) * Number(item.sets) * Number(item.weight)}
        </p>
      </div>
    </div>
  );
};

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
            {prevExercise.map((item, index) =>
              isCardio(item) ? (
                <PrevCardioExercise key={index} item={item} />
              ) : (
                <PrevTrainingExercise key={index} item={item} />
              )
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PrevExercise;
