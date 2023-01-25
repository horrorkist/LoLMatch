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
import useSWR from "swr";
import Link from "next/link";
import Overlay from "./components/Overlay";
import CreateTeamModal from "./components/CreateTeamModal";
import { PostType } from "../lib/client/types";

export interface Post {
  id: number;
  title: string;
  content: string;
  positions: number[];
  minTier: number;
  maxTier: number;
  qType: number;
}

export interface IFilterParams {
  qType: number;
  minTier: number;
  maxTier: number;
  positions: number[];
}

const PositionObj = ["All", "TOP", "JUG", "MID", "ADC", "SUP"];
const PostTypeObj = ["recruit", "join"];

const limit = 10;

const initialFilterParams: IFilterParams = {
  qType: 0,
  minTier: 0,
  maxTier: 9,
  positions: [0],
};

function Home() {
  // post 관련
  const [postType, setPostType] = useState(PostType.RECRUIT);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filterParams, setFilterParams] =
    useState<IFilterParams>(initialFilterParams);

  // swr 관련
  const getKey = (pageIndex: number, previousPageData: Post[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/api/posts/${
      PostTypeObj[postType]
    }?page=${pageIndex}&limit=${limit}&filter=${JSON.stringify(filterParams)}`;
  };

  const { isLoading, data, setSize } = useSWRInfinite(getKey);

  // session
  const session = useSession();
  const { data: teamData } = useSWR("/api/team");

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
    setSize(1);

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
    setSize(1);
    const qType = Number(e.currentTarget.value);
    setFilterParams((prev) => ({
      ...prev,
      qType,
    }));
  };

  const handleTierChange: ChangeEventHandler = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setSize(1);
    const { name, value } = e.currentTarget;
    setFilterParams((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleRecruitChange = (e: MouseEvent<HTMLButtonElement>) => {
    setSize(1);
    const newPostType = Number(e.currentTarget.dataset.post_type);
    if (postType === newPostType) return;
    setPostType(newPostType);
  };

  const handleLoadMore = (e: MouseEvent<HTMLDivElement>) => {
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

  // 데이터 로드
  useEffect(() => {
    if (!isLoading && data) {
      setPosts(data);
    }
  }, [isLoading, data]);

  // Modal 관련
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [inCreateTeamModal, setInCreateTeamModal] = useState(false);

  const closeModal = () => {
    setIsPostModalOpen(false);
    setInCreateTeamModal(false);
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

  useEffect(() => {
    console.log(session);
  }, [session]);

  return (
    <div className={`relative p-4`}>
      {isPostModalOpen && <RecruitPostModal closeModal={closeModal} />}
      {inCreateTeamModal && (
        <Overlay closeModal={closeModal}>
          <CreateTeamModal closeModal={closeModal} />
        </Overlay>
      )}
      <main
        className={`flex flex-col w-[900px] justify-center m-auto space-y-4 `}
      >
        <div className="flex flex-row-reverse">
          {postType === PostType.JOIN ? (
            <Button>소환사 등록하기</Button>
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
          {posts?.flat().map((post, index) => (
            <div
              key={index}
              onClick={handleClickPost} // delegation
              className="w-full p-4 cursor-pointer odd:bg-sky-500 even:bg-blue-300"
            >
              {post.content}
              원하는 포지션 :
              {post.positions
                .map((position) => PositionObj[position])
                .join(", ")}
            </div>
          ))}
        </div>
        {/* <div ref={observeTarget} className="h-12 bg-red-500"></div> */}
        <div
          onClick={handleLoadMore}
          className="h-12 bg-red-500 cursor-pointer hover:opacity-50"
        />
      </main>
    </div>
  );
}

export default Home;
