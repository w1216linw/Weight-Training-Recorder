"use client";
import { getSearchParamsMonth } from "@/lib/utils";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaGreaterThan, FaLessThan } from "react-icons/fa6";

const MotionLink = motion.create(Link);

const MonthNavigation = () => {
  const searchParam = useSearchParams();

  const month = getSearchParamsMonth(searchParam);
  const monthName = dayjs().month(month).format("MMMM");

  const [direction, setDirection] = useState<"left" | "right">("left");
  return (
    <nav className="relative flex justify-between items-center text-neutral" aria-label="Month navigation">
      <MotionLink
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        href={`/home?month=${month - 1}`}
        onClick={() => setDirection("left")}
        aria-label="Previous month"
      >
        <FaLessThan />
      </MotionLink>

      <AnimatePresence mode="wait">
        <motion.h2
          key={month}
          initial={{ opacity: 0.3, x: direction === "left" ? 30 : -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0.3, x: direction === "left" ? -20 : 20 }}
          transition={{ duration: 0.2 }}
          className="font-bold text-xl"
        >
          {monthName}
        </motion.h2>
      </AnimatePresence>
      <MotionLink
        onClick={() => setDirection("right")}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        href={`/home?month=${month + 1}`}
        aria-label="Next month"
      >
        <FaGreaterThan />
      </MotionLink>
    </nav>
  );
};

export default MonthNavigation;
