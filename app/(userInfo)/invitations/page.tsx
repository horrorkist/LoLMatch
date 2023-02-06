"use client";

import { Invitation } from "@prisma/client";
import { useContext, useEffect, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import RecruitPost from "../../components/RecruitPost";
import { TeamWithMembers } from "../team/page";
import Overlay from "../../components/Overlay";
import InvitationModal from "../../components/InvitationModal";
import { NotificationContext } from "../../components/NotiProvider";

export interface InvitationWithTeam extends Invitation {
  sentTeam: TeamWithMembers;
}

interface InvitationResponse {
  ok: boolean;
  invitations?: InvitationWithTeam[];
  message?: string;
}

export default function Invitations() {
  const {
    data,
    isLoading,
    mutate: mutateInvitations,
  } = useSWR<InvitationResponse>("/api/users/me/invitations");
  const [inInvitationModal, setInInvitationModal] = useState(false);
  const [clickedInvitation, setClickedInvitation] =
    useState<InvitationWithTeam>();
  const { count, setCount, hasNewData, setHasNewData } =
    useContext(NotificationContext);

  const closeModal = () => {
    setInInvitationModal(false);
  };

  const onInvitationClick = (invitation: InvitationWithTeam) => {
    setClickedInvitation(invitation);
    setInInvitationModal(true);
  };

  useEffect(() => {
    setHasNewData(false);
  }, []);
  // useEffect(() => {
  //   if (data && data.ok) {
  //     setCount(data.invitations?.length!);
  //   }
  // }, [data]);

  useEffect(() => {
    if (inInvitationModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [inInvitationModal]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-1 text-2xl text-white">
        초대 현황 불러오는 중...
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center flex-1 py-8">
        {inInvitationModal && (
          <Overlay closeModal={closeModal}>
            <InvitationModal
              closeModal={closeModal}
              invitation={clickedInvitation!}
              mutateInvitations={mutateInvitations}
            />
          </Overlay>
        )}
        <div className="flex flex-col w-full h-full max-w-4xl space-y-8">
          <h1 className="w-full text-left text-white 2xl:text-3xl xl:text-2xl">
            내게 온 초대
          </h1>
          {data?.invitations?.length === 0 ? (
            <div className="flex items-center justify-center w-full h-full rounded-md bg-slate-500">
              <p className="text-xl text-white">아직 받은 초대가 없습니다.</p>
            </div>
          ) : (
            <ul className="flex flex-col w-full h-full text-white rounded-md bg-slate-500">
              {data?.invitations?.map((invitation) => (
                <RecruitPost
                  key={invitation.id}
                  onClick={() => onInvitationClick(invitation)}
                  team={invitation.sentTeam}
                  className="p-2 cursor-pointer justify-evenly even:bg-slate-600 odd:bg-slate-700 hover:bg-slate-800"
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
