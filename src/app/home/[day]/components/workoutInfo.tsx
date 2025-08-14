import React from "react";
import { FiDelete } from "react-icons/fi";
import { CardioType, TrainingType } from "../page";

type WorkoutInfoProps = {
  info: TrainingType | CardioType;
  deleteExercise: (exercise: string) => void;
};

export const isCardio = (
  info: TrainingType | CardioType
): info is CardioType => {
  return (info as CardioType).duration !== undefined;
};

const CardioInfo: React.FC<{ info: CardioType }> = ({ info }) => (
  <div className="flex-1">
    <div className="flex justify-between items-center">
      <h1 className="text-lg font-bold mb-2 capitalize">{info.name}</h1>
      <p className="text-gray-500">
        <span>Est. kcal: </span>
        {((Number(info.heartRate) - 70) / 100) * 8 * Number(info.duration)}
      </p>
    </div>
    <div className="flex text-neutral-content">
      <p>Duration: {info.duration} min</p>
      <p className="mx-auto">Heart Rate: {info.heartRate} bpm</p>
    </div>
  </div>
);

const TrainingInfo: React.FC<{ info: TrainingType }> = ({ info }) => (
  <div className="flex-1">
    <div className="flex justify-between items-center">
      <h1 className="text-lg font-bold mb-2 capitalize">{info.name}</h1>
      <p className="text-neutral-content opacity-55">
        {`V: ${Number(info.weight) * Number(info.reps) * Number(info.sets)}`}
      </p>
    </div>
    <div className="flex justify-between text-neutral-content">
      <p>Weight: {info.weight} lb</p>
      <p>Reps: {info.reps}</p>
      <p>Sets: {info.sets}</p>
    </div>
  </div>
);

const WorkoutInfo: React.FC<WorkoutInfoProps> = ({ info, deleteExercise }) => {
  return (
    <article
      key={info.name}
      className="my-4 p-4 bg-neutral text-neutral-content rounded-sm shadow-md flex justify-between"
    >
      {isCardio(info) ? (
        <CardioInfo info={info} />
      ) : (
        <TrainingInfo info={info} />
      )}
      <button
        className="w-10 flex items-center justify-end cursor-pointer"
        onClick={() => deleteExercise(info.name)}
        aria-label={`Delete ${info.name} exercise`}
      >
        <FiDelete size={18} className="text-warning" />
      </button>
    </article>
  );
};

export default WorkoutInfo;
