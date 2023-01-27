"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Overlay from "../../components/Overlay";
import PositionSelect from "../../components/PositionSelect";
import QTypeSelect from "../../components/QTypeSelect";
import TeamEditModal from "../../components/TeamEditModal";
import TierRangeSelect from "../../components/TierRangeSelect";
import useSWR from "swr";
import Button from "../../components/Button";
import CreateTeamModal from "../../components/CreateTeamModal";
import { Team, User } from "@prisma/client";
import { useForm } from "react-hook-form";

const PositionObj = ["All", "TOP", "JUG", "MID", "ADC", "SUP"];

export interface TeamWithMembers extends Team {
  users: User[];
}

interface TeamResponse {
  ok: boolean;
  team?: TeamWithMembers;
  error?: any;
  message?: string;
}

export default function TeamInfo() {
  const session = useSession();
  const [inEditModal, setInEditModal] = useState(false);
  const [inCreateTeamModal, setInCreateTeamModal] = useState(false);
  const [inRequestModal, setInRequestModal] = useState(false);
  const {
    data,
    isLoading,
    mutate: teamMutate,
  } = useSWR<TeamResponse>("/api/team");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { register } = useForm<{
    qType: string;
    minTier: number;
    maxTier: number;
  }>({
    values: {
      qType: data?.team?.qType || "0",
      minTier: data?.team?.minTier || 0,
      maxTier: data?.team?.maxTier || 9,
    },
  });
  const [isChief, setIsChief] = useState(false);

  const closeModal = () => {
    setInEditModal(false);
    setInRequestModal(false);
    setInCreateTeamModal(false);
  };

  const onDeleteClick = () => {
    if (deleteLoading) {
      alert("잠시만 기다려주세요.");
      return;
    }
    if (!data || !data.team) return;
    if (confirm("정말로 팀을 해체하시겠습니까?")) {
      if (data.team.users.length > 1) {
        alert("팀원이 남아있어 팀을 해체할 수 없습니다.");
        return;
      }

      if (session?.data?.user?.id !== data.team.chiefId) {
        alert("권한이 없습니다.");
        return;
      }
      setDeleteLoading(true);
      fetch("/api/team", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamId: data.team.id }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.ok) {
            alert("팀을 해체했습니다.");
            teamMutate({
              ok: false,
            });
            setDeleteLoading(false);
          } else {
            alert(data.message);
          }
        });
    }
  };

  const onCreateClick = () => {
    if (session?.status !== "authenticated") {
      alert("로그인 후 이용해주세요.");
      return;
    }

    setInCreateTeamModal(true);
  };

  useEffect(() => {
    if (inEditModal || inRequestModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  });

  useEffect(() => {
    if (data && data.ok) {
      setIsChief(data.team?.chiefId === session?.data?.user.id);
    }
  }, [data]);

  if (session.status === "loading") {
    return (
      <div className="flex items-center justify-center flex-1 text-2xl">
        로그인 인증 중...
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-1 text-2xl">
        팀 정보를 불러 오는 중...
      </div>
    );
  }

  if (
    data &&
    !data.ok &&
    (data.message === "존재하지 않는 팀입니다." || data.message === "세션 없음")
  ) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 space-y-4">
        {inCreateTeamModal && (
          <Overlay closeModal={closeModal}>
            <CreateTeamModal closeModal={closeModal} />
          </Overlay>
        )}
        <h1 className="text-2xl">아직 팀이 없으시네요!</h1>
        <Button onClick={onCreateClick}>팀 만들기</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      {inEditModal && (
        <Overlay closeModal={closeModal}>
          <TeamEditModal team={data?.team!} closeModal={closeModal} />
        </Overlay>
      )}
      <div className="flex flex-col w-2/3 min-w-[800px] px-12 py-8 space-y-4 bg-blue-300">
        <h1 className="flex items-center justify-start w-full text-3xl text-white">
          <p>{data?.team?.name}</p>
          {isChief ? (
            <>
              <Button
                className="ml-4 text-sm"
                onClick={() => setInEditModal(true)}
              >
                팀 정보 수정
              </Button>
              <Button
                onClick={onDeleteClick}
                className="ml-auto text-xs text-red-500 bg-white border border-black hover:bg-red-500 hover:text-white hover:border-black"
              >
                팀 해체하기
              </Button>
            </>
          ) : (
            <Button
              onClick={() => console.log("팀 탈퇴하기")}
              className="ml-auto text-xs text-red-500 bg-white border border-black hover:bg-red-500 hover:text-white hover:border-black"
            >
              팀 탈퇴하기
            </Button>
          )}
        </h1>
        <div className="flex-1">
          <section className="flex flex-col w-full h-full overflow-hidden bg-white rounded-md">
            <header className="flex p-4 border-b border-black justify-evenly">
              <div className="flex flex-col space-y-2">
                <p className="pl-2">큐 타입</p>
                <QTypeSelect
                  register={register}
                  disabled
                  value={data?.team?.qType}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <p className="pl-2">모집 포지션</p>
                <PositionSelect
                  positions={JSON.parse(data?.team?.positions || "[0]")}
                  PositionObj={PositionObj}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <p className="pl-2">모집 티어</p>
                <TierRangeSelect
                  disabled
                  register={register}
                  minTier={data?.team?.minTier || 0}
                  maxTier={data?.team?.maxTier || 9}
                />
              </div>
            </header>
            <section className="grid flex-1 grid-cols-1 grid-rows-5 space-y-1">
              <div className="flex items-center w-full p-4 bg-slate-500">1</div>
              <div className="flex items-center w-full p-4 bg-slate-500">1</div>
              <div className="flex items-center w-full p-4 bg-slate-500">1</div>
              <div className="flex items-center w-full p-4 bg-slate-500">1</div>
              <div className="flex items-center w-full p-4 bg-slate-500">1</div>
            </section>
          </section>
        </div>
      </div>
      <div className="flex flex-col w-1/3 min-w-[300px] px-12 py-8 space-y-4 bg-blue-300">
        <h1 className="text-3xl text-white">가입 신청 목록</h1>
        <div className="flex-1">
          <section className="w-full h-full bg-white rounded-md"></section>
        </div>
      </div>
    </div>
  );
}
