import { AnimatePresence, motion } from "motion/react";
import React from "react";

type ModalProps = {
  children: React.ReactNode;
  showModal: boolean;
  closeModal: () => void;
};

const Modal: React.FC<ModalProps> = ({ children, showModal, closeModal }) => {
  if (!showModal) return null;
  return (
    <AnimatePresence>
      {showModal && (
        <>
          <motion.div
            onClick={closeModal}
            transition={{ duration: 0.2 }}
            initial={{
              backdropFilter: "blur(0px)",
              opacity: 0,
            }}
            animate={{ backdropFilter: "blur(3px)", opacity: 1 }}
            exit={{ backdropFilter: "blur(0px)", opacity: 0 }}
            className="fixed z-[999] inset-0 bg-black/40"
          />
          <div className="fixed inset-x-5 p-2 z-[1000] bg-white">
            {children}
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
