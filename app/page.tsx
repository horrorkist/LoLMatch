"use client";

import { useSession } from "next-auth/react";
import {
  ChangeEvent,
  ChangeEventHandler,
  MouseEvent,
  useEffect,
  useState,
} from "react";
import useSWRInfinite from "swr/infinite";
import "../styles/home.css";
import Button from "./components/Button";
import PositionSelect from "./components/PositionSelect";
import PostTypeButtons from "./components/PostTypeButtons";
import QTypeSelect from "./components/QTypeSelect";
import RecruitPostModal from "./components/RecruitPostModal";
import TierRangeSelect from "./components/TierRangeSelect";
import useSWR, { preload } from "swr";
import Link from "next/link";
import Overlay from "./components/Overlay";
import CreateTeamModal from "./components/CreateTeamModal";
import { PostType } from "../lib/client/types";
import RegisterProfileModal from "./components/RegisterProfileModal";
import { Team } from "@prisma/client";
import RecruitPost from "./components/RecruitPost";
import { AnimatePresence } from "framer-motion";
import JoinPost from "./components/JoinPost";

export interface PostResponse {
  recruitPosts?: any;
  joinPosts?: any;
}

export interface IFilterParams {
  qType: number;
  minTier: number;
  maxTier: number;
  positions: number[];
}

interface TeamResponse {
  ok: boolean;
  team?: Team;
  message?: string;
}

const PositionObj = ["All", "TOP", "JUG", "MID", "ADC", "SUP"];
const PostTypeObj = ["recruit", "join"];

const limit = 5;

const initialFilterParams: IFilterParams = {
  qType: 0,
  minTier: 0,
  maxTier: 9,
  positions: [0],
};

const preloadFetcher = (url: string) => fetch(url).then((res) => res.json());

preload(
  `/api/posts/recruit?page=0&limit=${limit}&filter={"qType":0,"minTier":0,"maxTier":9,"positions":[0]}`,
  preloadFetcher
);

function Home() {
  // post 관련
  const [postType, setPostType] = useState(PostType.RECRUIT);
  const [posts, setPosts] = useState([]);
  const [filterParams, setFilterParams] =
    useState<IFilterParams>(initialFilterParams);

  // swr 관련
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/api/posts/${
      PostTypeObj[postType]
    }?page=${pageIndex}&limit=${limit}&filter=${JSON.stringify(filterParams)}`;
  };

  const { isLoading, data, setSize, isValidating } = useSWRInfinite(
    getKey,
    (url) => fetch(url).then((res) => res.json()),
    {
      // refreshInterval: 10000,
      revalidateAll: true,
      dedupingInterval: 0,
      revalidateOnFocus: false,
      refreshInterval: 10000,
      initialSize: 3,
      onSuccess(data, key, config) {
        console.log(data);
      },
    }
  );

  // session
  const session = useSession();
  const { data: teamData } = useSWR<TeamResponse>("/api/team");

  //   `/api/posts/${postType === PostType.RECRUIT ? "recruit" : "join"}?page=${
  //     page.current
  //   }&limit=${limit}`
  // );
  // const io = useRef<IntersectionObserver>();
  // const observeTarget = useRef<HTMLDivElement>(null);

  // 변경 관리 함수
  const handlePositionChange = (
    e: MouseEvent<HTMLLIElement, globalThis.MouseEvent>
  ) => {
    if (isLoading) return;
    setSize(0);

    const position = Number(e.currentTarget.dataset.position);
    const prevPositions = filterParams.positions;

    let newPositions: number[];

    if (position === 0) {
      newPositions = [0];
    } else if (prevPositions.length === 1 && prevPositions[0] === position) {
      newPositions = [0];
    } else if (prevPositions.includes(position)) {
      newPositions = prevPositions.filter((p) => p !== 0 && p !== position);
    } else {
      newPositions = [...prevPositions.filter((p) => p !== 0), position];
    }
    setFilterParams((prev) => ({
      ...prev,
      positions: newPositions,
    }));
  };

  const handleQTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (isLoading) return;
    setSize(0);
    const qType = Number(e.currentTarget.value);
    setFilterParams((prev) => ({
      ...prev,
      qType,
    }));
  };

  const handleTierChange: ChangeEventHandler = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (isLoading) return;
    setSize(0);
    const { name, value } = e.currentTarget;
    setFilterParams((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleRecruitChange = (e: MouseEvent<HTMLButtonElement>) => {
    if (isValidating || isLoading) return;
    const newPostType = Number(e.currentTarget.dataset.post_type);
    if (postType === newPostType) return;
    setPostType(newPostType);
    setSize(0);
  };

  const handleLoadMore = (e: MouseEvent<HTMLDivElement>) => {
    if (isLoading) return;
    setSize((prev) => prev + 1);
  };

  const handleClickPost = (e: MouseEvent<HTMLDivElement>) => {
    if (postType === PostType.RECRUIT) setIsPostModalOpen(true);
  };

  const handleCreateTeam = () => {
    if (session.status === "unauthenticated") {
      alert("로그인이 필요합니다.");
      return;
    }
    setInCreateTeamModal(true);
  };

  const handleRegister = () => {
    setInRegisterProfileModal(true);
  };

  // 데이터 로드
  // useEffect(() => {
  //   if (!isLoading && data) {
  //     console.log(data.flat());
  //   }
  // }, [isLoading, data]);

  // Modal 관련
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [inCreateTeamModal, setInCreateTeamModal] = useState(false);
  const [inRegisterProfileModal, setInRegisterProfileModal] = useState(false);

  const closeModal = () => {
    setIsPostModalOpen(false);
    setInCreateTeamModal(false);
    setInRegisterProfileModal(false);
  };

  // useEffect(() => {
  //   if (!observeTarget.current) return;
  //   io.current = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0].isIntersecting && size < 10) {
  //         setSize((prev) => prev + 1);
  //       }
  //     },
  //     {
  //       threshold: 0,
  //     }
  //   );
  // });

  // useEffect(() => {
  //   if (!observeTarget.current) return;
  //   if (!isLoading) {
  //     io.current?.observe(observeTarget.current);
  //   } else {
  //     io.current?.disconnect();
  //   }
  // }, [isLoading]);

  useEffect(() => {
    if (isPostModalOpen || inCreateTeamModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isPostModalOpen, inCreateTeamModal]);

  return (
    <div className={`relative p-4`}>
      {isPostModalOpen && <RecruitPostModal closeModal={closeModal} />}
      {inCreateTeamModal && (
        <Overlay closeModal={closeModal}>
          <CreateTeamModal closeModal={closeModal} />
        </Overlay>
      )}
      {inRegisterProfileModal && (
        <Overlay closeModal={closeModal}>
          <RegisterProfileModal closeModal={closeModal} />
        </Overlay>
      )}
      <main
        className={`flex flex-col w-[900px] justify-center m-auto space-y-4 `}
      >
        <div className="flex flex-row-reverse">
          {postType === PostType.JOIN ? (
            <Button onClick={handleRegister}>소환사 등록하기</Button>
          ) : (teamData?.ok === false &&
              teamData?.message === "존재하지 않는 팀입니다.") ||
            session.status === "unauthenticated" ? (
            <Button onClick={handleCreateTeam}>팀 만들기</Button>
          ) : teamData?.ok ? (
            <Link href={"/team"}>
              <Button>내 팀 보기</Button>
            </Link>
          ) : (
            <Button>로드 중...</Button>
          )}
        </div>
        <ul className="flex items-center justify-between select-none searchParams">
          <li>
            <PostTypeButtons
              handleRecruitChange={handleRecruitChange}
              postType={postType}
            />
          </li>
          <li>
            <PositionSelect
              handlePositionChange={handlePositionChange}
              positions={filterParams.positions}
              PositionObj={PositionObj}
            />
          </li>
          <li>
            <QTypeSelect handleQTypeChange={handleQTypeChange} />
          </li>
          <li>
            <TierRangeSelect
              handleTierChange={handleTierChange}
              minTier={0}
              maxTier={9}
            />
          </li>
        </ul>
        <div className="flex flex-col space-y-1">
          {postType === PostType.RECRUIT
            ? data
                ?.flat()
                .map((post) => (
                  <RecruitPost
                    key={post.id}
                    team={post.team}
                    className="flex items-center justify-around p-4 even:bg-blue-400 odd:bg-blue-300"
                  />
                ))
            : data
                ?.flat()
                .map((post) => (
                  <JoinPost
                    key={post.id}
                    user={post.user}
                    className="flex items-center justify-around p-4 even:bg-blue-400 odd:bg-blue-300"
                  />
                ))}
        </div>
        {isValidating ? (
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-gray-300 rounded-full border-x-black border-b-black animate-spin"></div>
          </div>
        ) : (
          <div
            onClick={handleLoadMore}
            className="flex items-center justify-center h-12 text-white bg-red-500 rounded-md cursor-pointer hover:opacity-50"
          >
            더 보기
          </div>
        )}
        {/* <div ref={observeTarget} className="h-12 bg-red-500"></div> */}
      </main>
    </div>
  );
}

export default Home;
