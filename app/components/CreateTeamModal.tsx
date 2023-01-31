"use client";

import { Team } from "@prisma/client";
import { MouseEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useMutation from "../../lib/client/useMutation";
import ModalWrapper from "./ModalWrapper";
import PositionSelect from "./PositionSelect";
import QTypeSelect from "./QTypeSelect";
import TierRangeSelect from "./TierRangeSelect";

interface CreateTeamModalProps {
  closeModal: () => void;
}

export interface TeamData {
  name: string;
  qType: number;
  minTier: number;
  maxTier: number;
}

export default function CreateTeamModal({ closeModal }: CreateTeamModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeamData>();

  const [positions, setPositions] = useState<number[]>([0]);
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
    if (loading) {
      alert("처리 중입니다.");
      return;
    }
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
            <p className="pl-2">팀 이름</p>
            <input
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
      </form>
    </ModalWrapper>
  );
}
