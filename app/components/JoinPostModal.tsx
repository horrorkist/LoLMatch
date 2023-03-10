"use client";

import { FormEvent, useEffect, useState } from "react";
import useMutation from "../../lib/client/useMutation";
import { JoinPostWithUser } from "../page";
import PositionSelect from "./PositionSelect";
import QTypeSelect from "./QTypeSelect";
import UserLinkName from "./UserLinkName";
import useSWR from "swr";
import ModalWrapper from "./ModalWrapper";
import CancelModalButton from "./CancelModalButton";
import TierImage from "./TierImage";
import Spinner from "./Spinner";
import WinRateBar from "./WinRateBar";
import UserMatchHistory from "./UserMatchHistory";

interface JoinPostModalProps {
  closeModal: () => void;
  post: JoinPostWithUser;
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

export default function JoinPostModal({
  closeModal,
  post,
}: JoinPostModalProps) {
  const [mutateInvitation, { data, loading }] = useMutation("/api/invitations");
  const [invitingPosition, setInvitingPosition] = useState<number>(0);
  const { data: teamData } = useSWR("/api/team");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) {
      alert("잠시 기다려주세요.");
      return;
    }

    if (
      invitingPosition === null ||
      invitingPosition < 0 ||
      invitingPosition > 5
    ) {
      alert("초대할 포지션을 선택해주세요.");
      return;
    }

    if (!post.user.positions) {
      alert("유저의 포지션이 없습니다.");
      closeModal();
      return;
    }

    if (post.qType !== teamData.team.qType) {
      alert("유저의 큐 타입이 팀의 큐 타입과 다릅니다.");
      closeModal();
      return;
    }

    const userPositions = JSON.parse(post.user.positions);

    if (userPositions[0] === 0 || userPositions.includes(invitingPosition)) {
      mutateInvitation(
        {
          invitedId: post.user.id,
          invitingPosition,
        },
        "POST"
      );
      return;
    } else if (
      confirm("유저가 선호하는 포지션이 아닙니다. 그래도 초대할까요?")
    ) {
      mutateInvitation(
        {
          invitedId: post.user.id,
          invitingPosition,
        },
        "POST"
      );
      return;
    }
  };

  const handlePositionChange = (e: React.MouseEvent<HTMLLIElement>) => {
    const selectedPosition = Number(e.currentTarget.dataset.position);

    if (selectedPosition === invitingPosition) {
      return;
    }

    setInvitingPosition(selectedPosition);
  };

  useEffect(() => {
    if (data?.ok) {
      alert("초대가 완료되었습니다.");
      closeModal();
    }

    if (!data?.ok && data?.message) {
      alert(data.message);
    }
  }, [data]);

  return (
    <ModalWrapper className="divide-gray-300 divide-x-1">
      <div>
        <header className="flex items-center p-4 border-b-2 border-gray-300">
          <p>소환사 정보</p>
        </header>
        <main className="flex flex-col justify-between flex-1 p-4 space-y-6">
          <div className="flex items-center pl-2 space-x-4">
            <p>소환사 명</p>
            <UserLinkName>{post?.user.summonerName}</UserLinkName>
          </div>
          <div className="flex items-center pl-2 space-x-4">
            <p className="">티어</p>
            {post?.user.tier ? (
              <>
                <TierImage tier={post?.user.tier} width={40} height={40} />
                <div className="flex">
                  <p>{TierArray[post?.user.tier]}</p>
                  &nbsp;
                  <p>{post?.user.rank}</p>
                </div>
              </>
            ) : (
              <p>언랭크</p>
            )}
          </div>
          <section>
            <ul className="flex flex-col space-y-4 justify-evenly">
              <li className="flex space-x-4">
                <div className="flex flex-col space-y-2">
                  <p className="pl-2">큐 타입</p>
                  <QTypeSelect disabled value={post?.qType} />
                </div>
                <div className="flex flex-col space-y-4">
                  <p>전적</p>
                  <WinRateBar user={post?.user} />
                </div>
              </li>
              <li className="flex flex-col space-y-2">
                <p className="pl-2">선호 포지션</p>
                <PositionSelect
                  positions={JSON.parse(post?.user.positions || "[0]")}
                />
              </li>
            </ul>
          </section>
        </main>
      </div>
      <div className="flex flex-col">
        <header className="flex items-center justify-between border-b-2 border-gray-300">
          <h1 className="p-4">초대 정보</h1>
          <button onClick={closeModal} className="p-4">
            X
          </button>
        </header>
        <form onSubmit={onSubmit} action="" className="flex-1">
          <main className="flex flex-col h-full p-4 space-y-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center mb-2 space-x-4">
                <p className="pl-2">팀 이름</p>
                <p className="text-white">{teamData?.team?.name}</p>
              </div>
              <div className="flex flex-col space-y-2">
                <p className="pl-2">큐 타입</p>
                <QTypeSelect disabled value={teamData?.team?.qType} />
              </div>
              <div className="flex flex-col space-y-2">
                <p className="pl-2">초대할 포지션을 선택하세요</p>
                <PositionSelect
                  handlePositionChange={handlePositionChange}
                  positions={[invitingPosition]}
                />
              </div>
            </div>
            <div className="flex mt-auto justify-evenly">
              <CancelModalButton closeModal={closeModal}>
                취소
              </CancelModalButton>
              <button
                type={"submit"}
                className="w-1/3 px-4 py-2 text-white bg-blue-500 border border-blue-500 rounded-md hover:bg-black hover:text-white hover:border-white"
              >
                {loading ? <Spinner /> : "초대"}
              </button>
            </div>
          </main>
        </form>
      </div>
    </ModalWrapper>
  );
}
