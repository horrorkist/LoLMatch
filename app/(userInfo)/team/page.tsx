"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Profile() {
  const session = useSession();

  const router = useRouter();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      alert("로그인이 필요합니다.");
      router.push("/");
    }
  });

  if (session.status === "loading") {
    return (
      <div className="flex items-center justify-center flex-1 text-2xl">
        로그인 인증 중...
      </div>
    );
  }

  if (session.status === "unauthenticated") {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 bg-blue-300">
      <h1 className="text-2xl">Team</h1>
    </div>
  );
}
