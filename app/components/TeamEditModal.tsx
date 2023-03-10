"use client";

import { Team } from "@prisma/client";
import { MouseEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useMutation from "../../lib/client/useMutation";
import CancelModalButton from "./CancelModalButton";
import { TeamData } from "./CreateTeamModal";
import ModalWrapper from "./ModalWrapper";
import PositionSelect from "./PositionSelect";
import QTypeSelect from "./QTypeSelect";
import TierRangeSelect from "./TierRangeSelect";

interface TeamEditModalProps {
  closeModal: () => void;
  team: Team;
}

interface TeamEditForm {
  name: string;
  qType: number;
  minTier: number;
  maxTier: number;
}

export default function TeamEditModal({
  closeModal,
  team,
}: TeamEditModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeamEditForm>({
    values: {
      name: team.name,
      qType: team.qType ? +team.qType : 0,
      minTier: team.minTier || 0,
      maxTier: team.maxTier || 9,
    },
  });

  const [positions, setPositions] = useState<number[]>(
    JSON.parse(team.positions || "[0]")
  );
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

  const onSubmit = (data: TeamEditForm) => {
    if (loading) return;
    mutate(
      {
        team,
        name: data.name,
        qType: data.qType + "",
        minTier: data.minTier,
        maxTier: data.maxTier,
        positions,
      },
      "PATCH"
    );
  };

  useEffect(() => {
    if (data && data.ok) {
      alert("??? ????????? ?????????????????????.");
      closeModal();
    }
  }, [data]);

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
        className="flex flex-col justify-between flex-1 p-8 space-y-6"
      >
        <ul className="flex flex-col space-y-4 justify-evenly">
          <li className="flex items-center space-x-4">
            <p className="pl-2">??? ??????</p>
            <input
              {...register("name", {
                required: "??? ????????? ??????????????????.",
                maxLength: {
                  value: 10,
                  message: "??? ????????? 10??? ????????? ??????????????????.",
                },
              })}
              className="px-4 py-2 text-black rounded-md focus:outline-none"
              type="text"
            />
          </li>
          <li className="flex flex-col space-y-2">
            <p className="pl-2">??? ??????</p>
            <QTypeSelect register={register} />
          </li>
          <li className="flex flex-col space-y-2">
            <p className="pl-2">?????? ?????????</p>
            <PositionSelect
              handlePositionChange={handlePositionChange}
              positions={positions}
            />
          </li>
          <li className="flex flex-col space-y-2">
            <p className="pl-2">?????? ??????</p>
            <TierRangeSelect
              register={register}
              minTier={team.minTier || 0}
              maxTier={team.maxTier || 0}
            />
          </li>
        </ul>
        <div className="flex justify-evenly">
          <CancelModalButton closeModal={closeModal}>??????</CancelModalButton>
          <button
            type={"submit"}
            className="w-1/3 px-4 py-2 text-white bg-blue-500 border border-blue-500 rounded-md hover:bg-black hover:text-white hover:border-white"
          >
            ??????
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}
