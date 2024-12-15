import { classes, generateDate } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useHomeContext } from "./homeContext";

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

const Days = ({ month }: { month: number }) => {
  const { exercise } = useHomeContext();
  const dates = generateDate(month);
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={month}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="grid grid-cols-7 place-items-center gap-y-8 p-4"
      >
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
      </motion.div>
    </AnimatePresence>
  );
};
export default Days;
