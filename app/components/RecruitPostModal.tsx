"use client";

import { Request } from "@prisma/client";
import { MouseEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { UserInfoFormData } from "../(userInfo)/profile/page";
import { TeamWithMembers } from "../(userInfo)/team/page";
import useMutation from "../../lib/client/useMutation";
import CancelModalButton from "./CancelModalButton";
import ModalWrapper from "./ModalWrapper";
import PositionSelect from "./PositionSelect";
import QTypeSelect from "./QTypeSelect";
import Spinner from "./Spinner";
import TierImage from "./TierImage";
import TierRangeSelect from "./TierRangeSelect";
import TierSelect from "./TierSelect";
import UserLinkName from "./UserLinkName";

interface RecruitPostModalProps {
  closeModal: () => void;
  team: TeamWithMembers;
}

interface JoinRequestResponse {
  ok: boolean;
  message?: string;
  joinRequest?: Request;
}

export default function RecruitPostModal({
  closeModal,
  team,
}: RecruitPostModalProps) {
  const { data: user, isLoading } = useSWR(`/api/users/me`);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInfoFormData>({
    values: {
      summonerName: user?.user?.summonerName || "",
      tier: user?.user?.tier || 0,
    },
  });

  const [selectedPosition, setSelectedPosition] = useState<number[]>([]);

  const [mutateUser, { data: userData, loading: userLoading }] =
    useMutation("/api/users/me");
  const [mutateRequest, { data: requestData, loading: requestLoading }] =
    useMutation<JoinRequestResponse>("/api/joinRequests");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePositionSelect = (
    e: MouseEvent<HTMLLIElement, globalThis.MouseEvent>
  ) => {
    const position = Number(e.currentTarget.dataset.position);

    if (selectedPosition[0] === position) {
      return;
    }
    setSelectedPosition([position]);
  };

  const onSubmit = async (data: UserInfoFormData) => {
    if (loading) {
      alert("잠시만 기다려주세요.");
      return;
    }

    if (selectedPosition.length === 0) {
      alert("포지션을 선택해주세요.");
      return;
    }

    if (selectedPosition.length >= 2) {
      alert("포지션은 1개만 선택해주세요.");
      return;
    }

    if (user.user.teamId) {
      alert("이미 팀에 가입되어 있습니다.");
      return;
    }

    setLoading(true);

    const userResponse = await (
      await fetch("/api/users/me", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summonerName: data.summonerName,
          positions: selectedPosition,
        }),
      })
    ).json();

    if (!userResponse.ok) {
      setMessage(userResponse.message);
      setLoading(false);
      return;
    }

    const requestResponse = await (
      await fetch("/api/joinRequests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamId: team.id,
        }),
      })
    ).json();

    if (!requestResponse.ok) {
      setMessage(requestResponse.message);
      setLoading(false);
      return;
    }

    // mutateUser(
    //   {
    //     summonerName: data.summonerName,
    //     positions: selectedPosition,
    //   },
    //   "POST"
    // );
    // mutateRequest(
    //   {
    //     teamId: team.id,
    //   },
    //   "POST"
    // );

    setLoading(false);
    alert("가입 신청이 완료되었습니다.");
    closeModal();
  };

  useEffect(() => {
    if (!isLoading && user.ok) {
      setSelectedPosition(JSON.parse(user?.user?.positions || "[0]"));
    }
  }, [isLoading, user]);

  useEffect(() => {
    if (message) {
      alert(message);
    }
  }, [message]);

  return (
    <ModalWrapper className="divide-gray-300 divide-x-1">
      <div>
        <header className="flex items-center justify-between border-b-2 border-gray-300">
          <h1 className="p-4">{team?.name}</h1>
        </header>
        <main className="flex flex-col justify-between flex-1 p-4 space-y-6">
          <div className="flex items-center space-x-4">
            <p>팀장</p>
            <UserLinkName>{team.chief.summonerName}</UserLinkName>
            <TierImage tier={team.chief.tier!} width={30} height={30} />
          </div>
          <section>
            <ul className="flex flex-col space-y-4 justify-evenly">
              <li className="flex flex-col space-y-2">
                <p className="pl-2">큐 타입</p>
                <QTypeSelect disabled value={team?.qType} />
              </li>
              <li className="flex flex-col space-y-2">
                <p className="pl-2">모집 포지션</p>
                <PositionSelect
                  positions={JSON.parse(team?.positions || "[0]")}
                />
              </li>
              <li className="flex flex-col space-y-2">
                <p className="pl-2">모집 티어</p>
                <TierRangeSelect
                  minTier={team?.minTier || 0}
                  maxTier={team?.maxTier || 9}
                  disabled
                />
              </li>
            </ul>
          </section>
        </main>
      </div>
      <div className="flex flex-col">
        <header className="flex items-center justify-between border-b-2 border-gray-300">
          <h1 className="p-4">내 정보</h1>
          <button onClick={closeModal} className="p-4">
            X
          </button>
        </header>
        <form onSubmit={handleSubmit(onSubmit)} action="" className="flex-1">
          <main className="flex flex-col justify-between h-full p-4 space-y-6">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <p className="pl-2">소환사 명</p>
                {errors.summonerName?.type === "required" && (
                  <p className="text-sm text-red-700">
                    {errors.summonerName.message}
                  </p>
                )}
                {errors.summonerName?.type === "maxLength" && (
                  <p className="text-sm text-red-700">
                    소환사 명은 20자 이내로 입력해주세요.
                  </p>
                )}
              </div>
              <input
                {...register("summonerName", {
                  required: "소환사 명을 입력해주세요.",
                  maxLength: 20,
                })}
                type="text"
                className="w-48 p-2 pl-4 text-black rounded-md focus:outline-none"
              />
            </div>
            <div className="flex flex-col space-y-4 justify-evenly">
              <div className="flex flex-col space-y-2">
                <p className="pl-2">지원하는 포지션</p>
                <PositionSelect
                  positions={selectedPosition}
                  handlePositionChange={handlePositionSelect}
                />
              </div>
            </div>
            <div className="flex justify-evenly">
              <CancelModalButton closeModal={closeModal}>
                취소
              </CancelModalButton>
              <button
                type={"submit"}
                className="w-1/3 px-4 py-2 text-white bg-blue-500 border border-blue-500 rounded-md hover:bg-black hover:text-white hover:border-white"
              >
                {loading ? <Spinner /> : "신청"}
              </button>
            </div>
          </main>
        </form>
      </div>
    </ModalWrapper>
  );
}
