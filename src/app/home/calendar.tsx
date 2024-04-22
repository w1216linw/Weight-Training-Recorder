import { db } from "@/lib/firebase";
import { classes, generateDate, getDate, makeSet } from "@/lib/utils";
import { User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";

const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = ({ user }: { user: FirebaseUser }) => {
  const [exercise, setExercise] = useState<Set<string>>(new Set());
  const dates = generateDate();
  const fetchExercises = async () => {
    const docRef = doc(
      db,
      user.uid,
      "exercise-count",
      "month",
      getDate("MM-YYYY")
    );
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(docRef, {});
    } else {
      const data = docSnap.data();
      const newData = makeSet(data);
      setExercise(newData);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  return (
    <div>
      <div className="relative flex justify-center items-center h-full">
        <h1 className="font-bold text-xl">{getDate("MMMM")}</h1>
      </div>
      <div className="grid grid-cols-7 place-items-center gap-y-8 p-4">
        {week.map((day, index) => (
          <div
            className="p-2 text-sm rounded-full grid place-content-center"
            key={index}
          >
            {day}
          </div>
        ))}
        {dates.map(({ date, currentMonth, today }, index) => (
          <Link
            href={`/home/${date.format("YYYY-MM-DD")}`}
            key={index}
            className={classes(
              exercise.has(date.format("MM-DD-YYYY")) && "bg-green-300",
              !currentMonth && "text-gray-400",
              today && "bg-orange-300",
              today && exercise.has(date.format("MM-DD-YYYY")) && "bg-blue-300",
              "grid place-items-center size-9 rounded-full relative"
            )}
          >
            <span className="absolute bg-inherit -top-6 left-0 right-0 -bottom-0 rounded-full grid items-start justify-center -z-50 pt-2">
              B1
            </span>
            <p>{date.date()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
