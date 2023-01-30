"use client";

import { Request } from "@prisma/client";
import { MouseEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { UserInfoFormData } from "../(userInfo)/profile/page";
import { TeamWithMembers } from "../(userInfo)/team/page";
import useMutation from "../../lib/client/useMutation";
import ModalWrapper from "./ModalWrapper";
import PositionSelect from "./PositionSelect";
import QTypeSelect from "./QTypeSelect";
import TierRangeSelect from "./TierRangeSelect";
import TierSelect from "./TierSelect";
import UserLinkName from "./UserLinkName";

const PositionObj = ["All", "TOP", "JUG", "MID", "ADC", "SUP"];

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
  const { data, isLoading } = useSWR(`/api/users/me`);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInfoFormData>({
    values: {
      summonerName: data?.user?.summonerName || "",
      tier: data?.user?.tier || 0,
    },
  });

  const [chiefName, setChiefName] = useState<string>("");

  const [selectedPosition, setSelectedPosition] = useState<number[]>([]);

  const [mutateUser, { data: userData, loading: userLoading }] =
    useMutation("/api/users/me");
  const [mutateRequest, { data: requestData, loading: requestLoading }] =
    useMutation<JoinRequestResponse>("/api/joinRequests");

  const handlePositionSelect = (
    e: MouseEvent<HTMLLIElement, globalThis.MouseEvent>
  ) => {
    const position = Number(e.currentTarget.dataset.position);

    if (selectedPosition[0] === position) {
      return;
    }
    setSelectedPosition([position]);
  };

  const onSubmit = (data: UserInfoFormData) => {
    if (userLoading || requestLoading) {
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
    mutateUser(
      {
        summonerName: data.summonerName,
        tier: data.tier,
        positions: selectedPosition,
      },
      "POST"
    );
    mutateRequest(
      {
        teamId: team.id,
      },
      "POST"
    );
  };

  useEffect(() => {
    team.users.forEach((user) => {
      if (user.id === team?.chiefId) {
        setChiefName(user.summonerName || "팀장");
      }
    });
  }, [team]);

  useEffect(() => {
    if (!isLoading && data.ok) {
      setSelectedPosition(JSON.parse(data?.user?.positions || "[0]"));
    }
  }, [isLoading, data]);

  useEffect(() => {
    if (requestData?.ok) {
      alert("가입 신청이 완료되었습니다.");
      closeModal();
      return;
    }

    if (!requestData?.ok && requestData?.message) {
      alert(requestData.message);
      return;
    }
  }, [requestData]);

  return (
    <ModalWrapper className="divide-gray-300 divide-x-1">
      <div>
        <header className="flex items-center justify-between border-b-2 border-gray-300">
          <h1 className="p-4">{team?.name}</h1>
        </header>
        <main className="flex flex-col justify-between flex-1 p-4 space-y-6">
          <div className="flex space-x-4">
            <p>팀장</p>
            <UserLinkName>{chiefName}</UserLinkName>
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
                  PositionObj={PositionObj}
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
                  PositionObj={PositionObj}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="myTier" className="pl-2">
                  내 티어
                </label>
                <TierSelect register={register} id="myTier" />
              </div>
            </div>
            <div className="flex justify-evenly">
              <button
                onClick={closeModal}
                className="w-1/3 px-4 py-2 text-black bg-white border border-black rounded-md hover:border-none hover:bg-red-700 hover:text-white hover:border-transparent"
              >
                취소
              </button>
              <button
                type={"submit"}
                className="w-1/3 px-4 py-2 text-white bg-blue-500 border border-blue-500 rounded-md hover:bg-black hover:text-white hover:border-white"
              >
                신청
              </button>
            </div>
          </main>
        </form>
      </div>
    </ModalWrapper>
  );
}
