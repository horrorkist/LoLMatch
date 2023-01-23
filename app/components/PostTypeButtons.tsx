import { PostType } from "../page";

interface PostTypeButtonsProps {
  handleRecruitChange: (e: React.MouseEvent<HTMLButtonElement>) => void;
  postType: number;
}

function PostTypeButtons({
  handleRecruitChange,
  postType,
}: PostTypeButtonsProps) {
  return (
    <div className="flex space-x-2 type">
      <button
        onClick={handleRecruitChange}
        data-post_type={PostType.RECRUIT}
        className={`flex rounded-md items-center justify-center h-12 px-2 cursor-pointer ${
          postType === PostType.RECRUIT
            ? "bg-blue-500 text-white"
            : "bg-white border border-black text-black"
        }`}
      >
        구인 글 보기
      </button>
      <button
        onClick={handleRecruitChange}
        data-post_type={PostType.JOIN}
        className={`flex rounded-md items-center justify-center h-12 px-2 cursor-pointer ${
          postType === PostType.JOIN
            ? "bg-blue-500 text-white"
            : "bg-white border border-black text-black"
        }`}
      >
        구직 글 보기
      </button>
    </div>
  );
}

export default PostTypeButtons;
