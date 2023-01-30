"use client";

import { FormEvent, useEffect, useState } from "react";
import useMutation from "../../lib/client/useMutation";
import { JoinPostWithUser } from "../page";
import PositionSelect from "./PositionSelect";
import QTypeSelect from "./QTypeSelect";
import TierSelect from "./TierSelect";
import UserLinkName from "./UserLinkName";

interface JoinPostModalProps {
  closeModal: () => void;
  post: JoinPostWithUser;
}

const PositionObj = ["All", "TOP", "JUG", "MID", "ADC", "SUP"];

export default function JoinPostModal({
  closeModal,
  post,
}: JoinPostModalProps) {
  const [mutateInvitation, { data, loading }] = useMutation("/api/invitations");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) {
      alert("잠시 기다려주세요.");
      return;
    }

    mutateInvitation(
      {
        invitedId: post.user.id,
      },
      "POST"
    );
  };

  return (
    <div
      className="relative text-gray-300 rounded-md bg-slate-500"
      onClick={(e) => e.stopPropagation()}
    >
      <form
        onSubmit={onSubmit}
        className="flex flex-col justify-between flex-1 p-8 space-y-6"
      >
        <ul className="flex flex-col space-y-4 justify-evenly">
          <li className="flex items-center space-x-4">
            <p className="pl-2">소환사 이름</p>
            <UserLinkName>{post.user.summonerName}</UserLinkName>
          </li>
          <li className="flex flex-col space-y-2">
            <p className="pl-2">큐 타입</p>
            <QTypeSelect disabled value={post.qType} />
          </li>
          <li className="flex flex-col space-y-2">
            <p className="pl-2">선호 포지션</p>
            <PositionSelect
              positions={JSON.parse(post.user.positions || "[0]")}
              PositionObj={PositionObj}
            />
          </li>
          <li className="flex flex-col space-y-2">
            <p className="pl-2">티어</p>
            <TierSelect disabled value={post.user.tier} />
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
            초대
          </button>
        </div>
      </form>
    </div>
  );
}
