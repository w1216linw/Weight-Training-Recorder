import { db } from "@/lib/firebase";
import { classes, generateDate, getDate } from "@/lib/utils";
import { User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";

const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getBgColor = (
  todayAndExercise: boolean,
  notTodayAndExercise: boolean,
  today: boolean
) => {
  // today and exercise
  if (todayAndExercise) {
    return "bg-blue-300";
  } else if (notTodayAndExercise) {
    return "bg-green-300";
  } else if (today) {
    return "bg-orange-300";
  } else {
    return "";
  }
};

const Calendar = ({ user }: { user: FirebaseUser }) => {
  const [exercise, setExercise] =
    useState<Record<string, { isExercise: boolean; tag: string }>>();
  const dates = generateDate();
  const fetchExercises = async () => {
    const docRef = doc(db, user.uid, "exercise", "month", getDate("MM-YYYY"));
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(docRef, {});
    } else {
      const data = docSnap.data();
      setExercise(data);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  return (
    <div className="max-w-2xl flex flex-col mx-auto">
      <div className="relative flex justify-center items-center">
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
              getBgColor(
                today &&
                  !!exercise &&
                  exercise[date.format("YYYY-MM-DD")]?.isExercise,
                !!exercise && exercise[date.format("YYYY-MM-DD")]?.isExercise,
                today
              ),

              !currentMonth && "text-gray-400",
              "grid place-items-center size-9 rounded-full relative"
            )}
          >
            {!!exercise && exercise[date.format("YYYY-MM-DD")]?.tag && (
              <span className="absolute bg-inherit -top-6 left-0 right-0 -bottom-0 rounded-full grid items-start justify-center -z-50 pt-2 uppercase">
                {exercise[date.format("YYYY-MM-DD")]?.tag}
              </span>
            )}
            <p>{date.date()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
