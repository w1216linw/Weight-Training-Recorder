import { db } from "@/lib/firebase";
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
  setSelectedTag: (tag: string) => void;
}

// The radius for positioning tags in a circular layout
const RADIUS: number = 50;
// The multiplier for the angle between tags
const SPACING: number = 1.2;
// Calculate the position of a tag in a circular layout
const calculatePosition = (index: number, totalTags: number) => {
  const angle = -10 + (90 / (totalTags - 1)) * index * SPACING;
  const angleInRadius = (angle * Math.PI) / 180;
  const x = RADIUS * Math.cos(angleInRadius);
  const y = RADIUS * Math.sin(angleInRadius) - 10;
  return { x, y };
};
type TagContextMenuProps = {
  x: number;
  y: number;
  open: boolean;
  close: () => void;
  fc: () => void;
};

const TagContextMenu: React.FC<TagContextMenuProps> = ({
  x,
  y,
  open,
  close,
  fc,
}) => {
  if (!open) return null;
  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => e.stopPropagation()}
      className="fixed w-[120px] h-max flex flex-col items-center bg-black text-white py-2 rounded-md shadow-lg"
      style={{
        top: `max(0px, min(${y}px, calc(100vh - 80px)))`,
        left: `max(0px, min(${x}px, calc(100vw - 120px)))`,
      }}
    >
      <motion.button
        className="w-full text-white  uppercase"
        whileHover={{ background: "white", color: "black", width: "100%" }}
        initial={{ background: "black", color: "white" }}
        transition={{ duration: 0.2 }}
        onClick={() => {
          fc();
          close();
        }}
      >
        unselect
      </motion.button>
    </div>
  );
};

const Tags: React.FC<TagsProps> = ({
  tags,
  user,
  params,
  selectedTag,
  lighted,
  updateIsExercise,
  setSelectedTag,
}) => {
  const [showTags, setShowTags] = useState(false);
  const [contextMenu, setContextMenu] = useState({ x: 0, y: 0, open: false });
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, open: true });
  };
  const handleShowTags = () => {
    setShowTags(!showTags);
    if (showTags) {
      setContextMenu({ x: 0, y: 0, open: false });
    }
  };
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
      setSelectedTag(tag);
    } else {
      return;
    }
  };

  return (
    <div className="relative">
      <motion.button
        className="w-8 grid place-content-center"
        onClick={handleShowTags}
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
                    top: `${RADIUS}px`,
                    left: `${RADIUS + 10}px`,
                  }}
                  role="button"
                  aria-label="toggle exercise sign"
                  tabIndex={0}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  key={tag}
                  exit={{ opacity: 0 }}
                >
                  <BsLightningCharge />
                </motion.span>
              );
            }
            const { x, y } = calculatePosition(index, tags.length - 1);
            return (
              <motion.span
                onContextMenu={handleContextMenu}
                role="button"
                aria-label="tag for body part or exercise group"
                tabIndex={0}
                onClick={() => handleSaveTag(tag.toUpperCase())}
                whileHover={{ border: "solid" }}
                key={tag}
                transition={{ duration: 0.2 }}
                initial={{ top: 0, left: 0, border: "dashed" }}
                animate={{
                  top: `${y}px`,
                  left: `${x}px`,
                  opacity: 1,
                }}
                exit={{ top: "0px", left: "0px", opacity: 0 }}
                className="absolute w-7 aspect-square grid place-content-center rounded-full text-xs capitalize"
                style={{
                  borderColor:
                    tag.toUpperCase() === selectedTag ? "#fdba74" : "#000",
                  color: tag.toUpperCase() === selectedTag ? "#fdba74" : "#000",
                }}
              >
                {tag}
              </motion.span>
            );
          })}
      </AnimatePresence>
      {contextMenu.open && (
        <TagContextMenu
          {...contextMenu}
          fc={() => handleSaveTag("")}
          close={() => setContextMenu({ x: 0, y: 0, open: false })}
        />
      )}
    </div>
  );
};

export default Tags;
