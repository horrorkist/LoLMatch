"use client";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AbcIcon from "@mui/icons-material/Abc";
import useLoggedIn from "../../lib/client/useLoggedIn";

function Header() {
  const [loggedIn, loading] = useLoggedIn();
  const pathName = usePathname();

  const handleLoginClick = async () => {
    const response = await fetch("/api/ironsession");
    const ironsession = await response.json();
    if (
      ironsession.user &&
      confirm("비로그인 정보는 삭제됩니다. 로그인 하시겠습니까?")
    ) {
      // delete iron session user data
      await fetch(`/api/ironsession`, {
        method: "DELETE",
      });

      // destory iron session
      await fetch("/api/register/delete");

      signIn();
    } else if (!ironsession.user) {
      signIn();
    }
  };

  const handleLogoutClick = async () => {
    await fetch("api/register/delete");
    signOut();
  };

  return (
    <header className="flex items-center justify-center w-full p-5 text-xl text-white bg-blue-500">
      <div
        className={`flex items-center justify-between ${
          pathName === "/" ? "max-w-[900px]" : ""
        } w-full`}
      >
        <Link href={"/"}>My App</Link>
        <div className="flex items-center space-x-4 text-base">
          <AbcIcon />
          <Link href="/profile">내 정보</Link>
          {loggedIn ? (
            <>
              <button onClick={handleLogoutClick}>로그아웃</button>
            </>
          ) : (
            <button onClick={handleLoginClick}>로그인</button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
