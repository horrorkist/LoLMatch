"use client";

import { Team, User } from "@prisma/client";
import { MouseEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useMutation from "../../lib/client/useMutation";
import CancelModalButton from "./CancelModalButton";
import ModalWrapper from "./ModalWrapper";
import PositionSelect from "./PositionSelect";
import QTypeSelect from "./QTypeSelect";
import TierRangeSelect from "./TierRangeSelect";

interface CreateTeamModalProps {
  closeModal: () => void;
  user: User;
}

export interface TeamData {
  name: string;
  qType: number;
  minTier: number;
  maxTier: number;
  summonerName: string;
}

export default function CreateTeamModal({
  closeModal,
  user,
}: CreateTeamModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeamData>();

  const [positions, setPositions] = useState<number[]>([0]);
  const [mutateUser, { data: userData, loading: userLoading }] =
    useMutation("/api/users/me");
  const [mutate, { data, loading }] = useMutation("/api/team");

  const handlePositionChange = (
    e: MouseEvent<HTMLLIElement, globalThis.MouseEvent>
  ) => {
    const selectedPosition = Number(e.currentTarget.dataset.position);

    let newPositions: number[];

    if (selectedPosition === 0) {
      newPositions = [0];
    } else if (positions.length === 1 && positions[0] === selectedPosition) {
      return;
    } else if (positions.includes(selectedPosition)) {
      newPositions = positions.filter((p) => p !== 0 && p !== selectedPosition);
    } else {
      newPositions = [...positions.filter((p) => p !== 0), selectedPosition];
    }

    if (newPositions.length >= 5) {
      newPositions = [0];
    }

    setPositions(newPositions);
  };

  const onSubmit = (data: TeamData) => {
    if (loading || userLoading) {
      alert("처리 중입니다.");
      return;
    }
    mutateUser(
      {
        summonerName: data.summonerName,
      },
      "POST"
    );
    mutate(
      {
        name: data.name,
        qType: data.qType,
        minTier: data.minTier,
        maxTier: data.maxTier,
        positions,
      },
      "POST"
    );
  };

  useEffect(() => {
    if (data && data.ok) {
      alert("팀이 성공적으로 생성되었습니다.");
      closeModal();
    }
  }, [loading, data]);

  return (
    <ModalWrapper className="relative">
      {errors.name?.type === "required" && (
        <p className="absolute left-0 right-0 p-4 text-white bg-red-500 rounded-md -top-24 text-xm">
          {String(errors.name?.message)}
        </p>
      )}
      {errors.name?.type === "maxLength" && (
        <p className="absolute left-0 right-0 p-4 text-white bg-red-500 rounded-md -top-24 text-xm">
          {String(errors.name?.message)}
        </p>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-between flex-1 p-4 space-y-6"
      >
        <ul className="flex flex-col space-y-4 justify-evenly">
          <li className="flex items-center space-x-4">
            <label htmlFor="name" className="w-16 pl-2">
              팀 이름
            </label>
            <input
              id="name"
              {...register("name", {
                required: "팀 이름을 입력해주세요.",
                maxLength: {
                  value: 10,
                  message: "팀 이름은 10자 이내로 입력해주세요.",
                },
              })}
              className="px-4 py-2 text-black rounded-md focus:outline-none"
              type="text"
            />
          </li>
          <li className="flex items-center space-x-4">
            <label htmlFor="chief" className="w-16 pl-2">
              팀장
            </label>
            <input
              id="chief"
              {...register("summonerName", {
                required: "팀장의 소환사 명을 입력해주세요.",
                maxLength: {
                  value: 16,
                  message: "소환사 명은 16자 이내로 입력해주세요.",
                },
              })}
              className="px-4 py-2 text-black rounded-md focus:outline-none"
              type="text"
              defaultValue={user.summonerName || ""}
            />
          </li>
          <li className="flex flex-col space-y-2">
            <p className="pl-2">큐 타입</p>
            <QTypeSelect register={register} />
          </li>
          <li className="flex flex-col space-y-2">
            <p className="pl-2">모집 포지션</p>
            <PositionSelect
              handlePositionChange={handlePositionChange}
              positions={positions}
            />
          </li>
          <li className="flex flex-col space-y-2">
            <p className="pl-2">모집 티어</p>
            <TierRangeSelect register={register} minTier={0} maxTier={9} />
          </li>
        </ul>
        <div className="flex justify-evenly">
          <CancelModalButton closeModal={closeModal}>취소</CancelModalButton>
          <button
            type={"submit"}
            className="w-1/3 px-4 py-2 text-white bg-blue-500 border border-blue-500 rounded-md hover:bg-black hover:text-white hover:border-white"
          >
            신청
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}
