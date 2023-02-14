"use client";

import { useEffect, useState } from "react";
import Overlay from "../../components/Overlay";
import PositionSelect from "../../components/PositionSelect";
import QTypeSelect from "../../components/QTypeSelect";
import TeamEditModal from "../../components/TeamEditModal";
import TierRangeSelect from "../../components/TierRangeSelect";
import useSWR from "swr";
import Button from "../../components/Button";
import CreateTeamModal from "../../components/CreateTeamModal";
import { Invitation, Request, Team, User } from "@prisma/client";
import { useForm } from "react-hook-form";
import RegisterTeamModal from "../../components/RegisterTeamModal";
import { AnimatePresence } from "framer-motion";
import UserInfoBar from "../../components/UserInfoBar";
import UserLinkName from "../../components/UserLinkName";
import TierImage from "../../components/TierImage";
import JoinRequestModal from "../../components/JoinRequestModal";
import useMutation from "../../../lib/client/useMutation";
import useLoggedIn from "../../../lib/client/useLoggedIn";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Spinner from "../../components/Spinner";
import { getPositionSVG } from "../../components/positionSVG";

export interface RequestWithUser extends Request {
  sentUser: User;
}

export interface TeamWithMembers extends Team {
  chief: User;
  members: User[];
  receivedRequests: RequestWithUser[];
  sentInvitations: Invitation[];
}

interface TeamResponse {
  ok: boolean;
  team?: TeamWithMembers;
  error?: any;
  message?: string;
}

const TierArray = [
  "_",
  "Iron",
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Diamond",
  "Master",
  "Grandmaster",
  "Challenger",
];

enum ModalType {
  EDIT,
  REGISTER,
  CREATE,
  REQUEST,
}

export default function TeamInfo() {
  const [loggedIn, _] = useLoggedIn();
  const [inModal, setInModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>();
  const [clickedRequest, setClickedRequest] = useState<RequestWithUser>();
  const {
    data,
    isLoading,
    mutate: teamMutate,
  } = useSWR<TeamResponse>("/api/team");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { register } = useForm<{
    qType: string;
    minTier: number;
    maxTier: number;
  }>({
    values: {
      qType: data?.team?.qType || "0",
      minTier: data?.team?.minTier || 0,
      maxTier: data?.team?.maxTier || 9,
    },
  });
  const { data: userData, isLoading: userLoading } = useSWR("/api/users/me");
  const [isChief, setIsChief] = useState(false);
  const [mutateExit, { data: exitData, loading: exitLoading }] = useMutation(
    "api/team/members/me"
  );
  const [mutateMember, { data: memberData, loading: memberLoading }] =
    useMutation("api/team/members");

  const closeModal = () => {
    setInModal(false);
    setModalType(undefined);
  };

  const onDeleteClick = () => {
    if (deleteLoading) {
      alert("잠시만 기다려주세요.");
      return;
    }
    if (!data || !data.team) return;
    if (confirm("정말로 팀을 해체하시겠습니까?")) {
      if (data.team.members.length > 1) {
        alert("팀원이 남아있어 팀을 해체할 수 없습니다.");
        return;
      }

      if (userData?.user?.id !== data.team.chiefId) {
        alert("권한이 없습니다.");
        return;
      }
      setDeleteLoading(true);
      fetch("/api/team", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamId: data.team.id }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.ok) {
            alert("팀을 해체했습니다.");
            teamMutate({
              ok: false,
              message: "존재하지 않는 팀입니다.",
            });
          } else {
            alert(data.message);
          }
        });
      setDeleteLoading(false);
    }
  };

  const onCreateClick = () => {
    if (!loggedIn) {
      alert("로그인 후 이용해주세요.");
      return;
    }

    setInModal(true);
    setModalType(ModalType.CREATE);
  };

  const onEditclick = () => {
    setInModal(true);
    setModalType(ModalType.EDIT);
  };

  const onRegisterClick = () => {
    setInModal(true);
    setModalType(ModalType.REGISTER);
  };

  const onRequestClick = (request: RequestWithUser) => {
    if (!isChief) return;

    setInModal(true);
    setClickedRequest(request);
    setModalType(ModalType.REQUEST);
  };

  const onExitClick = () => {
    if (exitLoading) {
      alert("잠시만 기다려주세요.");
      return;
    }

    if (confirm("정말로 팀에서 탈퇴하시겠습니까?")) {
      mutateExit(
        {
          teamId: data?.team?.id,
        },
        "DELETE"
      );
    }
  };

  const onBanClick = (id: string) => {
    if (!isChief) return;
    if (memberLoading) return alert("잠시만 기다려주세요.");

    if (confirm("정말로 이 팀원을 내보내시겠습니까?")) {
      mutateMember(
        {
          teamId: data?.team?.id,
          memberId: id,
        },
        "DELETE"
      );
    }
  };

  useEffect(() => {
    if (inModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  });

  useEffect(() => {
    if (data && data.ok) {
      setIsChief(data.team?.chiefId === userData?.user?.id);
    }
  }, [data]);

  useEffect(() => {
    if (exitData && exitData.ok) {
      alert("팀에서 탈퇴했습니다.");
      teamMutate({
        ok: false,
        message: "존재하지 않는 팀입니다.",
      });
      return;
    }

    if (exitData && !exitData.ok) {
      alert(exitData.message);
      return;
    }
  }, [exitData]);

  useEffect(() => {
    if (memberData && memberData.ok) {
      alert("팀원을 내보냈습니다.");
      teamMutate();
      return;
    }

    if (memberData && !memberData.ok) {
      alert(memberData.message);
      return;
    }
  }, [memberData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-1 text-2xl">
        팀 정보를 불러 오는 중...
      </div>
    );
  }

  if (
    data &&
    !data.ok &&
    (data.message === "존재하지 않는 팀입니다." || data.message === "세션 없음")
  ) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 space-y-4">
        {inModal && modalType === ModalType.CREATE && (
          <AnimatePresence>
            <Overlay closeModal={closeModal}>
              <CreateTeamModal user={userData?.user} closeModal={closeModal} />
            </Overlay>
          </AnimatePresence>
        )}
        <h1 key={"teamH1"} className="text-2xl">
          아직 팀이 없으시네요!
        </h1>
        <Button key={"teampagecreatebutton"} onClick={onCreateClick}>
          팀 만들기
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-between flex-1">
      <AnimatePresence>
        {inModal && modalType === ModalType.EDIT && (
          <Overlay closeModal={closeModal}>
            <TeamEditModal team={data?.team!} closeModal={closeModal} />
          </Overlay>
        )}
        {inModal && modalType === ModalType.REGISTER && (
          <Overlay closeModal={closeModal}>
            <RegisterTeamModal team={data?.team!} closeModal={closeModal} />
          </Overlay>
        )}
        {inModal && modalType === ModalType.REQUEST && clickedRequest && (
          <Overlay closeModal={closeModal}>
            <JoinRequestModal
              closeModal={closeModal}
              request={clickedRequest}
              teamId={data?.team?.id!}
              teamMutate={teamMutate}
            />
          </Overlay>
        )}
      </AnimatePresence>
      <div className="flex items-center justify-center w-full">
        <div className="flex flex-col space-y-4 2xl:w-[1080px]">
          <h1 className="flex items-center justify-start w-full text-3xl text-white">
            <p>{data?.team?.name}</p>
            {isChief ? (
              <>
                <Button className="ml-4 text-sm" onClick={onEditclick}>
                  팀 정보 수정
                </Button>
                <Button className="ml-4 text-sm" onClick={onRegisterClick}>
                  모집 글 등록
                </Button>
                <Button
                  onClick={onDeleteClick}
                  cancel
                  className="ml-auto text-xs text-red-500 bg-white border border-black hover:bg-red-500 hover:text-white hover:border-black"
                >
                  팀 해체하기
                </Button>
              </>
            ) : (
              <Button
                onClick={onExitClick}
                cancel
                className="ml-auto text-xs text-red-500 bg-white border border-black hover:bg-red-500 hover:text-white hover:border-black"
              >
                팀 탈퇴하기
              </Button>
            )}
          </h1>
          <div className="h-full">
            <section className="flex flex-col w-full h-full overflow-hidden rounded-md bg-slate-400">
              <header className="flex p-4 space-x-8 text-white border-b border-black">
                <div className="flex flex-col space-y-2">
                  <p className="pl-2">큐 타입</p>
                  <QTypeSelect
                    register={register}
                    disabled
                    value={data?.team?.qType}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <p className="pl-2">모집 포지션</p>
                  <PositionSelect
                    positions={JSON.parse(data?.team?.positions || "[0]")}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <p className="pl-2">모집 티어</p>
                  <TierRangeSelect
                    disabled
                    register={register}
                    minTier={data?.team?.minTier || 0}
                    maxTier={data?.team?.maxTier || 9}
                  />
                </div>
              </header>
              <ul className="grid flex-1 grid-cols-1 grid-rows-5 space-y-1">
                <li className="relative w-full">
                  <UserInfoBar
                    key={`teamuserinfo${data?.team?.id}`}
                    user={data?.team?.chief!}
                  />
                  <p className="absolute inset-y-0 flex items-center right-4">
                    팀장
                  </p>
                </li>
                {data?.team?.members.map((user) => {
                  if (user.id === data?.team?.chief?.id) return;
                  return (
                    <li className="relative flex items-center" key={user.id}>
                      <UserInfoBar user={user} />
                      <div
                        onClick={() => onBanClick(user.id)}
                        className="absolute right-2 xl:text-[50px] cursor-pointer flex justify-center items-center h-fit lg:text-[30px] text-white hover:text-red-500 hover:rotate-45 transition-all"
                      >
                        {isChief &&
                          (memberLoading ? (
                            <Spinner />
                          ) : (
                            <RemoveCircleOutlineIcon fontSize="inherit" />
                          ))}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        </div>
      </div>
      {isChief && (
        <div className="flex flex-col max-w-sm p-4 space-y-4 bg-blue-300">
          <h1 className="font-semibold text-white 2xl:text-2xl xl:text-xl">
            가입 신청 목록
          </h1>
          <div className="flex-1">
            <section className="w-full h-full bg-white rounded-md">
              <ul className="flex flex-col w-[250px] h-full space-y-1 overflow-scroll">
                {data?.team?.receivedRequests?.map((request) => {
                  return (
                    <li
                      onClick={() => onRequestClick(request)}
                      className="flex items-center justify-start p-4 space-x-4 text-white cursor-pointer bg-slate-500 hover:bg-slate-400"
                      key={request.id}
                    >
                      {request.sentUser.tier && request.sentUser.tier > 0 ? (
                        <div className="flex flex-col items-center justify-between space-y-1">
                          <p className="text-xs whitespace-nowrap">
                            {TierArray[request.sentUser.tier]}{" "}
                            {request.sentUser.rank}
                          </p>
                          <TierImage
                            tier={request.sentUser.tier}
                            width={40}
                            height={40}
                          />
                        </div>
                      ) : (
                        <p className="text-center whitespace-nowrap">언랭크</p>
                      )}
                      <UserLinkName className="overflow-hidden w-[100px] whitespace-nowrap text-ellipsis">
                        {request.summonerName}
                      </UserLinkName>
                      <div className="flex items-center justify-center">
                        {JSON.parse(request?.position || "[0]").map(
                          (position: number) => {
                            return getPositionSVG(position);
                          }
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
