import { debounce } from "lodash";
import { motion } from "motion/react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { CompoundMovement } from "./compoundTraining";
const compoundMovement: CompoundMovement[] = [
  "bench press",
  "press push",
  "deadlift",
  "squat",
] as const;
const CompoundTrainingTabs = ({
  active,
  setActive,
}: {
  setActive: Dispatch<SetStateAction<CompoundMovement>>;
  active: CompoundMovement;
}) => {
  const tabsRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(0);
  const [position, setPosition] = useState(0);

  const updateWidth = () => {
    if (tabsRef.current) {
      const w = Math.floor(
        tabsRef.current.offsetWidth / compoundMovement.length
      );
      setWidth(w);
    }
  };

  useEffect(() => {
    updateWidth();
    const debounceUpdateWidth = debounce(updateWidth, 200);
    window.addEventListener("resize", debounceUpdateWidth);
    return () => window.removeEventListener("resize", debounceUpdateWidth);
  }, []);
  return (
    <div className={`flex relative my-1`} ref={tabsRef}>
      {compoundMovement.map((elem, index) => (
        <button
          key={elem}
          className="w-full py-1 px-2 rounded-md capitalize hover:outline-1"
          onClick={() => {
            setActive(elem);
            setPosition(Math.floor(width * index));
          }}
        >
          {elem}
        </button>
      ))}
      <motion.div
        className="
            shadow-inner shadow-gray-400 rounded-md absolute left-0 top-0 h-full"
        style={{
          width: width,
        }}
        animate={{
          x: position,
        }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
};

export default CompoundTrainingTabs;
