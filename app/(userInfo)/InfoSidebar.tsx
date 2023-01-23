"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const pathArray = [
  { path: "/profile", name: "소환사 정보" },
  { path: "/team", name: "팀 정보" },
];

export default function InfoSidebar() {
  const pathname = usePathname();

  return (
    <div className="h-auto p-4 w-52">
      <ul className="space-y-4">
        {pathArray.map((path) => (
          <li
            key={path.path}
            className={`w-full p-4 rounded-md ${
              path.path === pathname
                ? "bg-gray-300 shadow-md text-black"
                : "hover:pl-6 transition-all text-gray-500 hover:text-black"
            }`}
          >
            <Link
              className="block w-full h-full cursor-pointer"
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
