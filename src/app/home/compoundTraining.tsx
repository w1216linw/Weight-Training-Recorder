import { db } from "@/lib/firebase";
import { classes, objToArray } from "@/lib/utils";
import { User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import Chart from "./chart";

type CompoundMovement =
  | "pull up"
  | "bench press"
  | "squat"
  | "deadlift"
  | "Press push";

const compoundMovement: CompoundMovement[] = [
  "pull up",
  "bench press",
  "squat",
  "deadlift",
  "Press push",
];

type Weight = {
  weight: string;
  date: string;
};

type Volume = {
  weight: string;
  sets: string;
  reps: string;
};

type Movement = {
  pr?: Weight;
  graph?: {
    date: Volume;
  };
};

type Process = {
  "pull up"?: Movement;
  "bench press"?: Movement;
  squat?: Movement;
  deadlift?: Movement;
  "Press push"?: Movement;
};

const CompoundTraining = ({ user }: { user: FirebaseUser }) => {
  const [active, setActive] = useState<CompoundMovement>("bench press");
  const [process, setProcess] = useState<Process>({});

  const fetchProcess = async () => {
    const prRef = doc(db, user.uid, "exercise", "compound", active);
    const graphRef = doc(
      db,
      user.uid,
      "exercise",
      "compound",
      active,
      "graph",
      "process"
    );
    const prSnap = (await getDoc(prRef)).data();
    const graphSnap = (await getDoc(graphRef)).data();

    setProcess({ ...process, [active]: { ...prSnap, graph: graphSnap } });
  };

  useEffect(() => {
    if (!(active in process)) fetchProcess();
    else return;
  }, [active]);

  return (
    <div className="mb-2 p-2 bg-neutral-100 rounded-md">
      <div className="flex justify-between">
        {compoundMovement.map((elem, index) => (
          <button
            key={index}
            className={classes(
              active === elem ? "shadow-inner shadow-gray-400" : "",
              "p-1 rounded-md capitalize hover:outline-1"
            )}
            onClick={() => {
              setActive(elem);
            }}
          >
            {elem}
          </button>
        ))}
      </div>
      {active in process && (
        <div className="flex gap-2 p-2">
          <h1>PR:</h1>
          <p>{process[active]?.pr?.weight} lb</p>
          <p>{process[active]?.pr?.date}</p>
        </div>
      )}
      {active in process && !!process[active]?.graph ? (
        <div className="bg-neutral-100">
          <Chart data={objToArray("date", process[active]?.graph)} />
        </div>
      ) : (
        <div className="grid place-items-center h-[300px]">no data</div>
      )}
    </div>
  );
};

export default CompoundTraining;
