import { classes, generateDate } from "@/lib/utils";
import Link from "next/link";

const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = () => {
  const dates = generateDate();
  return (
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
            !currentMonth && "text-gray-400",
            today && "bg-orange-300",
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
  );
};

export default Calendar;
