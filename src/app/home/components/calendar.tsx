import { db } from "@/lib/firebase";
import { getLatestRecord, getSearchParamsMonth } from "@/lib/utils";
import dayjs from "dayjs";
import { User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Days from "./calendarDays";
import { useHomeContext } from "./homeContext";
import MonthNavigation from "./monthNavigation";

const Week = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="grid grid-cols-7 place-items-center gap-y-8 p-4">
      {days.map((day, index) => (
        <div
          className="p-2 text-sm rounded-full grid place-content-center"
          key={index}
        >
          {day}
        </div>
      ))}
    </div>
  );
};

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
  const {
    recordStack,
    setRecordStack,
    prevRecord,
    setPrevRecord,
    exercise,
    setExercise,
  } = useHomeContext();
  const searchParam = useSearchParams();
  const month = getSearchParamsMonth(searchParam);

  const fetchExercises = async () => {
    const docRef = doc(
      db,
      user.uid,
      "exercise",
      "month",
      dayjs().month(month).format("MM-YYYY")
    );
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(docRef, {});
    } else {
      if (!recordStack.includes(month)) {
        const data = docSnap.data();
        setExercise({ ...exercise, ...data });
        setRecordStack([...recordStack, month]);
        if (
          month === dayjs().month() &&
          Object.entries(prevRecord).length < 1
        ) {
          setPrevRecord(getLatestRecord(data));
        }
      }
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [searchParam]);

  return (
    <div className="flex flex-col mx-auto p-2 bg-neutral-100 rounded-md ">
      <MonthNavigation />
      <Week />
      <Days month={month} />
    </div>
  );
};

export default Calendar;