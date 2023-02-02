"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const pathArray = [
  { path: "/profile", name: "소환사 정보" },
  { path: "/team", name: "팀 정보" },
  { path: "/invitations", name: "내게 온 초대" },
];

export default function InfoSidebar() {
  const pathname = usePathname();

  return (
    <div className="h-auto p-4 min-w-[140px] w-52">
      <ul className="space-y-4">
        {pathArray.map((path) => (
          <li
            key={path.path}
            className={`w-full rounded-md ${
              path.path === pathname
                ? "bg-gray-300 shadow-md text-black"
                : "text-white hover:text-gray-500"
            }`}
          >
            <Link
              className="block w-full h-full p-4 transition-all cursor-pointer hover:pl-6"
              href={path.path}
            >
              {path.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
