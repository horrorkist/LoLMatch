"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

function Header() {
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 z-20 flex items-center justify-between w-full p-5 text-xl text-white bg-blue-500">
      <Link href={"/"}>My App</Link>
      <div className="flex items-center space-x-4 text-base">
        {session ? (
          <>
            <Link href="/profile">내 정보</Link>
            <button onClick={() => signOut()}>로그아웃</button>
          </>
        ) : (
          <button onClick={() => signIn()}>로그인</button>
        )}
      </div>
    </header>
  );
}

export default Header;
