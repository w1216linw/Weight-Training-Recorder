import { createContext, useContext } from "react";

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

export const useHomeContext = () => useContext(HomeContext);

export default HomeContext;
