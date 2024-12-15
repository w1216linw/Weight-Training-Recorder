"use client";
import { getDate, getSearchParamsMonth } from "@/lib/utils";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaGreaterThan, FaLessThan } from "react-icons/fa6";

const MotionLink = motion.create(Link);
const MonthNavigation = () => {
  const searchParam = useSearchParams();
  const month = getSearchParamsMonth(searchParam);
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={month}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative flex justify-between items-center"
      >
        <MotionLink
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          href={`/home?month=${month - 1}`}
        >
          <FaLessThan />
        </MotionLink>
        <h1 className="font-bold text-xl">
          {!!month ? dayjs().month(month).format("MMMM") : getDate("MMMM")}
        </h1>
        <MotionLink
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          href={`/home?month=${month + 1}`}
        >
          <FaGreaterThan />
        </MotionLink>
      </motion.div>
    </AnimatePresence>
  );
};

export default MonthNavigation;
