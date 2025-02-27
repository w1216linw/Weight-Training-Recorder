"use client";

import { db } from "@/lib/firebase";
import { objToArray } from "@/lib/utils";

import { useAuthContext } from "@/app/contexts/authContext";
import { deleteField, doc, getDoc, updateDoc } from "firebase/firestore";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import BackBtn from "./components/backBtn";
import DateControl from "./components/dateControl";
import NewExercise from "./components/newExercise";
import WorkoutInfo from "./components/workoutInfo";

type WorkoutInfoProps = {
  name: string;
  type: "training" | "cardio";
};

export type TrainingType = WorkoutInfoProps & {
  weight: string;
  sets: string;
  reps: string;
};

export type CardioType = WorkoutInfoProps & {
  duration: string;
};

const DayPage = ({ params }: { params: { day: string } }) => {
  const { user } = useAuthContext();

  const router = useRouter();
  const [exercise, setExercise] = useState<(CardioType | TrainingType)[]>([]);
  const constraintsRef = useRef<HTMLDivElement>(null);

  const fetchDetail = async () => {
    if (user) {
      const userRef = doc(db, user.uid, "exercise", "detail", params.day);
      const docSnap = await getDoc(userRef);

      setExercise(objToArray<TrainingType>("name", docSnap.data()));
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
    <motion.div className="p-2 space-y-3" ref={constraintsRef}>
      <BackBtn />
      <DateControl params={params} />

      {user && (
        <NewExercise
          user={user}
          date={params.day}
          fetchDetail={fetchDetail}
          dragConstraintsRef={constraintsRef}
        />
      )}
      <div>
        {exercise.length > 0 &&
          exercise.map((elem) => WorkoutInfo({ info: elem, deleteExercise }))}
      </div>
    </motion.div>
  );
};

export default DayPage;
