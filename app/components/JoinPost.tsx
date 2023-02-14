import { User } from "@prisma/client";
import { motion } from "framer-motion";
import Image from "next/image";
import { MouseEvent, useEffect, useState } from "react";
import CopySummonerName from "./CopySummonerName";
import { getPositionSVG } from "./positionSVG";
import TierImage from "./TierImage";
import UserLinkName from "./UserLinkName";
import WinRateBar from "./WinRateBar";

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
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = (e: any) => {
    e.stopPropagation();
    navigator.clipboard.writeText(user.summonerName!);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  useEffect(() => {
    setParsedPositions(JSON.parse(user.positions || "[0]"));
    if (user.wins && user.losses) {
      setWinRate(Math.floor((user.wins / (user.wins + user.losses)) * 100));
      setWidth(Math.floor((user.wins / (user.wins + user.losses)) * 128));
    }
  }, [user]);

  return (
    <motion.li
      onClick={onClick}
      className={`min-h-[60px] group ${className}`}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      {...rest}
    >
      <div className="flex items-center w-full space-x-6">
        <div className="flex items-center space-x-3 w-[270px] h-full">
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
          <UserLinkName className="flex-1 block overflow-hidden text-sm whitespace-nowrap text-ellipsis">
            {user.summonerName}
          </UserLinkName>
          <CopySummonerName summonerName={user.summonerName!} />
          {user.tier && user.tier > 0 ? (
            <div className="flex flex-col items-center justify-between w-20 space-y-1">
              <p className="text-[10px]">
                {TierArray[user.tier]} {user.rank}
              </p>
              <TierImage tier={user.tier} width={30} height={30} />
            </div>
          ) : (
            <p className="w-20 text-center">언랭크</p>
          )}
        </div>
        <div>
          <ul className="flex justify-center min-w-[160px]">
            {parsedPositions.map((position: number) => (
              <li key={position}>{getPositionSVG(position)}</li>
            ))}
          </ul>
        </div>
        <WinRateBar user={user} />
        <div className="flex items-center border border-gray-400 divide-gray-400 divide-x-1 w-max">
          {user.matchHistory &&
            JSON.parse(user.matchHistory).length > 0 &&
            JSON.parse(user.matchHistory).map(
              (history: boolean, index: number) => {
                return (
                  <div
                    key={`${user.RiotSummonerId}${index}`}
                    className={`w-5 h-5 text-white flex justify-center items-center text-xs ${
                      history ? "bg-blue-500" : "bg-red-500"
                    }`}
                  >
                    {history ? "승" : "패"}
                  </div>
                );
              }
            )}
        </div>
      </div>
    </motion.li>
  );
}
