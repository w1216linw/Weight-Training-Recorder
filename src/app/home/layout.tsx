"use client";

import { useState } from "react";
import HomeContext, {
  ExerciseRecord,
  PrevRecord,
} from "./components/homeContext";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [prevRecord, setPrevRecord] = useState<PrevRecord>({});
  const [recordStack, setRecordStack] = useState<number[]>([]);
  const [exercise, setExercise] = useState<ExerciseRecord>({});
  return (
    <HomeContext.Provider
      value={{
        prevRecord,
        setPrevRecord,
        recordStack,
        setRecordStack,
        exercise,
        setExercise,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
}
