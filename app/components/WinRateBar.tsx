import { User } from "@prisma/client";

const bigWidth = 160,
  smallWidth = 128;

export default function WinRateBar({
  user,
  className,
  big,
}: {
  user: User;
  className?: string;
  big?: boolean;
}) {
  return (
    <div className={`flex space-x-2 items-center ${className}`}>
      <div
        className={`relative flex items-center overflow-hidden bg-gray-500 border border-white rounded-md ${
          big ? "w-40 h-8" : "w-32 h-6"
        }`}
      >
        {user.wins != null &&
          user.losses != null &&
          user.wins >= 0 &&
          user.losses >= 0 && (
            <>
              <div
                className={`h-full absolute flex left-0 px-1 items-center justify-start bg-blue-500`}
                style={{
                  width: `${Math.floor(
                    (user.wins / (user.losses + user.wins)) *
                      (big ? bigWidth : smallWidth)
                  )}px`,
                }}
              >
                <p
                  className={`text-white whitespace-nowrap ${
                    big ? "text-sm" : "text-xs"
                  }`}
                >
                  {user.wins}승
                </p>
              </div>
              <div
                className="absolute right-0 flex items-center justify-end h-full px-1 bg-red-500"
                style={{
                  width: `${
                    (big ? bigWidth : smallWidth) -
                    Math.floor(
                      (user.wins / (user.losses + user.wins)) *
                        (big ? bigWidth : smallWidth)
                    )
                  }px`,
                }}
              >
                <p
                  className={`text-sm text-white whitespace-nowrap ${
                    big ? "text-sm" : "text-xs"
                  }`}
                >
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
            className={`font-bold ${
              Math.floor((user.wins / (user.losses + user.wins)) * 100) >= 50
                ? "text-teal-500"
                : "text-red-500"
            } ${big ? "text-base" : "text-sm"}`}
          >
            {Math.floor((user.wins / (user.losses + user.wins)) * 100)}%
          </p>
        )}
    </div>
  );
}
