import dayjs from "dayjs";
import { Dispatch, SetStateAction } from "react";

export const validate_inputs = (email: string, password: string) => {
  if (email.length < 10) {
    throw new Error("Invalid email");
  }
  if (password.length < 6) {
    throw new Error("password is too short");
  }
  return;
};

export const handleError = (
  e: any,
  setError: Dispatch<SetStateAction<string>>
) => {
  if (e instanceof Error) {
    setError(e.message);
  } else {
    setError("An unknown error occurred.");
  }
};

export const getDate = (format: string) => {
  return dayjs().format(format);
};

export const generateDate = (
  month = dayjs().month(),
  year = dayjs().year()
) => {
  const firstDate = dayjs().month(month).year(year).startOf("month");
  const lastDate = dayjs().month(month).year(year).endOf("month");
  const arrayOfDate = [];
  for (let i = 0; i < firstDate.day(); i++) {
    arrayOfDate.push({
      date: firstDate.day(i),
      currentMonth: false,
      today: false,
    });
  }
  for (let i = firstDate.date(); i <= lastDate.date(); i++) {
    arrayOfDate.push({
      date: firstDate.date(i),
      currentMonth: true,
      today:
        firstDate.date(i).toDate().toDateString() ===
        dayjs().toDate().toDateString(),
    });
  }

  for (let i = lastDate.day() + 1; i < 7; i++) {
    arrayOfDate.push({
      date: lastDate.day(i),
      currentMonth: false,
      today: false,
    });
  }

  return arrayOfDate;
};

type classesParams = string | boolean;

export const classes = (...classes: classesParams[]) => {
  return classes.filter(Boolean).join(" ");
};

export const makeSet = (data: Record<string, boolean>) => {
  return new Set(
    Object.entries(data)
      .filter(([_, data]) => data === true)
      .map(([key, _]) => key)
  );
};
