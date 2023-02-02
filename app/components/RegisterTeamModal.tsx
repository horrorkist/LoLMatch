"use client";

import { Team } from "@prisma/client";
import { FormEvent, useEffect } from "react";
import useMutation from "../../lib/client/useMutation";
import CancelModalButton from "./CancelModalButton";
import ModalWrapper from "./ModalWrapper";
import PositionSelect from "./PositionSelect";
import QTypeSelect from "./QTypeSelect";
import TierRangeSelect from "./TierRangeSelect";

interface RegisterTeamModalProps {
  closeModal: () => void;
  team?: Team;
}

export default function RegisterTeamModal({
  closeModal,
  team,
}: RegisterTeamModalProps) {
  const [mutate, { data, loading }] = useMutation("/api/posts/recruit");
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) {
      alert("모집 글 등록 중입니다.");
      return;
    }
    mutate(
      {
        teamId: team?.id,
        chiefId: team?.chiefId,
      },
      "POST"
    );
  };

  useEffect(() => {
    if (data && data.ok) {
      alert("모집 글이 등록되었습니다.");
      closeModal();
    }
  }, [data]);

  return (
    <ModalWrapper>
      <div className="flex flex-col">
        <div className="p-4 border-b border-white">
          <p>아래 정보로 모집 글을 등록하시겠습니까?</p>
          <p>팀 정보 수정을 통해 수정할 수 있습니다.</p>
        </div>
        <form
          onSubmit={onSubmit}
          className="flex flex-col justify-between flex-1 p-8 space-y-6"
        >
          <ul className="flex flex-col space-y-4 justify-evenly">
            <li className="flex items-center space-x-4">
              <p className="pl-2">팀 이름</p>
              <input
                disabled
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                type="text"
                value={team?.name}
              />
            </li>
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
                disabled
                minTier={team?.minTier || 0}
                maxTier={team?.maxTier || 9}
              />
            </li>
          </ul>
          <div className="flex justify-evenly">
            <CancelModalButton closeModal={closeModal}>취소</CancelModalButton>
            <button
              type={"submit"}
              className="w-1/3 px-4 py-2 text-white bg-blue-500 border border-blue-500 rounded-md hover:bg-black hover:text-white hover:border-white"
            >
              등록
            </button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
}
