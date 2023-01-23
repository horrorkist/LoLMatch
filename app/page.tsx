"use client";

import Link from "next/link";
import {
  ChangeEvent,
  ChangeEventHandler,
  MouseEvent,
  useEffect,
  useState,
} from "react";
import useSWRInfinite from "swr/infinite";
import "../styles/home.css";
import PositionSelect from "./components/PositionSelect";
import PostTypeButtons from "./components/PostTypeButtons";
import QTypeSelect from "./components/QTypeSelect";
import TierRangeSelect from "./components/TierRangeSelect";

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

export enum PostType {
  RECRUIT = 0,
  JOIN = 1,
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
      return;
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

  // 데이터 로드
  useEffect(() => {
    if (!isLoading && data) {
      setPosts(data);
    }
  }, [isLoading, data]);

  // Modal 관련
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

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
    if (isPostModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isPostModalOpen]);

  return (
    <div className={`pt-24 relative`}>
      {isPostModalOpen && (
        <div
          onClick={() => setIsPostModalOpen(false)}
          className="fixed top-0 bottom-0 left-0 right-0 z-20 flex items-center justify-center w-screen h-screen bg-black bg-opacity-50 overlay"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col text-gray-300 border-blue-500 rounded-md select-none min-w-min w-96 bg-slate-500 modal"
          >
            <header className="flex items-center justify-between border-b-2 border-gray-300">
              <h1 className="p-4">팀 이름</h1>
              <button className="p-4" onClick={() => setIsPostModalOpen(false)}>
                X
              </button>
            </header>
            <main className="flex flex-col justify-between flex-1 p-4 space-y-6">
              <div className="flex space-x-4">
                <p>팀장</p>
                <a
                  href={`https://op.gg/summoners/kr/달려라불사조`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <p className="text-white">달려라불사조</p>
                </a>
              </div>
              <section>
                <ul className="flex flex-col space-y-4 justify-evenly">
                  <li className="flex flex-col space-y-2">
                    <p className="pl-2">큐 타입</p>
                    <QTypeSelect disabled />
                  </li>
                  <li className="flex flex-col space-y-2">
                    <p className="pl-2">원하는 포지션</p>
                    <PositionSelect PositionObj={PositionObj} />
                  </li>
                  <li className="flex flex-col space-y-2">
                    <p className="pl-2">원하는 티어</p>
                    <TierRangeSelect minTier={4} maxTier={7} disabled />
                  </li>
                </ul>
              </section>
              <section>
                <div className="flex self-end justify-evenly">
                  <button
                    onClick={() => setIsPostModalOpen(false)}
                    className="w-1/3 px-4 py-2 text-black bg-white border border-black rounded-md hover:border-none hover:bg-red-700 hover:text-white hover:border-transparent"
                  >
                    취소
                  </button>
                  <button className="w-1/3 px-4 py-2 text-white bg-blue-500 border border-blue-500 rounded-md hover:bg-black hover:text-white hover:border-white">
                    신청
                  </button>
                </div>
              </section>
            </main>
          </div>
        </div>
      )}
      <main className={`flex flex-col w-[900px] justify-center m-auto `}>
        <ul className="flex items-center justify-between my-4 select-none searchParams">
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
        <ul className="flex space-x-4">
          {filterParams.positions.sort().map((position, i) => (
            <li key={i}>{`${PositionObj[position]}`}</li>
          ))}
        </ul>
        <div className="flex flex-col space-y-1">
          {posts?.flat().map((post, index) => (
            <div
              key={index}
              onClick={() => setIsPostModalOpen(true)} // delegation
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
