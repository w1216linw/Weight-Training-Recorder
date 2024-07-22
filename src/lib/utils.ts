import { PrevRecord } from "@/app/home/homeContext";
import dayjs from "dayjs";
import { DocumentData } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";
import { encrypt } from "./jwt";

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

export const setSession = async (email: string, password: string) => {
  const session = await encrypt({ email, password });
  localStorage.setItem("wtr-local", session);
};

export const clearSession = () => {
  localStorage.removeItem("wtr-local");
};

export const objToArray = <T>(
  title: string,
  exercise: Record<string, Record<string, string>> | undefined
): T[] => {
  if (typeof exercise === "undefined") return [];
  else
    return Object.entries(exercise).map(([key, value]) => ({
      [title]: key,
      ...value,
    })) as T[];
};

export const getLatestRecord = (data: DocumentData) => {
  const latestRecord: PrevRecord = {};
  for (const date in data) {
    const { tag, isExercise } = data[date];

    if (isExercise) {
      if (!latestRecord[tag] || new Date(date) > new Date(latestRecord[tag])) {
        latestRecord[tag] = date;
      }
    }
  }

  return latestRecord;
};
