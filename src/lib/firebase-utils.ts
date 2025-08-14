import { doc, DocumentReference } from "firebase/firestore";
import { db } from "./firebase";

export const getUserDocRef = (uid: string) => doc(db, uid, "data");

export const getExerciseDocRef = (uid: string, collection: string, document: string) =>
  doc(db, uid, "exercise", collection, document);

export const getCompoundExerciseRef = (uid: string, exercise: string) =>
  doc(db, uid, "exercise", "compound", exercise);

export const getIsolationExerciseRef = (uid: string, exercise: string) =>
  doc(db, uid, "exercise", "isolation", exercise);

export const getDayExerciseRef = (uid: string, day: string) =>
  doc(db, uid, "exercise", "day", day);