import { db } from "@/lib/firebase";
import { classes } from "@/lib/utils";
import dayjs from "dayjs";
import { User } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import { BsLightningCharge } from "react-icons/bs";
import LightBulb from "./lightbulb";
interface TagsProps {
  tags: string[];
  user: User | null | undefined;
  params: { day: string };
  selectedTag: string;
  lighted: boolean;
  updateIsExercise?: () => void;
}

const Tags: React.FC<TagsProps> = ({
  tags,
  user,
  params,
  selectedTag,
  lighted,
  updateIsExercise,
}) => {
  const [showTags, setShowTags] = useState(false);
  const radius = 50;
  const spacing = 1.2;
  const handleSaveTag = async (tag: string) => {
    if (user) {
      const userRef = doc(
        db,
        user.uid,
        "exercise",
        "month",
        dayjs(params.day).format("MM-YYYY")
      );
      const docSnap = (await getDoc(userRef)).get(params.day);
      await updateDoc(userRef, {
        [params.day]: { ...docSnap, tag },
      });
    } else {
      return;
    }
  };
  return (
    <div className="relative">
      <motion.button
        className="w-8 grid place-content-center"
        onClick={() => setShowTags(!showTags)}
      >
        <div className="grid place-content-center">
          <div className="flex">
            <LightBulb lighted={lighted} />
          </div>
        </div>
      </motion.button>
      <AnimatePresence mode="wait">
        {showTags &&
          tags.map((tag, index) => {
            if (tag === "switch") {
              return (
                <motion.span
                  onClick={() => updateIsExercise && updateIsExercise()}
                  whileHover={{ scale: 1.2 }}
                  className="absolute text-lg"
                  style={{
                    top: `${radius}px`,
                    left: `${radius + 10}px`,
                  }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  key={tag}
                  exit={{ opacity: 0 }}
                >
                  <BsLightningCharge />
                </motion.span>
              );
            }
            const totalTags = tags.length - 1;
            const angle = -10 + (90 / (totalTags - 1)) * index * spacing;
            const angleInRadius = (angle * Math.PI) / 180;
            const x = radius * Math.cos(angleInRadius);
            const y = radius * Math.sin(angleInRadius) - 10;
            return (
              <motion.span
                onClick={() => handleSaveTag(tag.toUpperCase())}
                whileHover={{ border: "solid" }}
                key={tag}
                transition={{ duration: 0.2 }}
                initial={{ top: 0, left: 0 }}
                animate={{
                  top: `${y}px`,
                  left: `${x}px`,
                  opacity: 1,
                }}
                exit={{ top: "0px", left: "0px", opacity: 0 }}
                className={classes(
                  "absolute border border-dashed border-black w-7 aspect-square grid place-content-center rounded-full text-xs capitalize",
                  tag.toUpperCase() === selectedTag && "bg-[#fdba74]"
                )}
              >
                {tag}
              </motion.span>
            );
          })}
      </AnimatePresence>
    </div>
  );
};

export default Tags;
