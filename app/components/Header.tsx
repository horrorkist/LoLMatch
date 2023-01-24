"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathName = usePathname();

  return (
    <header className="flex items-center justify-center w-full p-5 text-xl text-white bg-blue-500">
      <div
        className={`flex items-center justify-between ${
          pathName === "/" ? "max-w-[900px]" : ""
        } w-full`}
      >
        <Link href={"/"}>My App</Link>
        <div className="flex items-center space-x-4 text-base">
          {session ? (
            <>
              <Link href="/profile">내 정보</Link>
              <button
                onClick={() => {
                  router.push("/");
                  signOut();
                }}
              >
                로그아웃
              </button>
            </>
          ) : (
            <button onClick={() => signIn()}>로그인</button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
