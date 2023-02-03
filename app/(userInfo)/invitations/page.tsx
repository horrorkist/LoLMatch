"use client";

import { Invitation, Team } from "@prisma/client";
import { useEffect } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import RecruitPost from "../../components/RecruitPost";
import { TeamWithMembers } from "../team/page";

interface InvitationWithTeam extends Invitation {
  team: TeamWithMembers;
}

interface InvitationResponse {
  ok: boolean;
  invitations?: InvitationWithTeam[];
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
      <div className="flex items-center justify-center flex-1 text-2xl text-white">
        초대 현황 불러오는 중...
      </div>
    );
  }

  return (
    <div className="flex justify-center flex-1 py-8">
      <div className="flex flex-col w-full h-full max-w-4xl space-y-8">
        <h1 className="w-full text-left text-white 2xl:text-3xl xl:text-2xl">
          내게 온 초대
        </h1>
        {data?.invitations?.length === 0 ? (
          <div className="flex items-center justify-center w-full h-full rounded-md bg-slate-500">
            <p className="text-xl text-white">아직 받은 초대가 없습니다.</p>
          </div>
        ) : (
          <ul className="flex flex-col w-full h-full rounded-md bg-slate-500">
            {data?.invitations?.map((invitation) => (
              <RecruitPost key={invitation.id} team={invitation.team} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
