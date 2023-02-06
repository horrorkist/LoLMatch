import { User } from "@prisma/client";
import Image from "next/image";
import { getPositionSVG } from "./positionSVG";
import TierImage from "./TierImage";
import UserLinkName from "./UserLinkName";
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
    <div className="flex items-center w-full p-4 space-x-6 text-white bg-slate-500">
      {user?.RiotProfileIconId ? (
        <Image
          className="rounded-full"
          src={`http://ddragon.leagueoflegends.com/cdn/13.1.1/img/profileicon/${user?.RiotProfileIconId}.png`}
          alt="Profile Icon"
          width={40}
          height={40}
        />
      ) : (
        <div className="w-[40px] h-[40px] rounded-full bg-slate-800 group-hover:bg-slate-500"></div>
      )}
      <div>
        <UserLinkName className="flex-1 block overflow-hidden 2xl:text-2xl xl:text-xl lg:text-lg md:text-base w-36 whitespace-nowrap text-ellipsis">
          {user?.summonerName}
        </UserLinkName>
      </div>
      {user?.tier && user?.tier > 0 ? (
        <div className="relative flex flex-col items-center justify-between space-y-1">
          <p className="absolute text-sm -inset-y-4 whitespace-nowrap">
            {TierArray[user?.tier]} {user?.rank}
          </p>
          <TierImage tier={user?.tier} width={40} height={40} />
        </div>
      ) : (
        <p className="w-[60px] whitespace-nowrap text-center">언랭크</p>
      )}
      <ul className="flex justify-center w-[160px]">
        {JSON.parse(user?.positions || "[0]").map((position: number) =>
          getPositionSVG(position)
        )}
      </ul>
      <WinRateBar user={user} />
      {/* <UserMatchHistory user={user} big count={10} /> */}
    </div>
  );
}
