import Modal from "@/app/components/modal";
import { db } from "@/lib/firebase";
import { classes, handleError } from "@/lib/utils";
import { User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { motion } from "motion/react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { GiRun, GiWeightLiftingUp } from "react-icons/gi";
import { CardioType, TrainingType } from "../page";
import { isCardio } from "./workoutInfo";

type ExerciseType = "training" | "cardio";

type NewExerciseProps = {
  user: FirebaseUser;
  date: string;
  fetchDetail: () => void;
  dragConstraintsRef: React.RefObject<HTMLDivElement>;
};

const trainingState: TrainingType = {
  type: "training",
  name: "",
  weight: "",
  reps: "",
  sets: "",
};

const cardioState: CardioType = {
  type: "cardio",
  name: "",
  duration: "",
  heartRate: "",
};

const CardioInput: React.FC<{
  exercise: CardioType;
  setExercise: React.Dispatch<React.SetStateAction<CardioType>>;
}> = ({ exercise, setExercise }) => (
  <div className="flex gap-2">
    <input
      type="text"
      placeholder="Duration (min)"
      value={exercise.duration}
      onChange={(e) => setExercise({ ...exercise, duration: e.target.value })}
      className="px-4 py-2 w-1/2 rounded-md border border-gray-300"
    />
    <input
      type="text"
      placeholder="Heart Rate (avg per min)"
      value={exercise.heartRate}
      onChange={(e) => setExercise({ ...exercise, heartRate: e.target.value })}
      className="px-4 py-2 w-1/2 rounded-md border border-gray-300"
    />
  </div>
);

const TrainingInput: React.FC<{
  exercise: TrainingType;
  setExercise: React.Dispatch<React.SetStateAction<TrainingType>>;
}> = ({ exercise, setExercise }) => (
  <div className="flex">
    <input
      type="text"
      placeholder="Weight"
      value={exercise.weight}
      onChange={(e) => setExercise({ ...exercise, weight: e.target.value })}
      className="px-4 py-2 w-1/2 mr-2 rounded-md border border-neutral text-neutral focus:outline-none"
    />
    <input
      type="text"
      placeholder="Reps"
      value={exercise.reps}
      onChange={(e) => setExercise({ ...exercise, reps: e.target.value })}
      className="px-4 py-2 w-1/2 mr-2 rounded-md border border-neutral text-neutral focus:outline-none"
    />
    <input
      type="text"
      placeholder="Sets"
      value={exercise.sets}
      onChange={(e) => setExercise({ ...exercise, sets: e.target.value })}
      className="px-4 py-2 w-1/2 rounded-md border border-neutral text-neutral shadow-sm focus:outline-none"
    />
  </div>
);

const NewExercise: React.FC<NewExerciseProps> = ({
  user,
  date,
  fetchDetail,
  dragConstraintsRef,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const whileDrag = () => {
    setIsDragging(true);
  };
  const endDrag = () => {
    setIsDragging(false);
  };
  const handleModalOpen = () => {
    if (!isDragging) {
      setShowModal(true);
    }
  };
  const [exerciseType, setExerciseType] = useState<ExerciseType>("training");
  const handleToggleExerciseType = () => {
    setExerciseType((prev) => (prev === "training" ? "cardio" : "training"));
    setExerciseData(exerciseType === "training" ? cardioState : trainingState);
  };
  const [exerciseData, setExerciseData] = useState<TrainingType | CardioType>(
    trainingState
  );
  const isValidData = () => {
    if (isCardio(exerciseData)) {
      return exerciseData.name !== "" && exerciseData.duration !== "";
    } else {
      return (
        exerciseData.name !== "" &&
        exerciseData.weight !== "" &&
        exerciseData.reps !== "" &&
        exerciseData.sets !== ""
      );
    }
  };
  const [showModal, setShowModal] = useState(false);
  const closeModal = () => {
    setShowModal(false);
  };

  const checkMovement = async (exercise: TrainingType, date: string) => {
    const formattedName = exercise.name.toLowerCase().trim();
    if (
      ["bench press", "press push", "deadlift", "squat"].includes(formattedName)
    ) {
      const prRef = doc(db, user.uid, "exercise", "compound", formattedName);
      const graphRef = doc(
        db,
        user.uid,
        "exercise",
        "compound",
        formattedName,
        "graph",
        "process"
      );
      const prSnap = (await getDoc(prRef)).data();
      await setDoc(
        graphRef,
        {
          [date]: {
            weight: exercise.weight,
            reps: exercise.reps,
            sets: exercise.sets,
          },
        },
        { merge: true }
      );
      if (!prSnap?.pr) {
        await setDoc(
          prRef,
          {
            pr: {
              weight: exercise.weight,
              date: date,
            },
          },
          { merge: true }
        );
      } else if (Number(prSnap.pr.weight) <= Number(exercise.weight)) {
        await setDoc(
          prRef,
          {
            prevPr: prSnap.pr,
            pr: {
              weight: exercise.weight,
              date: date,
            },
          },
          { merge: true }
        );
      }
    }
  };

  const resetExercise = () => {
    setExerciseData(exerciseType === "training" ? trainingState : cardioState);
  };

  const [error, setError] = useState("");
  const update = async () => {
    try {
      const docRef = doc(db, user.uid, "exercise", "detail", date);
      if (!isValidData()) {
        throw new Error("Please fill all the fields");
      }
      await setDoc(
        docRef,
        {
          [exerciseData.name.toLowerCase().trim()]: exerciseData,
        },
        { merge: true }
      );
      if (!isCardio(exerciseData)) {
        checkMovement(exerciseData, date);
      }
      resetExercise();
      fetchDetail();
    } catch (error) {
      handleError(error, setError);
    }
  };

  return (
    <>
      <Modal showModal={showModal} closeModal={closeModal}>
        <div className="flex-1">
          <div className="mb-2 flex gap-2">
            <div
              role="button"
              tabIndex={0}
              aria-label="toggle exercise type"
              className={classes(
                "h-full w-10 text-2xl grid p-2 place-content-center rounded-md ",
                exerciseType === "training"
                  ? " text-primary bg-primary-content"
                  : " text-accent bg-accent-content"
              )}
              onClick={handleToggleExerciseType}
            >
              <motion.span
                className=""
                initial={false}
                animate={{ rotateY: exerciseType === "training" ? 0 : 180 }}
                transition={{ duration: 0.2 }}
              >
                {exerciseType === "training" ? (
                  <GiWeightLiftingUp />
                ) : (
                  <GiRun />
                )}
              </motion.span>
            </div>
            <input
              type="text"
              placeholder="Name"
              value={exerciseData.name}
              onChange={(e) =>
                setExerciseData({
                  ...exerciseData,
                  name: e.target.value,
                })
              }
              className="px-4 py-2 w-full rounded-md border border-neutral text-neutral focus:outline-none"
            />
          </div>
          {exerciseType === "training" ? (
            <TrainingInput
              exercise={exerciseData as TrainingType}
              setExercise={
                setExerciseData as React.Dispatch<
                  React.SetStateAction<TrainingType>
                >
              }
            />
          ) : (
            <CardioInput
              exercise={exerciseData as CardioType}
              setExercise={
                setExerciseData as React.Dispatch<
                  React.SetStateAction<CardioType>
                >
              }
            />
          )}
          <div className="mt-2 flex justify-center gap-2">
            <button
              className="uppercase w-2/5 p-2 bg-warning text-warning-content border rounded-md"
              onClick={closeModal}
            >
              cancel
            </button>
            <button
              onClick={update}
              className="uppercase w-2/5 p-2 bg-success text-success-content border rounded-md"
            >
              save
            </button>
          </div>
        </div>

        {error !== "" && (
          <div className="flex py-2 bg-error text-error-content justify-center rounded-md my-1">
            {error}
          </div>
        )}
      </Modal>
      <motion.button
        onClick={handleModalOpen}
        drag
        dragConstraints={dragConstraintsRef}
        dragElastic={0}
        onDragStart={whileDrag}
        onDragEnd={endDrag}
        className="py-2 px-8 rounded-lg bg-success shadow-sm hover:bg-success/80 flex justify-center items-center mx-auto"
      >
        <FaPlus className="text-success-content text-[36px]" />
      </motion.button>
    </>
  );
};

export default NewExercise;
