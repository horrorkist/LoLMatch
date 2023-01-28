"use client";

import { Invitation } from "@prisma/client";
import { useEffect } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";

interface InvitationResponse {
  ok: boolean;
  invitations?: Invitation[];
  message?: string;
}

export default function Invitations() {
  const router = useRouter();
  const { data, isLoading } = useSWR<InvitationResponse>("/api/invitations");

  useEffect(() => {
    if (data && !data.ok) {
      alert(data.message);
      router.push("/");
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-1 text-2xl">
        초대 현황 불러오는 중...
      </div>
    );
  }

  return <div>초대 현황</div>;
}
