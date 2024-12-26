"use client";
import { createContext, ReactNode, useContext, useState } from "react";

export type PrevRecord = Record<string, string>;
export type ExerciseRecord = Record<
  string,
  { isExercise: boolean; tag: string }
>;

export type ContextType = {
  prevRecord: PrevRecord;
  setPrevRecord: React.Dispatch<React.SetStateAction<PrevRecord>>;
  recordStack: number[];
  setRecordStack: React.Dispatch<React.SetStateAction<number[]>>;
  exercise: ExerciseRecord;
  setExercise: React.Dispatch<React.SetStateAction<ExerciseRecord>>;
};

const defaultContext = {
  prevRecord: {},
  recordStack: [],
  exercise: {},
  setExercise: () => {},
  setPrevRecord: () => {},
  setRecordStack: () => {},
};

const HomeContext = createContext<ContextType>(defaultContext);

export const HomeProvider = ({ children }: { children: ReactNode }) => {
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
};

export const useHomeContext = () => useContext(HomeContext);

export default HomeContext;
