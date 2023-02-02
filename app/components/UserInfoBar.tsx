import { User } from "@prisma/client";
import Image from "next/image";
import PositionImage from "./PositionImage";
import TierImage from "./TierImage";
import UserLinkName from "./UserLinkName";
import UserMatchHistory from "./UserMatchHistory";
import WinRateBar from "./WinRateBar";

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

export default function UserInfoBar({ user }: { user: User }) {
  return (
    <div className="flex items-center w-full p-4 space-x-6 text-white min-w-fit bg-slate-500">
      {user.RiotProfileIconId ? (
        <Image
          className="rounded-full"
          src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${user.RiotProfileIconId}.png`}
          alt="Profile Icon"
          width={60}
          height={60}
        />
      ) : (
        <div className="w-[40px] h-[40px] rounded-full bg-slate-800 group-hover:bg-slate-500"></div>
      )}
      <div>
        <UserLinkName className="flex-1 block w-48 overflow-hidden text-2xl whitespace-nowrap text-ellipsis">
          {user.summonerName}
        </UserLinkName>
      </div>
      {user.tier && user.tier > 0 ? (
        <div className="flex flex-col items-center justify-between space-y-1">
          <p className="text-base whitespace-nowrap">
            {TierArray[user.tier]} {user.rank}
          </p>
          <TierImage tier={user.tier} width={60} height={60} />
        </div>
      ) : (
        <p className="w-20 text-center">언랭크</p>
      )}
      <ul className="flex justify-center w-[240px]">
        <PositionImage
          width={60}
          height={60}
          positions={user.positions || "[0]"}
        />
      </ul>
      <WinRateBar user={user} big />
      <UserMatchHistory user={user} big count={10} />
    </div>
  );
}
