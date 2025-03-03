import { classes } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import React from "react";

type ModalProps = {
  children: React.ReactNode;
  showModal: boolean;
  closeModal: () => void;
  size?: "md" | "lg";
};

const Modal: React.FC<ModalProps> = ({
  size,
  children,
  showModal,
  closeModal,
}) => {
  if (!showModal) return null;
  return (
    <AnimatePresence mode="wait">
      {showModal && (
        <>
          <motion.div
            onClick={closeModal}
            transition={{ duration: 0.4 }}
            initial={{
              backdropFilter: "blur(0px)",
              opacity: 0,
            }}
            animate={{ backdropFilter: "blur(3px)", opacity: 1 }}
            exit={{ backdropFilter: "blur(0px)", opacity: 0 }}
            className="fixed z-[999] inset-0 bg-black/40"
          />
          <div
            className={classes(
              "fixed  p-2 z-[1000] bg-neutral-100 rounded-md",
              size === "md" ? "inset-x-16" : "inset-x-4"
            )}
          >
            {children}
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
