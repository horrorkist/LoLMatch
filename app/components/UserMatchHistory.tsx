import { User } from "@prisma/client";

export default function UserMatchHistory({
  user,
  big,
  count,
}: {
  user: User;
  big?: boolean;
  count?: number;
}) {
  return (
    <div className="flex items-center border border-gray-400 divide-gray-400 divide-x-1 w-max">
      {user.matchHistory &&
        JSON.parse(user.matchHistory).length > 0 &&
        JSON.parse(user.matchHistory).map((history: boolean, index: number) => {
          if (count && index < count) {
            return (
              <div
                key={`${user.RiotSummonerId}${index}`}
                className={`text-white flex justify-center items-center text-xs ${
                  history ? "bg-blue-500" : "bg-red-500"
                } ${big ? "w-8 h-8" : "w-6 h-6"}`}
              >
                {history ? "승" : "패"}
              </div>
            );
          }
        })}
    </div>
  );
}
