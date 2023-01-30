import { User } from "@prisma/client";
import { motion } from "framer-motion";

interface RecruitPostProps {
  onClick?: () => void;
  user: User;
  className?: string;
  [key: string]: any;
}

export default function JoinPost({
  onClick,
  className,
  user,
  ...rest
}: RecruitPostProps) {
  return (
    <motion.li
      onClick={onClick}
      className={className}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      {...rest}
    >
      <div>
        <span>{user.summonerName}</span>
        <span>{user.positions}</span>
        <span>{user.tier}</span>
      </div>
    </motion.li>
  );
}
