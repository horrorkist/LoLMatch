import { Team } from "@prisma/client";
import { motion } from "framer-motion";

interface RecruitPostProps {
  onClick?: () => void;
  team: Team;
  className?: string;
  [key: string]: any;
}

export default function RecruitPost({
  onClick,
  team,
  className,
  rest,
}: RecruitPostProps) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={className}
      {...rest}
    >
      <div>
        <span>{team.name}</span>
        <span>{team.positions}</span>
        <span>{team.minTier}</span>
        <span>{team.maxTier}</span>
        <span>{team.qType}</span>
      </div>
    </motion.li>
  );
}
