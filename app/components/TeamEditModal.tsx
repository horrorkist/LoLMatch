"use client";

import { MouseEvent, useState } from "react";
import { useForm } from "react-hook-form";
import PositionSelect from "./PositionSelect";
import QTypeSelect from "./QTypeSelect";
import TierRangeSelect from "./TierRangeSelect";

interface TeamEditModalProps {
  closeModal: () => void;
}

const PositionObj = ["All", "TOP", "JUG", "MID", "ADC", "SUP"];

export default function TeamEditModal({ closeModal }: TeamEditModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [positions, setPositions] = useState<number[]>([0]);

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

  return (
    <div
      className="text-gray-300 rounded-md bg-slate-500"
      onClick={(e) => e.stopPropagation()}
    >
      <form
        onSubmit={handleSubmit((data) => console.log(data))}
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
              defaultValue={"달려라불사조"}
            />
          </li>
          <li className="flex flex-col space-y-2">
            <p className="pl-2">큐 타입</p>
            <QTypeSelect register={register} />
          </li>
          <li className="flex flex-col space-y-2">
            <p className="pl-2">원하는 포지션</p>
            <PositionSelect
              handlePositionChange={handlePositionChange}
              positions={positions}
              PositionObj={PositionObj}
            />
          </li>
          <li className="flex flex-col space-y-2">
            <p className="pl-2">원하는 티어</p>
            <TierRangeSelect register={register} minTier={4} maxTier={7} />
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
    </div>
  );
}
