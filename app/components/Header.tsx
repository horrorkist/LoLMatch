"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Header() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <header className="flex items-center justify-between w-full p-5 text-xl text-white bg-blue-500">
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
    </header>
  );
}

export default Header;
