"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MouseEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PositionSelect from "../../components/PositionSelect";
import TierSelect from "../../components/TierSelect";

interface UserInfoFormData {
  name: string;
  positions: number[];
  tier: number;
}

const PositionObj = ["All", "TOP", "JUG", "MID", "ADC", "SUP"];

export default function Profile() {
  const session = useSession();
  const router = useRouter();
  const [positions, setPositions] = useState<number[]>([0]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInfoFormData>();

  const onSubmit = (data: UserInfoFormData) => {
    console.log(data);
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
    setPositions(newPositions);
  };

  useEffect(() => {
    if (session.status === "unauthenticated") {
      alert("로그인이 필요합니다.");
      router.push("/");
    }
  });

  useEffect(() => {
    console.log(positions);
  });

  if (session.status === "loading") {
    return (
      <div className="flex items-center justify-center flex-1 text-2xl">
        로그인 인증 중...
      </div>
    );
  }

  if (session.status === "unauthenticated") {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 bg-blue-300">
      <div className="w-1/3 text-black bg-white border border-black rounded-md">
        <header className="p-4 border-b border-black">
          <p>이곳에 작성한 정보는 기본 정보로 등록됩니다.</p>
        </header>
        <form
          className="flex flex-col p-4 space-y-6 text-sm"
          onSubmit={handleSubmit(onSubmit)}
          action=""
        >
          <div className="flex flex-col space-y-2">
            <label className="block pl-2" htmlFor="name">
              소환사 명{/*소환사 명을 입력해주세요.*/}
            </label>
            <input
              required
              className="w-48 p-2 pl-4 text-base text-white border border-black rounded-md focus:outline-none focus:shadow-md bg-slate-500"
              {...register("name", { required: true, maxLength: 20 })}
              type="text"
              id="name"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <p className="pl-2">선호 포지션</p>
            <PositionSelect
              handlePositionChange={handlePositionChange}
              positions={positions}
              PositionObj={PositionObj}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="pl-2" htmlFor="tier">
              내 티어
            </label>
            <TierSelect register={register} id="tier" />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-4 text-white bg-blue-500 rounded-md hover:bg-black"
            >
              수정 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
