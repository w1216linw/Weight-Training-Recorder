import { db } from "@/lib/firebase";
import { classes, objToArray } from "@/lib/utils";
import { User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import Chart from "./chart";
import LoadingChart from "./loading-chart";

export type CompoundMovement =
  | "bench press"
  | "squat"
  | "deadlift"
  | "press push";

const compoundMovement: CompoundMovement[] = [
  "bench press",
  "press push",
  "deadlift",
  "squat",
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
  "bench press"?: Movement;
  squat?: Movement;
  deadlift?: Movement;
  "press push"?: Movement;
};

const CompoundTraining = ({ user }: { user: FirebaseUser }) => {
  const [active, setActive] = useState<CompoundMovement>("bench press");
  const [process, setProcess] = useState<Process>({});
  const [loading, setLoading] = useState(false);

  const fetchProcess = async () => {
    setLoading(true);
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
    setLoading(false);
    setProcess({ ...process, [active]: { ...prSnap, graph: graphSnap } });
  };

  useEffect(() => {
    if (!(active in process)) fetchProcess();
    else return;
  }, [active]);

  return (
    <div className="mb-2 p-2 bg-neutral-100 rounded-md w-full">
      <div className="flex justify-between">
        {compoundMovement.map((elem, index) => (
          <button
            key={index}
            className={classes(
              active === elem ? "shadow-inner shadow-gray-400" : "",
              "py-1 px-2 rounded-md capitalize hover:outline-1"
            )}
            onClick={() => {
              setActive(elem);
            }}
          >
            {elem}
          </button>
        ))}
      </div>
      {loading ? (
        <LoadingChart />
      ) : (
        <>
          {active in process && (
            <div className="flex gap-2 p-2">
              <h1>PR:</h1>
              <p>{process[active]?.pr?.weight} lb</p>
              <p>{process[active]?.pr?.date}</p>
            </div>
          )}
          <Chart data={objToArray("date", process[active]?.graph)} />
        </>
      )}
    </div>
  );
};

export default CompoundTraining;
