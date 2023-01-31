"use client";

import { JoinPost, User } from "@prisma/client";
import { MouseEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useMutation from "../../lib/client/useMutation";
import ModalWrapper from "./ModalWrapper";
import PositionSelect from "./PositionSelect";
import QTypeSelect from "./QTypeSelect";
import Spinner from "./Spinner";
import TierSelect from "./TierSelect";

interface RegisterProfileModalProps {
  closeModal: () => void;
  mutate: any;
}

export interface SummonerData {
  name: string;
  qType: number;
  tier: number;
}

interface RegisterResponse {
  ok: boolean;
  user?: User;
  message?: string;
}

interface JoinPostResponse {
  ok: boolean;
  joinPost?: JoinPost;
  message?: string;
}

export default function RegisterProfileModal({
  closeModal,
  mutate,
}: RegisterProfileModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SummonerData>();

  const [positions, setPositions] = useState<number[]>([0]);
  const [mutateUser, { data: userData, loading: userLoading }] =
    useMutation<RegisterResponse>("/api/users/me");
  const [mutateJoinPost, { data: joinPostData, loading: joinPostLoading }] =
    useMutation<JoinPostResponse>("/api/posts/join");

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

  const onSubmit = async (data: SummonerData) => {
    if (userLoading || joinPostLoading) {
      alert("잠시만 기다려주세요.");
      return;
    }

    // const user = await (
    //   await fetch("/api/users/me", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       summonerName: data.name,
    //       positions,
    //     }),
    //   })
    // ).json();

    mutateUser(
      {
        summonerName: data.name,
        positions,
      },
      "POST"
    );

    // const response = await (
    //   await fetch("/api/posts/join", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       qType: data.qType,
    //     }),
    //   })
    // ).json();

    mutateJoinPost(
      {
        qType: data.qType,
      },
      "POST"
    );

    mutate();
  };

  useEffect(() => {
    if (userData?.ok && joinPostData?.ok) {
      alert("소환사 정보가 성공적으로 등록되었습니다.");
      closeModal();
    }

    if (userData?.message) {
      alert(userData.message);
    }

    if (joinPostData?.message) {
      alert(joinPostData.message);
    }
  }, [userData, joinPostData]);

  return (
    // <div
    //   className="relative text-gray-300 rounded-md bg-slate-500"
    //   onClick={(e) => e.stopPropagation()}
    // >
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
        className="flex flex-col justify-between flex-1 p-8 space-y-6"
      >
        <ul className="flex flex-col space-y-4 justify-evenly">
          <li className="flex items-center space-x-4">
            <p className="pl-2">소환사 이름</p>
            <input
              {...register("name", {
                required: "소환사 이름을 입력해주세요.",
                maxLength: {
                  value: 20,
                  message: "소환사 이름은 20자 이내로 입력해주세요.",
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
            <p className="pl-2">선호 포지션</p>
            <PositionSelect
              handlePositionChange={handlePositionChange}
              positions={positions}
            />
          </li>
          <li className="flex flex-col space-y-2">
            <p className="pl-2">내 티어</p>
            <TierSelect register={register} />
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
            {userLoading || joinPostLoading ? <Spinner /> : "확인"}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}
