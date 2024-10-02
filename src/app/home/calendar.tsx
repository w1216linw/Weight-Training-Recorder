import { db } from "@/lib/firebase";
import { classes, generateDate, getDate, getLatestRecord } from "@/lib/utils";
import dayjs from "dayjs";
import { User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { FaGreaterThan, FaLessThan } from "react-icons/fa6";
import { useHomeContext } from "./homeContext";

const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getMonth = (searchParam: ReadonlyURLSearchParams) => {
  const month = searchParam.get("month");
  if (!month) return dayjs().month();
  else return Number(month);
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

  const dates = generateDate(getMonth(searchParam));

  const fetchExercises = async () => {
    const month = getMonth(searchParam);
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
      const key = getMonth(searchParam);
      if (!recordStack.includes(key)) {
        const data = docSnap.data();
        setExercise({ ...exercise, ...data });
        setRecordStack([...recordStack, key]);
        if (key === dayjs().month() && Object.entries(prevRecord).length < 1) {
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
      <div className="relative flex justify-between items-center">
        <Link href={`/home?month=${getMonth(searchParam) - 1}`}>
          <FaLessThan />
        </Link>
        <h1 className="font-bold text-xl">
          {!!searchParam.get("month")
            ? dayjs().month(+searchParam.get("month")!).format("MMMM")
            : getDate("MMMM")}
        </h1>
        <Link href={`/home?month=${getMonth(searchParam) + 1}`}>
          <FaGreaterThan />
        </Link>
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
              "grid place-items-center size-9 rounded-full relative "
            )}
          >
            {!!exercise && exercise[date.format("YYYY-MM-DD")]?.tag && (
              <span className="absolute bg-inherit -top-6 left-0 right-0 -bottom-0  rounded-full grid items-start justify-center pt-2 uppercase">
                {exercise[date.format("YYYY-MM-DD")].tag}
              </span>
            )}
            <p className="z-10">{date.date()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
