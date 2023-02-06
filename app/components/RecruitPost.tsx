import { motion } from "framer-motion";
import Image from "next/image";
import { TeamWithMembers } from "../(userInfo)/team/page";
import { getPositionSVG } from "./positionSVG";
import TierImage from "./TierImage";
import TierRangeSelect from "./TierRangeSelect";
import UserLinkName from "./UserLinkName";

interface RecruitPostProps {
  onClick?: () => void;
  team: TeamWithMembers;
  className?: string;
  [key: string]: any;
}

const PositionArray = ["_", "Top", "Jungle", "Mid", "Bot", "Support"];
const TierArray = [
  "_",
  "Iron",
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Diamond",
  "Master",
  "Grandmaster",
  "Challenger",
];

export default function RecruitPost({
  onClick,
  team,
  className,
  ...rest
}: RecruitPostProps) {
  return (
    // <motion.li
    //   initial={{ opacity: 0, y: -50 }}
    //   animate={{ opacity: 1, y: 0 }}
    //   onClick={onClick}
    //   className={className}
    //   {...rest}
    // >
    //   <div>
    //     <span>{team.name}</span>
    //     <span>{team.positions}</span>
    //     <span>{team.minTier}</span>
    //     <span>{team.maxTier}</span>
    //     <span>{team.qType}</span>
    //   </div>
    // </motion.li>
    <motion.li
      onClick={onClick}
      className={`min-h-[60px] group flex items-center space-x-4 ${className}`}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      {...rest}
    >
      <p className="block w-32 overflow-hidden whitespace-nowrap text-ellipsis">
        {team?.name}
      </p>
      <div className="flex items-center space-x-3 w-[250px] h-full">
        {team?.chief?.RiotProfileIconId ? (
          <Image
            className="rounded-full"
            src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${team?.chief?.RiotProfileIconId}.png`}
            alt="Profile Icon"
            width={40}
            height={40}
          />
        ) : (
          <div className="w-[40px] h-[40px] rounded-full bg-slate-800 group-hover:bg-slate-500"></div>
        )}
        <UserLinkName className="flex-1 block overflow-hidden text-sm whitespace-nowrap text-ellipsis">
          {team?.chief?.summonerName}
        </UserLinkName>
        {team?.chief?.tier && team?.chief?.tier > 0 ? (
          <div className="relative flex flex-col items-center justify-between w-20 space-y-1">
            <p className="absolute -inset-y-3 text-[10px]">
              {TierArray[team?.chief?.tier]} {team?.chief?.rank}
            </p>
            <TierImage tier={team?.chief?.tier} width={30} height={30} />
          </div>
        ) : (
          <p className="w-20 text-center">언랭크</p>
        )}
      </div>
      <ul className="flex justify-center min-w-[160px]">
        {team?.positions &&
          JSON.parse(team.positions).map((position: number) => (
            <li key={position}>{getPositionSVG(position)}</li>
          ))}
      </ul>
      <TierRangeSelect
        disabled
        minTier={team?.minTier || 0}
        maxTier={team?.maxTier || 9}
      />
    </motion.li>
  );
}
