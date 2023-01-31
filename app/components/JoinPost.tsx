import { User } from "@prisma/client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface RecruitPostProps {
  onClick?: () => void;
  user: User;
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

export default function JoinPost({
  onClick,
  className,
  user,
  ...rest
}: RecruitPostProps) {
  const [parsedPositions, setParsedPositions] = useState<number[]>(
    JSON.parse(user.positions || "[0]")
  );
  const [winRate, setWinRate] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    setParsedPositions(JSON.parse(user.positions || "[0]"));
    if (user.wins && user.losses) {
      setWinRate(Math.floor((user.wins / (user.wins + user.losses)) * 100));
      setWidth(Math.floor((user.wins / (user.wins + user.losses)) * 128));
    }
  }, [user]);

  useEffect(() => {
    console.log(width);
  }, [width]);

  return (
    <motion.li
      onClick={onClick}
      className={`min-h-[60px] group ${className}`}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      {...rest}
    >
      <div className="flex items-center w-full space-x-6">
        <div className="flex items-center space-x-3 w-[250px] h-full">
          {user.RiotProfileIconId ? (
            <Image
              className="rounded-full"
              src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${user.RiotProfileIconId}.png`}
              alt="Profile Icon"
              width={40}
              height={40}
            />
          ) : (
            <div className="w-[40px] h-[40px] rounded-full bg-slate-800 group-hover:bg-slate-500"></div>
          )}
          <span className="flex-1 block overflow-hidden text-sm whitespace-nowrap text-ellipsis">
            {user.summonerName}
          </span>
          {user.tier && user.tier > 0 ? (
            <div className="flex flex-col items-center justify-between w-20 space-y-1">
              <p className="text-[10px]">
                {TierArray[user.tier]} {user.rank}
              </p>
              <Image
                src={`/ranked-emblems/Emblem_${TierArray[user.tier]}.png`}
                alt="Tier Icon"
                width={30}
                height={30}
              />
            </div>
          ) : (
            <p className="w-20 text-center">언랭크</p>
          )}
        </div>
        <div>
          <ul className="flex justify-center min-w-[160px]">
            {parsedPositions[0] === 0 ? (
              <div>상관없음</div>
            ) : (
              parsedPositions.map((position: number) => (
                <li key={position}>
                  <Image
                    src={`/ranked-positions/Position_Plat-${PositionArray[position]}.png`}
                    alt="Position Icon"
                    width={40}
                    height={40}
                  />
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative flex items-center w-32 h-8 overflow-hidden bg-transparent border border-white rounded-md">
            {(user.wins || user.losses) && (
              <>
                <div
                  className={`h-full absolute flex left-0 px-1 items-center justify-start bg-blue-500`}
                  style={{ width: `${width}px` }}
                >
                  <p className="text-xs text-white whitespace-nowrap">
                    {user.wins}승
                  </p>
                </div>
                <div
                  style={{ width: `${128 - width}px` }}
                  className="absolute right-0 flex items-center justify-end w-full h-full px-1 bg-red-500"
                >
                  <p className="text-xs text-white whitespace-nowrap">
                    {user.losses}패
                  </p>
                </div>
              </>
            )}
          </div>
          {user.wins !== null &&
            user.losses !== null &&
            user.wins >= 0 &&
            user.losses >= 0 && (
              <p
                className={`text-xs ${
                  winRate >= 50 ? "text-teal-500" : "text-red-500"
                } `}
              >
                {winRate}%
              </p>
            )}
        </div>
      </div>
    </motion.li>
  );
}
