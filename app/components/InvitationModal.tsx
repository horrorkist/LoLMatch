import { useEffect } from "react";
import { InvitationWithTeam } from "../(userInfo)/invitations/page";
import useMutation from "../../lib/client/useMutation";
import Button from "./Button";
import Spinner from "./Spinner";
import UserInfoBar from "./UserInfoBar";

interface InvitationModalProps {
  closeModal: () => void;
  invitation: InvitationWithTeam;
  mutateInvitations: any;
}

interface InvitationResponse {
  ok: boolean;
  message?: string;
  invitation?: InvitationWithTeam;
}

const PositionArray = ["상관없음", "탑", "정글", "미드", "바텀", "서포터"];

export default function InvitationModal({
  closeModal,
  invitation,
  mutateInvitations,
}: InvitationModalProps) {
  const [mutate, { loading, data }] = useMutation<InvitationResponse>(
    "api/users/me/invitations"
  );
  const onDeclineClick = () => {
    if (loading) {
      alert("잠시만 기다려주세요.");
      return;
    }

    if (confirm("정말로 거절하시겠습니까?")) {
      mutate(
        {
          invitationId: invitation.id,
        },
        "PATCH"
      );
    }
  };

  const onAcceptClick = () => {
    if (loading) {
      alert("잠시만 기다려주세요.");
      return;
    }

    mutate(
      {
        invitationId: invitation.id,
      },
      "DELETE"
    );
  };

  useEffect(() => {
    if (data && !data.ok) {
      alert(data.message);
    }

    if (data && data.ok) {
      if (!data.invitation) {
        alert("초대를 수락했습니다.");
      }
      closeModal();
    }

    mutateInvitations();
  }, [data]);
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className="flex flex-col divide-white rounded-md bg-slate-500 divide-y-1"
    >
      <header className="flex justify-between p-4">
        <h4>초대 팀 정보</h4>
        <button onClick={closeModal}>X</button>
      </header>
      <section>
        <section className="flex p-4 space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-gray-400">팀 이름</p>
            <p className="text-lg">{invitation.sentTeam.name}</p>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-gray-400">팀장</p>
            <p className="text-lg">{invitation.sentTeam.chief.summonerName}</p>
          </div>
        </section>
        <ul className="flex flex-col">
          <li>
            <UserInfoBar user={invitation.sentTeam.chief} />
          </li>
          {invitation.sentTeam.members.map((member) => {
            if (member.id === invitation.sentTeam.chief.id) return;

            return (
              <li key={member.id}>
                <UserInfoBar user={member} />
              </li>
            );
          })}
        </ul>
        <div className="w-full my-4 text-center">
          <p className="whitespace-nowrap">
            위 팀에서 당신을&nbsp;
            <strong className="text-2xl font-semibold">
              {PositionArray[invitation.position]}
            </strong>{" "}
            포지션으로 초대했습니다.
          </p>
        </div>
        <section className="flex w-full p-4 justify-evenly">
          <Button cancel onClick={onDeclineClick} className="w-1/5">
            거절
          </Button>
          <Button className="w-1/5" onClick={onAcceptClick}>
            {loading ? <Spinner /> : "수락"}
          </Button>
        </section>
      </section>
    </div>
  );
}
