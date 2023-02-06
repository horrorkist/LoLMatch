"use client";

import { MouseEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PositionSelect from "../../components/PositionSelect";
import useSWR from "swr";
import useMutation from "../../../lib/client/useMutation";
import UserLinkName from "../../components/UserLinkName";
import TierImage from "../../components/TierImage";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";

export interface UserInfoFormData {
  summonerName: string;
  tier: number;
}

const TierArray = [
  "_",
  "IRON",
  "BRONZE",
  "SILVER",
  "GOLD",
  "PLATINUM",
  "DIAMOND",
  "MASTER",
  "GRANDMASTER",
  "CHALLENGER",
];

export default function Profile() {
  const [positions, setPositions] = useState<number[]>([0]);
  const { data: userData, isLoading } = useSWR(`/api/users/me`);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInfoFormData>({
    values: {
      summonerName: userData?.user?.summonerName || "",
      tier: userData?.user?.tier || 0,
    },
  });

  const [mutate, { loading, data }] = useMutation("api/users/me");

  const onSubmit = async (data: UserInfoFormData) => {
    if (loading) {
      alert("잠시만 기다려주세요.");
      return;
    }
    mutate(
      {
        summonerName: data.summonerName,
        positions,
      },
      "POST"
    );
  };

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

  useEffect(() => {
    if (data && data.ok) {
      alert("정보가 수정되었습니다.");
      return;
    }

    if (data && !data.ok) {
      alert(data.message);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-1 text-2xl text-white">
        정보를 불러 오는 중...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center flex-1 min-w-[1200px]">
      <div className="flex text-gray-300 divide-gray-300 rounded-md bg-slate-500 divide-x-1">
        <div>
          <header className="flex items-center p-4 border-b-2 border-gray-300">
            <p>내 정보</p>
          </header>
          <main className="flex flex-col justify-between flex-1 p-4 space-y-6">
            <div className="flex items-center pl-2 space-x-4">
              <p>소환사 명</p>
              <UserLinkName>{userData.user?.summonerName}</UserLinkName>
            </div>
            <div className="flex items-center pl-2 space-x-4">
              <p className="">티어</p>
              {userData.user?.tier ? (
                <>
                  <TierImage
                    tier={userData.user?.tier}
                    width={40}
                    height={40}
                  />
                  <div className="flex">
                    <p>{TierArray[userData.user?.tier]}</p>
                    &nbsp;
                    <p>{userData.user?.rank}</p>
                  </div>
                </>
              ) : (
                <p>언랭크</p>
              )}
            </div>
            <section>
              <ul className="flex flex-col space-y-4 justify-evenly">
                <li className="flex flex-col space-y-2">
                  <p className="pl-2">선호 포지션</p>
                  <PositionSelect
                    positions={JSON.parse(userData?.user?.positions || "[0]")}
                  />
                </li>
              </ul>
            </section>
          </main>
        </div>
        <div className="">
          <header className="p-4 border-b-2 border-gray-300">
            <p>이곳에 작성한 정보는 기본 정보로 등록됩니다.</p>
          </header>
          <form
            className="flex flex-col p-4 space-y-5"
            onSubmit={handleSubmit(onSubmit)}
            action=""
          >
            <div className="flex flex-col space-y-2">
              <label className="flex items-center pl-2" htmlFor="summonerName">
                소환사 명
                {errors.summonerName?.type === "required" && (
                  <p className="pl-2 text-xs text-red-500">
                    {errors.summonerName?.message}
                  </p>
                )}
                {errors.summonerName?.type === "maxLength" && (
                  <p className="pl-2 text-xs text-red-500">
                    소환사 명은 20자 이내로 입력해주세요.
                  </p>
                )}
              </label>
              <input
                className="w-48 p-2 text-base text-black bg-white border border-black rounded-md focus:outline-none focus:shadow-md"
                placeholder="소환사 명을 입력해주세요."
                {...register("summonerName", {
                  required: "소환사 명을 입력해주세요.",
                  maxLength: 20,
                })}
                type="text"
                id="summonerName"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <p className="pl-2">선호 포지션</p>
              <PositionSelect
                handlePositionChange={handlePositionChange}
                positions={positions}
              />
            </div>
            <div className="flex justify-center h-10">
              {loading ? <Spinner /> : <Button>수정 완료</Button>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
