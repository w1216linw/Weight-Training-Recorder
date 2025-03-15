import { db } from "@/lib/firebase";
import { getLatestRecord, getSearchParamsMonth } from "@/lib/utils";
import dayjs from "dayjs";
import { User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useHomeContext } from "../../contexts/homeContext";
import Days from "./calendarDays";
import MonthNavigation from "./monthNavigation";

const Week = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="grid grid-cols-7 place-items-center gap-y-8 p-4 text-neutral">
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
    <div className="flex flex-col mx-auto p-2 bg-neutral-content rounded-md">
      <MonthNavigation />
      <Week />
      <Days month={month} />
    </div>
  );
};

export default Calendar;
