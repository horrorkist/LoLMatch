"use client";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useLoggedIn from "../../lib/client/useLoggedIn";
import useSWR from "swr";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useContext, useEffect, useState } from "react";
import { NotificationContext } from "./NotiProvider";

interface CountResponse {
  ok: boolean;
  messsage?: string;
  count: number;
}

function Header() {
  const [loggedIn, loading] = useLoggedIn();
  const pathName = usePathname();
  const {
    prev,
    setPrev,
    count,
    setCount,
    hasNewInvitation,
    setHasNewInvitation,
  } = useContext(NotificationContext);
  const { data: countData, isLoading } = useSWR<CountResponse>(
    "/api/users/me/invitations/count",
    {
      refreshInterval: 15000,
      onSuccess: (newData) => {
        if (newData.ok) {
          setCount(newData.count);
        }
      },
    }
  );

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

  useEffect(() => {
    if (prev < count) {
      setHasNewInvitation(true);
      setPrev(count);
      return;
    }

    if (prev > count) {
      setHasNewInvitation(false);
      setPrev(count);
      return;
    }
  }, [count]);

  return (
    <header className="flex items-center justify-center w-full p-5 text-xl text-white bg-blue-500">
      <div
        className={`flex items-center justify-between ${
          pathName === "/" ? "max-w-[900px]" : ""
        } w-full`}
      >
        <Link href={"/"}>My App</Link>
        <div className="flex items-center space-x-4 text-base">
          <div
            className={`relative flex items-center justify-center hover:animate-none group ${
              hasNewInvitation ? "animate-pulse" : null
            }`}
          >
            <NotificationsIcon />
            <p className="absolute z-20 hidden px-4 py-2 bg-black rounded-md -inset-x-full w-min h-min group-hover:block whitespace-nowrap inset-y-8">
              {hasNewInvitation
                ? "새로운 초대가 있습니다."
                : "새로운 알림이 없습니다."}
            </p>
            {hasNewInvitation && (
              <>
                <div className="absolute inset-auto w-1 h-1 bg-red-500 rounded-full"></div>
                <Link
                  href="/invitations"
                  className="absolute inset-auto w-full h-full"
                />
              </>
            )}
          </div>
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
