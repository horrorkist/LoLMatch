"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Overlay from "../../components/Overlay";
import PositionSelect from "../../components/PositionSelect";
import QTypeSelect from "../../components/QTypeSelect";
import TeamEditModal from "../../components/TeamEditModal";
import TierRangeSelect from "../../components/TierRangeSelect";

const PositionObj = ["All", "TOP", "JUG", "MID", "ADC", "SUP"];

export default function TeamInfo() {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      alert("로그인이 필요합니다.");
      router.push("/");
    },
  });
  const router = useRouter();
  const [inEditModal, setInEditModal] = useState(false);
  const [inRequestModal, setInRequestModal] = useState(false);

  const closeModal = () => {
    setInEditModal(false);
    setInRequestModal(false);
  };

  // useEffect(() => {
  //   if (session.status === "unauthenticated") {
  //     alert("로그인이 필요합니다.");
  //     router.push("/");
  //   }
  // });

  useEffect(() => {
    if (inEditModal || inRequestModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  });

  if (session.status === "loading") {
    return (
      <div className="flex items-center justify-center flex-1 text-2xl">
        로그인 인증 중...
      </div>
    );
  }

  // if (session.status === "unauthenticated") {
  //   return null;
  // }

  return (
    <div className="flex flex-1">
      {inEditModal && (
        <Overlay closeModal={closeModal}>
          <TeamEditModal closeModal={closeModal} />
        </Overlay>
      )}
      <div className="flex flex-col w-2/3 min-w-[800px] px-12 py-8 space-y-4 bg-blue-300">
        <h1 className="flex items-center space-x-4 text-3xl text-white">
          <p>팀 이름</p>
          <button
            onClick={() => setInEditModal(true)}
            className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-400"
          >
            팀 정보 수정
          </button>
        </h1>
        <div className="flex-1">
          <section className="flex flex-col w-full h-full overflow-hidden bg-white rounded-md">
            <header className="flex p-4 border-b border-black justify-evenly">
              <div className="flex flex-col space-y-2">
                <p className="pl-2">큐 타입</p>
                <QTypeSelect disabled />
              </div>
              <div className="flex flex-col space-y-2">
                <p className="pl-2">모집 포지션</p>
                <PositionSelect PositionObj={PositionObj} />
              </div>
              <div className="flex flex-col space-y-2">
                <p className="pl-2">모집 티어</p>
                <TierRangeSelect disabled minTier={0} maxTier={9} />
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
