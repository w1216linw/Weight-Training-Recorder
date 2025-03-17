import Modal from "@/app/components/modal";
import { db } from "@/lib/firebase";
import dayjs from "dayjs";
import { User } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import { BsLightningCharge } from "react-icons/bs";
import { FaRunning } from "react-icons/fa";
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
const RADIUS: number = 60;
// Calculate the position of a tag in a circular layout
const calculatePosition = (index: number, totalTags: number) => {
  const adjustedRadius = RADIUS + (totalTags < 5 ? 0 : totalTags - 5) * 3;
  const startAngle = 0;
  const endAngle = startAngle + 360;
  const angleStep = (endAngle - startAngle) / (totalTags - 1);
  const angle = startAngle + index * angleStep;
  const angleInRadius = (angle * Math.PI) / 360;
  const x = adjustedRadius * Math.cos(angleInRadius);
  const y = adjustedRadius * Math.sin(angleInRadius);
  return { x, y };
};
type TagContextMenuProps = {
  x: number;
  y: number;
  open: boolean;
  close: () => void;
  reset: () => void;
};

const TagContextMenu: React.FC<TagContextMenuProps> = ({
  x,
  y,
  open,
  close,
  reset,
}) => {
  if (!open) return null;
  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => e.stopPropagation()}
      className="fixed w-[120px] z-1100 h-max flex flex-col items-center bg-black text-white py-2 rounded-md shadow-lg"
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
          reset();
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
      <AnimatePresence mode="wait">
        {!showTags && (
          <motion.button
            className="w-8 grid place-content-center absolute bottom-0 left-0 translate-y-1/2"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            onClick={handleShowTags}
          >
            <div className="grid place-content-center cursor-pointer">
              <div className="flex">
                <LightBulb lighted={lighted} />
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
      <Modal showModal={showTags} closeModal={handleShowTags} size="md">
        <div className="h-64 grid place-items-center grid-rows-3">
          <motion.div onClick={handleShowTags} className="relative row-span-2">
            <button className="scale-[3]">
              <LightBulb lighted={lighted} />
            </button>
            <AnimatePresence mode="wait">
              {showTags &&
                tags.map((tag, index) => {
                  const { x, y } = calculatePosition(index, tags.length);
                  return (
                    <motion.span
                      onContextMenu={handleContextMenu}
                      role="button"
                      aria-label="tag for body part or exercise group"
                      tabIndex={0}
                      onClick={() => handleSaveTag(tag.toUpperCase())}
                      whileFocus={{ scale: 1.1, borderWidth: "1px" }}
                      whileHover={{ scale: 1.1, borderWidth: "1px" }}
                      whileTap={{ scale: 0.9 }}
                      key={tag}
                      transition={{ duration: 0.2 }}
                      initial={{ top: 0, left: 0 }}
                      animate={{
                        top: `${y}px`,
                        left: `${x - 4}px`,
                        opacity: 1,
                        borderWidth: "0px 0px 1px",
                      }}
                      exit={{ top: "0px", left: "0px", opacity: 0 }}
                      className="absolute w-8 aspect-square grid place-content-center capitalize"
                      style={{
                        borderColor:
                          tag.toUpperCase() === selectedTag
                            ? "var(--color-secondary)"
                            : "var(--color-secondary-content)",
                        color:
                          tag.toUpperCase() === selectedTag
                            ? "var(--color-secondary)"
                            : "var(--color-secondary-content)",
                      }}
                    >
                      {tag === "cardio" ? <FaRunning size={16} /> : tag}
                    </motion.span>
                  );
                })}
            </AnimatePresence>
          </motion.div>
          <motion.button
            onClick={() => updateIsExercise && updateIsExercise()}
            role="button"
            aria-label="toggle exercise sign"
            tabIndex={0}
            whileHover={{
              scale: 1.1,
            }}
            whileTap={{ scale: 0.9 }}
            className="btn btn-secondary btn-soft"
          >
            <BsLightningCharge />
          </motion.button>
        </div>
      </Modal>
      {contextMenu.open && (
        <TagContextMenu
          {...contextMenu}
          reset={() => handleSaveTag("")}
          close={() => setContextMenu({ x: 0, y: 0, open: false })}
        />
      )}
    </div>
  );
};

export default Tags;
