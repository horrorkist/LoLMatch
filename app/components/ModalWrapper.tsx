import { motion } from "framer-motion";
import { ModalVariant } from "../../lib/client/variants";

export default function ModalWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={ModalVariant}
      initial={"initial"}
      animate={"animate"}
      exit={"exit"}
      transition={{ duration: 0.1, ease: "easeIn" }}
      onClick={(e) => e.stopPropagation()}
      className={`flex text-gray-300 rounded-md select-none min-w-min bg-slate-500 modal ${className}`}
    >
      {children}
    </motion.div>
  );
}
