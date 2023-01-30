import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Overlay({
  closeModal,
  children,
}: {
  closeModal: () => void;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
      animate={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      exit={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
      transition={{ duration: 0.1, ease: "easeIn" }}
      onClick={closeModal}
      className="fixed top-0 bottom-0 left-0 right-0 z-20 flex items-center justify-center w-screen h-screen overlay"
    >
      {children}
    </motion.div>
  );
}
