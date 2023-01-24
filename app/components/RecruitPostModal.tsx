"use client";

import { useSession } from "next-auth/react";
import { MouseEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PositionSelect from "./PositionSelect";
import QTypeSelect from "./QTypeSelect";
import TierRangeSelect from "./TierRangeSelect";
import TierSelect from "./TierSelect";
import UserLinkName from "./UserLinkName";

const PositionObj = ["All", "TOP", "JUG", "MID", "ADC", "SUP"];

interface FormData {
  summonerName: string;
  tier: number;
}

export default function RecruitPostModal({
  closeModal,
}: {
  closeModal: () => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const session = useSession();
  const user = session.data?.user;

  const [selectedPosition, setSelectedPosition] = useState<number[]>([0]);

  const handlePositionSelect = (
    e: MouseEvent<HTMLLIElement, globalThis.MouseEvent>
  ) => {
    const position = Number(e.currentTarget.dataset.position);

    if (selectedPosition[0] === position) {
      return;
    }
    setSelectedPosition([position]);
  };

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  useEffect(() => {
    if (user && user.positions) {
      setSelectedPosition(JSON.parse(user.positions));
    }
  }, [user]);

  return (
    <div
      onClick={closeModal}
      className="fixed top-0 bottom-0 left-0 right-0 z-20 flex items-center justify-center w-screen h-screen bg-black bg-opacity-50 overlay"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex text-gray-300 border-blue-500 divide-gray-300 rounded-md select-none divide-x-1 min-w-min bg-slate-500 modal"
      >
        <div>
          <header className="flex items-center justify-between border-b-2 border-gray-300">
            <h1 className="p-4">팀 이름</h1>
          </header>
          <main className="flex flex-col justify-between flex-1 p-4 space-y-6">
            <div className="flex space-x-4">
              <p>팀장</p>
              <UserLinkName>달려라불사조</UserLinkName>
            </div>
            <section>
              <ul className="flex flex-col space-y-4 justify-evenly">
                <li className="flex flex-col space-y-2">
                  <p className="pl-2">큐 타입</p>
                  <QTypeSelect disabled />
                </li>
                <li className="flex flex-col space-y-2">
                  <p className="pl-2">모집 포지션</p>
                  <PositionSelect PositionObj={PositionObj} />
                </li>
                <li className="flex flex-col space-y-2">
                  <p className="pl-2">모집 티어</p>
                  <TierRangeSelect minTier={4} maxTier={7} disabled />
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
                  defaultValue={user?.summonerName ? user.summonerName : ""}
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
                  <TierSelect
                    defaultValue={user?.tier ? user.tier : 0}
                    register={register}
                    id="myTier"
                  />
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
      </div>
    </div>
  );
}
