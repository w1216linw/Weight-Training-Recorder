import { motion } from "motion/react";
import { MdLightbulbOutline } from "react-icons/md";

const rayVariants = {
  initial: {
    height: 0,
  },
  animateOn: {
    height: 6,
    transition: {
      duration: 0.2,
    },
  },
  animateOff: {
    height: 0,
    transition: {
      duration: 0.2,
    },
  },
};
const LightBulb = ({ lighted }: { lighted: boolean }) => {
  return (
    <motion.div
      className="relative"
      animate={{ color: lighted ? "#fdba74" : "#000" }}
    >
      <MdLightbulbOutline className="size-5" />
      <div className="rotate-180 -translate-y-[1rem]">
        <motion.span
          variants={rayVariants}
          initial="initial"
          animate={lighted ? "animateOn" : "animateOff"}
          data-side="side"
          className="ray left-0 -top-1 rotate-45"
        />
        <motion.span
          variants={rayVariants}
          initial="initial"
          data-side="center"
          animate={lighted ? "animateOn" : "animateOff"}
          className="ray left-1/4 top-0 rotate-12"
        />
        <motion.span
          variants={rayVariants}
          initial="initial"
          animate={lighted ? "animateOn" : "animateOff"}
          data-side="center"
          className="ray right-1/4 top-0 -rotate-12"
        />
        <motion.span
          variants={rayVariants}
          initial="initial"
          animate={lighted ? "animateOn" : "animateOff"}
          data-side="side"
          className=" ray right-0 -top-1 -rotate-45"
        />
      </div>
    </motion.div>
  );
};

export default LightBulb;
