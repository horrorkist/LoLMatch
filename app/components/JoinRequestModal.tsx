import { useEffect } from "react";
import { RequestWithUser } from "../(userInfo)/team/page";
import useMutation from "../../lib/client/useMutation";
import Button from "./Button";
import ModalWrapper from "./ModalWrapper";
import TierImage from "./TierImage";
import UserLinkName from "./UserLinkName";
import UserMatchHistory from "./UserMatchHistory";
import WinRateBar from "./WinRateBar";

interface JoinRequestModalProps {
  request: RequestWithUser;
  closeModal: () => void;
  teamId: string;
}

const PositionArray = ["상관없음", "탑", "정글", "미드", "원딜", "서폿"];
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

export default function JoinRequestModal({
  request,
  closeModal,
  teamId,
}: JoinRequestModalProps) {
  const [mutate, { data, loading }] = useMutation("/api/team/members");
  const onAcceptClick = () => {
    if (loading) {
      alert("잠시만 기다려주세요.");
      return;
    }

    mutate(
      {
        teamId,
        requestId: request.id,
      },
      "PATCH"
    );
  };

  useEffect(() => {
    if (data && data.ok) {
      alert("가입 신청을 수락했습니다.");
      closeModal();
      return;
    }

    if (data && !data.ok) {
      alert(data.message);
      return;
    }
  }, [data]);
  return (
    <ModalWrapper>
      <div>
        <header className="flex items-center p-4 border-b-2 border-gray-300">
          <p>가입 신청</p>
        </header>
        <main className="flex flex-col justify-between flex-1 p-4 space-y-6">
          <div className="flex space-x-6">
            <div className="flex items-center pl-2 space-x-4">
              <p>소환사 명</p>
              <UserLinkName>{request.sentUser.summonerName}</UserLinkName>
            </div>
            <div className="flex items-center pl-2 space-x-4">
              {request.sentUser.tier ? (
                <>
                  <TierImage
                    tier={request.sentUser.tier}
                    width={40}
                    height={40}
                  />
                  <div className="flex">
                    <p>{TierArray[request.sentUser.tier]}</p>
                    &nbsp;
                    <p>{request.sentUser.rank}</p>
                  </div>
                </>
              ) : (
                <p>언랭크</p>
              )}
            </div>
          </div>
          <div className="flex flex-col pl-2 space-y-2">
            <p>승률</p>
            <WinRateBar user={request.sentUser} />
          </div>
          <div className="flex flex-col pl-2 space-y-2">
            <p>최근 전적</p>
            <UserMatchHistory user={request.sentUser} count={10} />
          </div>
          <div className="flex items-center justify-center w-full space-x-2">
            <p className="whitespace-nowrap">위 유저가</p>
            <strong className="pb-1 text-2xl font-bold text-white whitespace-nowrap">
              {PositionArray[JSON.parse(request.position || "[0]")[0]]}
            </strong>
            <p className="whitespace-nowrap">포지션으로 신청했습니다.</p>
          </div>
          <div className="flex justify-evenly">
            <Button onClick={closeModal} className="w-1/3" cancel>
              취소
            </Button>
            <Button onClick={onAcceptClick} className="w-1/3">
              수락
            </Button>
          </div>
        </main>
      </div>
    </ModalWrapper>
  );
}
