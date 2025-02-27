import React from "react";
import { FiDelete } from "react-icons/fi";
import { CardioType, TrainingType } from "../page";

type WorkoutInfoProps = {
  info: TrainingType | CardioType;
  deleteExercise: (exercise: string) => void;
};

const isCardio = (info: TrainingType | CardioType): info is CardioType => {
  return (info as CardioType).duration !== undefined;
};

const CardioInfo: React.FC<{ info: CardioType }> = ({ info }) => (
  <p className="text-gray-700">Duration: {info.duration} min</p>
);

const TrainingInfo: React.FC<{ info: TrainingType }> = ({ info }) => (
  <div className="flex-1">
    <div className="flex justify-between items-center">
      <h1 className="text-lg font-bold mb-2 capitalize">{info.name}</h1>
      <p className="text-gray-500">
        {`V: ${Number(info.weight) * Number(info.reps) * Number(info.sets)}`}
      </p>
    </div>
    <div className="flex justify-between">
      <p className="text-gray-700">Weight: {info.weight} lb</p>
      <p className="text-gray-700">Reps: {info.reps}</p>
      <p className="text-gray-700">Sets: {info.sets}</p>
    </div>
  </div>
);

const WorkoutInfo: React.FC<WorkoutInfoProps> = ({ info, deleteExercise }) => {
  return (
    <div
      key={info.name}
      className="my-4 p-4 border rounded shadow-md flex justify-between"
    >
      {isCardio(info) ? (
        <CardioInfo info={info} />
      ) : (
        <TrainingInfo info={info} />
      )}
      <button
        className="w-10 flex items-center justify-end"
        onClick={() => deleteExercise(info.name)}
      >
        <FiDelete size={18} className="text-red-400" />
      </button>
    </div>
  );
};

export default WorkoutInfo;
