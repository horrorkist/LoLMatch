"use client";

import {
  ChangeEvent,
  ChangeEventHandler,
  MouseEvent,
  useEffect,
  useRef,
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
import RegisterProfileModal from "./components/RegisterProfileModal";
import { JoinPost, Team, User } from "@prisma/client";
import RecruitPost from "./components/RecruitPost";
import JoinPostComponent from "./components/JoinPost";
import { TeamWithMembers } from "./(userInfo)/team/page";
import JoinPostModal from "./components/JoinPostModal";
import { AnimatePresence } from "framer-motion";
import Spinner from "./components/Spinner";
import useLoggedIn from "../lib/client/useLoggedIn";

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

export interface JoinPostWithUser extends JoinPost {
  user: User;
}

interface UserResponse {
  ok: boolean;
  user?: User;
  error?: any;
}

enum ModalType {
  JOIN_POST,
  RECRUIT_POST,
  CREATE_TEAM,
  REGISTER_PROFILE,
}

const PostTypeObj = ["recruit", "join"];

const limit = 5;

const initialFilterParams: IFilterParams = {
  qType: 0,
  minTier: 0,
  maxTier: 9,
  positions: [0],
};

// const preloadFetcher = (url: string) => fetch(url).then((res) => res.json());

// preload(
//   `/api/posts/recruit?page=0&limit=${limit}&filter={"qType":0,"minTier":0,"maxTier":9,"positions":[0]}`,
//   preloadFetcher
// );

interface EndPointProps {
  postType: number;
  firstCreatedAt: number | undefined;
  lastCreatedAt: number | undefined;
  positions: number[];
  qType: number;
  minTier: number;
  maxTier: number;
}

const getAPIEndPoint = ({
  postType,
  firstCreatedAt,
  lastCreatedAt,
  positions,
  qType,
  minTier,
  maxTier,
}: EndPointProps) => {
  return `/api/posts/${
    PostTypeObj[postType]
  }?firstCreatedAt=${firstCreatedAt}&lastCreatedAt=${lastCreatedAt}&limit=${limit}&positions=${JSON.stringify(
    positions
  )}&qType=${qType}&minTier=${minTier}&maxTier=${maxTier}`;
};

const pollInterval = 1000 * 20;

function Home() {
  // post ??????
  const [posts, setPosts] = useState<any[]>([]);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [postType, setPostType] = useState(PostType.RECRUIT);
  const [filterParams, setFilterParams] =
    useState<IFilterParams>(initialFilterParams);
  const intervalId = useRef<NodeJS.Timer>();

  // swr ??????
  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/api/posts/${
      PostTypeObj[postType]
    }?page=${pageIndex}&limit=${limit}&filter=${JSON.stringify(filterParams)}`;
  };

  const { isLoading, data, setSize, isValidating, mutate } = useSWRInfinite(
    getKey,
    (url) => fetch(url).then((res) => res.json()),
    {
      // refreshInterval: 10000,
      revalidateAll: true,
      dedupingInterval: 0,
      revalidateOnFocus: false,
      refreshInterval: 1000 * 20,
      initialSize: 3,
      onSuccess(data, key, config) {
        console.log(data);
      },
    }
  );

  const { data: userData, isLoading: userLoading } =
    useSWR<UserResponse>("/api/users/me");

  // session
  const [loggedIn, _] = useLoggedIn();

  // ?????? ?????? ??????
  const handlePositionChange = (
    e: MouseEvent<HTMLLIElement, globalThis.MouseEvent>
  ) => {
    if (isLoading || isValidating) return;

    const position = Number(e.currentTarget.dataset.position);
    const prevPositions = filterParams.positions;
    if (position === 0 && prevPositions.length === 1 && prevPositions[0] === 0)
      return;
    setSize(0);

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

    if (newPositions.length >= 5) {
      newPositions = [0];
    }

    setFilterParams((prev) => ({
      ...prev,
      positions: newPositions,
    }));
  };

  const handleQTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (isLoading || isValidating) return;
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
    if (isLoading || isValidating) return;
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

  const handleLoadMore = () => {
    if (isLoading || isValidating) return;
    setSize((prev) => prev + 1);
  };

  const handleClickRecruitPost = (team: TeamWithMembers) => {
    setRecruitTeam(team);
    setInModal(true);
    setModalType(ModalType.RECRUIT_POST);
  };

  const handleClickJoinPost = (post: JoinPostWithUser) => {
    setClickedJoinPost(post);
    setInModal(true);
    setModalType(ModalType.JOIN_POST);
  };

  const handleCreateTeam = () => {
    if (!loggedIn) {
      alert("???????????? ???????????????.");
      return;
    }
    setInModal(true);
    setModalType(ModalType.CREATE_TEAM);
  };

  const handleRegister = () => {
    setInModal(true);
    setModalType(ModalType.REGISTER_PROFILE);
  };

  // ????????? ??????
  // useEffect(() => {
  //   if (!isLoading && data) {
  //     console.log(data.flat());
  //   }
  // }, [isLoading, data]);

  // Modal ??????
  const [inModal, setInModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>();
  const [recruitTeam, setRecruitTeam] = useState<TeamWithMembers>();
  const [clickedJoinPost, setClickedJoinPost] = useState<JoinPostWithUser>();

  const closeModal = () => {
    setInModal(false);
  };

  useEffect(() => {
    if (inModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [inModal]);

  return (
    <div className={`relative p-4`}>
      <AnimatePresence>
        {inModal && modalType === ModalType.RECRUIT_POST && recruitTeam && (
          <Overlay closeModal={closeModal}>
            <RecruitPostModal team={recruitTeam} closeModal={closeModal} />
          </Overlay>
        )}
        {inModal && modalType === ModalType.CREATE_TEAM && userData?.user && (
          <Overlay closeModal={closeModal}>
            <CreateTeamModal user={userData?.user} closeModal={closeModal} />
          </Overlay>
        )}
        {inModal && modalType === ModalType.REGISTER_PROFILE && (
          <Overlay closeModal={closeModal}>
            <RegisterProfileModal
              mutatePosts={mutate}
              closeModal={closeModal}
            />
          </Overlay>
        )}
        {inModal && modalType === ModalType.JOIN_POST && clickedJoinPost && (
          <Overlay closeModal={closeModal}>
            <JoinPostModal closeModal={closeModal} post={clickedJoinPost} />
          </Overlay>
        )}
      </AnimatePresence>
      <main
        className={`flex flex-col w-[900px] justify-center m-auto space-y-4 `}
      >
        <div className="flex flex-row-reverse">
          {postType === PostType.JOIN ? (
            <Button onClick={handleRegister}>????????? ????????????</Button>
          ) : !userData?.user?.teamId || !loggedIn ? (
            <Button onClick={handleCreateTeam}>??? ?????????</Button>
          ) : userData.user.teamId ? (
            <Link href={"/team"}>
              <Button>??? ??? ??????</Button>
            </Link>
          ) : (
            <Button>?????? ???...</Button>
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
          {postType === PostType.RECRUIT ? (
            <div className="flex items-center w-full h-8 space-x-4 text-xs text-gray-400 bg-slate-600">
              <div className="w-[140px] pl-4 text-left">??? ??????</div>
              <div className="w-[182px] text-center">??????</div>
              <div className="text-center w-[70px]">?????? ??????</div>
              <div className="text-center w-[175px]">?????? ?????????</div>
              <div className="w-[210px] text-center">?????? ??????</div>
            </div>
          ) : (
            <div className="flex items-center w-full h-8 space-x-4 text-xs text-gray-400 bg-slate-600">
              <div className="w-[190px] pl-4 text-left">????????? ???</div>
              <div className="w-[62px] text-center">??????</div>
              <div className="text-center w-[195px]">?????? ?????????</div>
              <div className="text-center w-[108px]">??????</div>
              <div className="flex-1 text-center">?????? ??????</div>
            </div>
          )}
          {data?.flat().length === 0 ? (
            <div className="flex items-center justify-center h-10 text-white">
              ????????? ?????? ?????? ????????????.
            </div>
          ) : postType === PostType.RECRUIT ? (
            data
              ?.flat()
              .map((post) => (
                <RecruitPost
                  onClick={() => handleClickRecruitPost(post.team)}
                  key={post.id}
                  team={post.team}
                  className="flex items-center p-4 text-white cursor-pointer bg-slate-700 hover:bg-slate-800"
                />
              ))
          ) : (
            data?.flat().map((post) => (
              <JoinPostComponent
                onClick={() => {
                  if (userData?.user?.teamId) {
                    handleClickJoinPost(post);
                  } else {
                    alert("?????? ?????? ??????????????????.");
                  }
                }}
                key={post.id}
                user={post.user}
                className="flex items-center p-2 text-white cursor-pointer bg-slate-700 hover:bg-slate-800"
              />
            ))
          )}
        </div>
        {isValidating ? (
          <Spinner />
        ) : (
          <div
            onClick={handleLoadMore}
            className="flex items-center justify-center h-12 text-white bg-red-500 rounded-md cursor-pointer hover:opacity-50"
          >
            ??? ??????
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
